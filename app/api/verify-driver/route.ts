import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  return token?.value === process.env.ADMIN_SESSION_SECRET;
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { phone, name, location } = body;

    // Step 1: Validate required fields
    if (!phone || !name) {
      return NextResponse.json(
        { error: "Missing required driver details" },
        { status: 400 }
      );
    }

    // Step 2: Check if phone number is already registered
    const existingDriver = await Driver.findOne({ phone: phone.trim() });

    if (existingDriver) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 }
      );
    }

    // Step 3: Create new driver and verify them
    const driver = await Driver.create({
      name: name.trim(),
      phone: phone.trim(),
      location: location ? location.trim() : "",
      verified: true,
      orders: 0,
      vehicles: [],
    });

    // TODO: Send welcome SMS to new driver
    console.log(
      `SMS would be sent to ${phone}: Welcome to Jomo's Baker fleet, ${name}!`
    );

    return NextResponse.json(
      {
        verified: true,
        message: "Driver registered and verified successfully",
        driver,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "VERIFY_DRIVER_ERROR:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Fleet registry offline" },
      { status: 500 }
    );
  }
}