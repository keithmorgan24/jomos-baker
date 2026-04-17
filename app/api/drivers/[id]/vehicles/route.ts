import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Driver from '@/models/Driver';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { Import } from 'lucide-react';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token || token.value !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { db } = await dbConnect();
  const { id } = params;
  const body = await req.json();

  try {
    const updatedDriver = await db.collection('drivers').updateOne(
      { _id: new ObjectId(id) },
      { $push: { vehicles: body } },
      { upsert: false }
    );

    if (updatedDriver.matchedCount === 0) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (_err) {
    return NextResponse.json({ error: "Failed to link vehicle" }, { status: 500 });
  }
}