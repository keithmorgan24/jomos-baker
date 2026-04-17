import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // 1. Get the limit from the URL (e.g., /api/orders?limit=5)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // 2. Fetch the most recent orders
    // We sort by 'createdAt' in descending order (-1)
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(); // .lean() makes the query faster for read-only tasks

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" }, 
      { status: 500 }
    );
  }
}