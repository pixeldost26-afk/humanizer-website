import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname, search } = req.nextUrl;
    const token = req.nextauth?.token;

    // 1. Enforce HTTPS in production behind reverse proxies (Render / Cloudflare)
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

    // 2. Strict Role-Based Admin Protection
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (!token || token.role !== "ADMIN") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { success: false, error: "Access denied. Administrator role required." },
            { status: 403 }
          );
        }
        // Redirect non-admin authenticated users to /dashboard
        const redirectUrl = new URL("/dashboard", req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Require active token for all protected routes
        if (!token) return false;
        // Admin routes strictly require ADMIN role
        if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
          return token.role === "ADMIN";
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/humanizer",
    "/humanizer/:path*",
    "/ai-detector",
    "/ai-detector/:path*",
    "/ai-writer",
    "/ai-writer/:path*",
    "/paraphraser",
    "/paraphraser/:path*",
    "/grammar",
    "/grammar/:path*",
    "/summarizer",
    "/summarizer/:path*",
    "/tone",
    "/tone/:path*",
    "/history",
    "/history/:path*",
    "/settings",
    "/settings/:path*",
    "/billing",
    "/billing/:path*",
  ],
};
