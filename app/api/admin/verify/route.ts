import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");
    
    // This matches the hardcoded secret in your login bypass
    const expectedSecret = "secure_vault_access_granted_2026_xyz";

    if (!token || token.value !== expectedSecret) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}