import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');
    const adminSecret = process.env.ADMIN_SESSION_SECRET;
    
    // Safety check for server config
    if (!adminSecret) {
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }
    
    // Direct server-to-server verification
    if (!adminToken || adminToken.value !== adminSecret) {
      return NextResponse.json({ authorized: false }, { status: 401 });
    }

    return NextResponse.json({ authorized: true });
  } catch (error) {
    return NextResponse.json({ error: "Auth verification failed" }, { status: 500 });
  }
}