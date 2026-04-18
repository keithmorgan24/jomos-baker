import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';

export async function GET() {
  try {
    await dbConnect();
    
    // Only fetch active or busy drivers to keep the map clean
    const activeDrivers = await Driver.find({
      status: { $in: ['active', 'busy'] },
      lastLocation: { $exists: true }
    }).select('name status lastLocation updatedAt');

    return NextResponse.json(activeDrivers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fleet data" }, { status: 500 });
  }
}