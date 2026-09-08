import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { confirmation, password } = body;

    if (confirmation !== "DELETE MY ACCOUNT") {
      return NextResponse.json(
        {
          success: false,
          error: 'Please type "DELETE MY ACCOUNT" to confirm permanent account deletion.',
        },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, passwordHash: true },
    });

    if (dbUser?.passwordHash) {
      if (!password) {
        return NextResponse.json(
          { success: false, error: "Password is required to delete your account." },
          { status: 400 }
        );
      }
      const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: "Incorrect password. Account deletion aborted." },
          { status: 400 }
        );
      }
    }

    // Delete user (Prisma onDelete: Cascade removes accounts, sessions, documents, creditBalance)
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Account and associated data deleted permanently.",
    });
  } catch (err: any) {
    console.error("Account deletion error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
