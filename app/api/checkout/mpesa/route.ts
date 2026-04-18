import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // --- DEBUG SECTION: CHECK TERMINAL AFTER RUNNING POSTMAN ---
  const key = process.env.MPESA_CONSUMER_KEY?.trim();
  const secret = process.env.MPESA_CONSUMER_SECRET?.trim();
  
  console.log("DEBUG: Key Length is", key?.length); // Should be 48
  console.log("DEBUG: Secret Length is", secret?.length); // Should be 64
  // -----------------------------------------------------------

  try {
    const { phone, amount, orderId } = await request.json();

    const auth = Buffer.from(`${key}:${secret}`).toString('base64');

    const tokenRes = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { 
        headers: { Authorization: `Basic ${auth}` },
        cache: 'no-store' 
      }
    );

    if (!tokenRes.ok) {
      const errorData = await tokenRes.text();
      console.error("🚨 DARAJA_REJECTION:", errorData);
      return NextResponse.json({ error: "Safaricom Auth Failed", details: errorData }, { status: 401 });
    }
    
    const { access_token } = await tokenRes.json();

    // 2. Prepare the STK Push Request
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const stkBody = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: phone, 
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/mpesa/callback`,
      AccountReference: `Order_${orderId}`,
      TransactionDesc: "Payment for Jomo's Baker"
    };

    // 3. Send the request to Daraja
    const stkRes = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkBody),
      }
    );

    const data = await stkRes.json();

    // Check if Safaricom accepted the request
    if (data.ResponseCode === "0") {
        return NextResponse.json({ 
            success: true, 
            message: "STK Push initiated", 
            MerchantRequestID: data.MerchantRequestID 
        });
    } else {
        return NextResponse.json({ 
            success: false, 
            error: data.CustomerMessage || "STK Push failed" 
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error("🚨 MPESA_STK_ERROR:", error);
    return NextResponse.json({ error: "Server connection failed" }, { status: 500 });
  }
}