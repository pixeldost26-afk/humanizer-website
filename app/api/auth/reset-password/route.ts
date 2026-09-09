import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check if user exists (without leaking result to the client)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    });

    if (user) {
      // Log for security auditing
      console.log(`[Security Audit] Password reset requested for user account: ${user.email}`);
      // In production with email delivery enabled (SMTP / Resend), dispatch a signed reset token link here.
    } else {
      console.log(`[Security Audit] Password reset requested for non-existent email: ${normalizedEmail}`);
    }

    // Always return uniform, privacy-safe response to prevent user enumeration
    return NextResponse.json({
      success: true,
      message:
        "If an account is associated with this email address, password reset instructions have been dispatched. Please check your inbox.",
    });
  } catch (error: any) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
