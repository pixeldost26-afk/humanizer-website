import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/signup", // Direct unauthenticated visitors to sign up first
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/humanizer/:path*",
    "/ai-detector/:path*",
    "/ai-writer/:path*",
    "/paraphraser/:path*",
    "/grammar/:path*",
    "/summarizer/:path*",
    "/tone/:path*",
    "/history/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/admin/:path*",
  ],
};
