import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { pusherServer } from '@/lib/pusher'; // 1. Ensure this import exists

const CheckoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    address: z.string().min(5),
  }),
  items: z.array(z.object({
    _id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
  })),
  subtotal: z.number(),
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // 2. Validation
    const validation = CheckoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Invalid order data", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { customer, items, subtotal } = validation.data;

    // 3. Database Persistence
    const newOrder = await Order.create({
      customer,
      items: items.map(item => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      status: 'pending',
    });

    // 4. Real-Time Pulse (Must happen BEFORE the return)
    // We wrap this in an attempt to ensure checkout succeeds even if Pusher fails
    try {
      await pusherServer.trigger('admin-orders', 'new-order', {
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customer.name,
        subtotal: newOrder.subtotal,
        createdAt: newOrder.createdAt,
      });
    } catch (pusherError) {
      console.error("PUSHER_TRIGGER_ERROR:", pusherError);
      // We don't return here; the order is saved, so we still want the user to see 'Success'
    }

    // 5. Cache Invalidation
    revalidatePath('/admin/orders');

    return NextResponse.json({ 
      success: true, 
      orderNumber: newOrder.orderNumber,
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error("CRITICAL_CHECKOUT_ERROR:", error.message);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}