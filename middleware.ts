import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 0. Ensure robots.txt, sitemap.xml, static assets, and public routes are never intercepted
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.svg" ||
    pathname.endsWith(".html") ||
    pathname.endsWith(".xml") ||
    pathname.endsWith(".txt")
  ) {
    return NextResponse.next();
  }

  // 1. Immediately redirect any login / signup / auth pages to /humanizer
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return NextResponse.redirect(new URL("/humanizer", req.url), 301);
  }

  // 2. Enforce HTTPS in production behind reverse proxies (Render / Cloudflare)
  const proto = req.headers.get("x-forwarded-proto");
  const host = req.headers.get("host");
  if (
    process.env.NODE_ENV === "production" &&
    proto === "http" &&
    host &&
    !host.includes("localhost")
  ) {
    return NextResponse.redirect(`https://${host}${pathname}${search}`, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|robots.txt|sitemap.xml).*)",
  ],
};

