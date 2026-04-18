import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Validate critical environment on middleware startup
function validateSecrets(): void {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 64) {
    throw new Error(`JWT_SECRET must be at least 64 characters (512 bits), got ${jwtSecret?.length || 0}`);
  }
  
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminHash || (!adminHash.startsWith('$2b$') && !adminHash.startsWith('$2a$'))) {
    throw new Error('ADMIN_PASSWORD_HASH must be a valid bcrypt hash');
  }
}

// Run validation once
validateSecrets();

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. PUBLIC ZONES: Allow login pages/APIs to load
  if (pathname === "/admin/login" || pathname === "/api/admin/login" || pathname === "/auth/login") {
    return NextResponse.next();
  }

  // 2. PROTECTED ZONES: Define what requires a "Sovereign" key
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isDriverApi = pathname.startsWith("/api/drivers");
  const isVerifyDriverApi = pathname.startsWith("/api/verify-driver");
  // Only protect Menu if it's an attempt to CHANGE data (POST/PUT/DELETE)
  const isMenuMutation = pathname.startsWith("/api/menu") && method !== "GET";

  const isProtected = isAdminPage || isAdminApi || isDriverApi || isVerifyDriverApi || isMenuMutation;

  if (!isProtected) {
    return NextResponse.next();
  }

  // 3. THE VAULT CHECK: Verify the JWT
  // Note: We use 'admin_session' to match our Step 30 Login Logic
  const token = request.cookies.get('admin_session')?.value;
  const secretKey = process.env.JWT_SECRET;

  if (!token || !secretKey) {
    return handleUnauthorized(request, pathname);
  }

  try {
    const secret = new TextEncoder().encode(secretKey);
    await jwtVerify(token, secret);
    
    return NextResponse.next();
  } catch (error) {
    console.error("Sovereign Guard blocked access:", (error as Error).message);
    return handleUnauthorized(request, pathname);
  }
}

// Consistently handle boots-to-login or JSON errors
function handleUnauthorized(request: NextRequest, pathname: string) {
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Unauthorized: Admin privileges required for Jomo's Baker" },
      { status: 401 }
    );
  }
  // Redirect to your specific login route
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/drivers/:path*",
    "/api/verify-driver/:path*",
    "/api/menu/:path*",
  ],
};