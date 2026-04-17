import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const typedPassword = (password || "").trim();

    // 🛑 WE ARE IGNORING THE .ENV FILE COMPLETELY NOW
    // This is the EXACT hash for 'JomoAdmin2026'
    const manualHash = "$2b$10$QIQQSriAPPSQ4KNY2eOtBOnWf3v5jknYb1cdl/uEYFd2XmcCrVpO2";

    console.log("--- EMERGENCY BYPASS ---");
    console.log(`Typed: [${typedPassword}] (Len: ${typedPassword.length})`);
    console.log(`Using Manual Hash (Len: ${manualHash.length})`);

    const isMatch = await bcrypt.compare(typedPassword, manualHash);

    if (isMatch) {
      console.log("✅ SUCCESS: Bcrypt match with manual hash!");
      const cookieStore = await cookies();
      cookieStore.set("admin_token", "secure_vault_access_granted_2026_xyz", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      return NextResponse.json({ success: true });
    } else {
      console.log("❌ FAIL: Even the manual hash didn't match.");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}