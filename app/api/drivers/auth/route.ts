import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Driver from '@/models/Driver';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { phone, action } = await request.json();

    // Find the driver by the phone number displayed in your Fleet Vault
    const driver = await Driver.findOne({ phone });
    
    if (!driver) {
      return NextResponse.json({ error: "Driver not found in system" }, { status: 404 });
    }

    // Set online status
    driver.isOnline = (action === 'login');
    await driver.save();

    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}