import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Order from '@/models/Order';
import { pusherServer } from '@/lib/pusher';

const SAFARICOM_IPS = ['196.201.214.', '196.201.218.'];

function isSafaricomIP(ip: string): boolean {
  return SAFARICOM_IPS.some(prefix => ip.startsWith(prefix));
}

export async function POST(req: Request) {
  try {
    // 1. IP VALIDATION (CRITICAL FIX)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    if (process.env.NODE_ENV === 'production' && !isSafaricomIP(ip)) {
      console.error(`SECURITY: Invalid M-Pesa callback IP: ${ip}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid source IP" });
    }

    const body = await req.json();
    const { Body } = body;

    // 2. INSTANT HANDSHAKE WITH SAFARICOM
    if (!Body?.stkCallback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid Request" });
    }

    const { ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = Body.stkCallback;

    // 3. HANDLE FAILED PAYMENTS
    if (ResultCode !== 0) {
      console.log(`Payment failed for ${CheckoutRequestID}: ${ResultDesc}`);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Acknowledged" });
    }

    // 4. EXTRACT METADATA SAFELY
    const getMeta = (name: string) => 
      CallbackMetadata?.Item?.find((i: any) => i.Name === name)?.Value;
    
    const amount = getMeta('Amount');
    const receipt = getMeta('MpesaReceiptNumber');
    const phone = getMeta('PhoneNumber');

    if (!amount || !receipt || !phone) {
      console.error(`Missing callback data: amount=${amount}, receipt=${receipt}, phone=${phone}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Missing data" });
    }

    await dbConnect();

    // 5. IDEMPOTENCY CHECK WITH ATOMIC CONSTRAINT
    const existingOrder = await Order.findOne({ mpesaReceipt: receipt });
    if (existingOrder) {
      console.log(`Duplicate callback prevented for receipt: ${receipt}`);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Already Processed" });
    }

    // 6. FETCH ORDER AND VERIFY AMOUNT (CRITICAL FIX - PREVENT FRAUD)
    const order = await Order.findOne({ checkoutRequestId: CheckoutRequestID });
    if (!order) {
      console.error(`Order not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Order not found" });
    }

    // CRITICAL: Verify amount matches order total (within 0.1 KES tolerance)
    if (Math.abs(amount - order.subtotal) > 0.1) {
      console.error(
        `FRAUD ALERT: Amount mismatch for ${receipt}. ` +
        `Expected: ${order.subtotal}, Received: ${amount}`
      );
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Amount verification failed" });
    }

    // 7. ATOMIC UPDATE: Ensure payment not already recorded
    const updatedOrder = await Order.findOneAndUpdate(
      { 
        checkoutRequestId: CheckoutRequestID,
        mpesaReceipt: { $exists: false }
      },
      { 
        status: 'Paid',
        mpesaReceipt: receipt,
        paidAt: new Date(),
        paymentStatus: 'paid',
        customerPhone: phone
      },
      { new: true }
    );

    if (!updatedOrder) {
      console.warn(`Order already processed for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Already Processed" });
    }

    // 8. LOG PAYMENT SUCCESS
    console.info({
      level: 'info',
      event: 'payment_success',
      orderId: updatedOrder._id,
      receipt,
      amount,
      timestamp: new Date().toISOString()
    });

    // 9. NOTIFY ADMIN DASHBOARD
    await pusherServer.trigger('admin-orders', 'payment-confirmed', {
      orderId: updatedOrder._id,
      amount,
      receipt,
      customerPhone: phone
    });

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });

  } catch (error) {
    console.error("CRITICAL: M-Pesa Bridge Failure:", error);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Internal Error Logged" }, { status: 500 });
  }
}