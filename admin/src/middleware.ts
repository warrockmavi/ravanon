import { NextRequest, NextResponse } from "next/server";
import { isPublicApiRoute } from "@/lib/auth/api-routes";
import { SESSION_COOKIE, verifySessionTokenEdge } from "@/lib/auth/session-edge";

const CORS_ORIGINS = [
  "http://localhost:8765",
  "http://127.0.0.1:8765",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function corsHeaders(origin: string) {
  const headers = new Headers();
  if (CORS_ORIGINS.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
  }
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return headers;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin") ?? "";

  if (pathname.startsWith("/api/")) {
    const headers = corsHeaders(origin);
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers });
    }

    if (!isPublicApiRoute(pathname, request.method)) {
      const session = await verifySessionTokenEdge(request.cookies.get(SESSION_COOKIE)?.value);
      if (!session) {
        const res = NextResponse.json({ error: "Oturum gerekli" }, { status: 401 });
        headers.forEach((v, k) => res.headers.set(k, v));
        return res;
      }
    }

    const response = NextResponse.next();
    headers.forEach((v, k) => response.headers.set(k, v));
    return response;
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = await verifySessionTokenEdge(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  if (pathname === "/admin/login") {
    const session = await verifySessionTokenEdge(request.cookies.get(SESSION_COOKIE)?.value);
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};