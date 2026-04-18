import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Body } = body;

    // 1. Check if the transaction was successful (ResultCode 0)
    if (Body.stkCallback.ResultCode === 0) {
      const metadata = Body.stkCallback.CallbackMetadata.Item;
      const mpesaReceipt = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      const amount = metadata.find((i: any) => i.Name === 'Amount')?.Value;
      
      // The AccountReference we sent earlier (Order_ID)
      const orderId = Body.stkCallback.MerchantRequestID; 

      await dbConnect();
      
      // 2. Update the order status in MongoDB
      await Order.findOneAndUpdate(
        { mpesaRequestId: orderId }, // You'll need to store the RequestID during the POST
        { 
          status: 'paid',
          paymentDetails: {
            method: 'mpesa',
            receipt: mpesaReceipt,
            amount: amount,
            paidAt: new Date()
          }
        }
      );

      console.log(`✅ Order ${orderId} marked as PAID. Receipt: ${mpesaReceipt}`);
    } else {
      console.log(`❌ Payment Failed/Cancelled: ${Body.stkCallback.ResultDesc}`);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("CALLBACK_ERROR:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" });
  }
}