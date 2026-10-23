import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE } from "@/lib/admin-auth-cookie";

// 1. CORS for the app API (only needed by the app's web preview; phones don't use CORS).
// 2. Optimistic redirect to the admin login. Every admin page and action still checks for itself.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    };
    if (request.method === "OPTIONS") return new NextResponse(null, { status: 204, headers });
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
    return res;
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !request.cookies.has(ADMIN_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
