import axios from 'axios';

// 1. Generate M-Pesa Access Token
export const getMpesaToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("M-Pesa Token Error:", error);
    throw new Error("Failed to authenticate with M-Pesa");
  }
};

// 2. Generate Password and Timestamp for STK Push
export const getMpesaPassword = () => {
  const shortCode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

  return { password, timestamp };
};