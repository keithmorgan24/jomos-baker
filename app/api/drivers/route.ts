import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const onlyOnline = searchParams.get("online") === "true";
    
    // If ?online=true is in the URL, we filter. Otherwise, we get everyone.
    const query = onlyOnline ? { isOnline: true } : {};
    const drivers = await Driver.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(drivers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, phone, location } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const existingDriver = await Driver.findOne({ phone });
    if (existingDriver) {
      return NextResponse.json({ error: "Driver already exists" }, { status: 409 });
    }

    const newDriver = await Driver.create({
      name,
      phone,
      location: location || "",
      isOnline: false, // Default to offline when first registered
      verified: false,
      orders: 0,
      vehicles: [],
    });

    return NextResponse.json(newDriver, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create driver" }, { status: 500 });
  }
}

// DELETE remains identical to your original code
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const deleted = await Driver.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}