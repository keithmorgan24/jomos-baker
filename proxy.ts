import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Allow login page and login API without authentication
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isDriverApi = pathname.startsWith("/api/drivers");
  const isVerifyDriverApi = pathname.startsWith("/api/verify-driver");
  const isMenuMutation = pathname.startsWith("/api/menu") && method !== "GET";

  const isProtected =
    isAdminPage || isAdminApi || isDriverApi || isVerifyDriverApi || isMenuMutation;

  if (!isProtected) {
    return NextResponse.next();
  }

  // Verify admin token
  const token = request.cookies.get("admin_token");
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!token || token.value !== secret) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
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