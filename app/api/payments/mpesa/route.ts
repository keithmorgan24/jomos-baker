import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getMpesaToken, getMpesaPassword } from '@/lib/mpesa';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { orderId, phone } = await request.json();
    await dbConnect();

    // 1. Find the order and verify the amount (Audit: HIGH-001)
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Format phone number (must be 254...)
    const formattedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone;

    // 3. Get M-Pesa Credentials
    const token = await getMpesaToken();
    const { password, timestamp } = getMpesaPassword();

    // 4. Trigger STK Push
    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/query', // Use proper sandbox/prod URL
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(order.subtotal), // Ensure it's a whole number
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,
        AccountReference: `JomoBaker-${orderId.slice(-5)}`,
        TransactionDesc: 'Bakery Order Payment'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // 5. Save the CheckoutRequestID to the order so we can match the callback later
    order.mpesaCheckoutId = stkResponse.data.CheckoutRequestID;
    await order.save();

    return NextResponse.json({ success: true, message: "STK Push sent" });

  } catch (error: any) {
    console.error("STK Push Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}