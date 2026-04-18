import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

async function getAuthenticatedUser(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  
  if (!token) return null;
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const verified = await jwtVerify(token, secret);
    return verified;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    // CRITICAL: Check authentication before accessing orders
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    // 1. Get the limit from the URL (e.g., /api/orders?limit=5)
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

    // 2. Only admins see all orders; customers see only their own
    let query = {};
    if (user.role !== 'admin') {
      query = { 'customer.phone': user.phone };
    }

    // 3. Fetch orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" }, 
      { status: 500 }
    );
  }
}