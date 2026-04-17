import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  const hash = await bcrypt.hash("JomoAdmin2026", 10);
  return NextResponse.json({ your_hash: hash });
}