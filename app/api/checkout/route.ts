import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Item from '@/models/Item';
import { CheckoutSchema, validateInput } from '@/lib/validationSchemas';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // INPUT VALIDATION: Validate request body
    const validation = validateInput(CheckoutSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: `Invalid input: ${validation.error}` },
        { status: 400 }
      );
    }

    const { customer, items } = validation.data!;

    // 1. Fetch current items from DB to get AUTHENTIC prices
    const itemIds = items.map(i => i.menuItemId);
    const dbItems = await Item.find({ _id: { $in: itemIds } });
    const dbItemMap = new Map(dbItems.map(item => [item._id.toString(), item]));
    
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    // 2. Server-side Calculation - verify prices and availability
    for (const cartItem of items) {
      const dbItem = dbItemMap.get(cartItem.menuItemId);
      
      if (!dbItem || dbItem.isAvailable === false) {
        return NextResponse.json(
          { error: `Item "${cartItem.name}" is no longer available.` }, 
          { status: 410 }
        );
      }

      // Use the price from database, NOT the frontend
      const price = dbItem.price;
      const quantity = cartItem.quantity;
      
      calculatedSubtotal += price * quantity;

      verifiedItems.push({
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: price,
        quantity: quantity
      });
    }

    // 3. Create order with SERVER-CALCULATED subtotal
    const newOrder = await Order.create({
      customer,
      items: verifiedItems,
      subtotal: calculatedSubtotal, 
      status: 'pending',
    });

    // 4. Log attempts to tamper
    if (Math.abs(calculatedSubtotal - 0) > 0.01) {
      console.info({
        event: 'order_created',
        orderId: newOrder._id,
        subtotal: calculatedSubtotal,
        itemCount: items.length,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({ 
      success: true, 
      orderId: newOrder._id,
      amount: calculatedSubtotal
    }, { status: 201 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}