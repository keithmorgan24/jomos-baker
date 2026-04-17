import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { orderId, status } = await req.json();

    const db = mongoose.connection.db;
    if (!db) throw new Error("Database offline");

    // Update the specific order's status
    await db.collection("orders").updateOne(
      { _id: new mongoose.Types.ObjectId(orderId) },
      { $set: { status: status } }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Update Error:", e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}