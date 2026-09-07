import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password } = body;

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

    // Look up the user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true },
    });

    // Action: Verify email existence
    if (action === "verify") {
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: "No account found with this email. Please check your spelling or create a new account.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Account verified successfully.",
        user: {
          name: user.name || "User",
          email: user.email,
        },
      });
    }

    // Action: Reset password
    if (action === "reset") {
      if (!password || String(password).length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: "No account found with this email address.",
          },
          { status: 404 }
        );
      }

      // Hash new password securely
      const passwordHash = await bcrypt.hash(password, 10);

      // Update password hash in database
      await prisma.user.update({
        where: { email: normalizedEmail },
        data: { passwordHash },
      });

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully updated. You can now sign in.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
