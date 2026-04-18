import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import crypto from "crypto";
import { loginLimiter } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // RATE LIMITING: Prevent brute force attacks
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (loginLimiter.isLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const typedPassword = (password || "").trim();

    // 1. Pull the hash from environment variables (Fixes CRIT-001)
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminHash) {
      console.error("CRITICAL: ADMIN_PASSWORD_HASH is not set in environment variables.");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const isMatch = await bcrypt.compare(typedPassword, adminHash);

    if (isMatch) {
      const cookieStore = await cookies();
      
      // 2. Require a secure secret for token generation
      const tokenSecret = process.env.ADMIN_SESSION_SECRET;
      
      if (!tokenSecret) {
        console.error("CRITICAL: ADMIN_SESSION_SECRET is not set in environment variables.");
        return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
      }

      // 3. Generate a cryptographically secure, dynamic token (Fixes CRIT-002)
      // Using an HMAC signature bound to a timestamp prevents forgery
      const timestamp = Date.now().toString();
      const signature = crypto.createHmac("sha256", tokenSecret).update(timestamp).digest("hex");
      const secureToken = `${timestamp}.${signature}`;

      // 4. Set secure cookie attributes including maxAge (Fixes CRIT-001)
      cookieStore.set("admin_session", secureToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // Expires in 24 hours
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}