import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database offline");

    // Fetch ALL orders for this driver to calculate stats
    const allOrders = await db.collection("orders")
      .find({ driverPhone: phone })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(allOrders);
  } catch (e) {
    console.error("Database Error:", e);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}