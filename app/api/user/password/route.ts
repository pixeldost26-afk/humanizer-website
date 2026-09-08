import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { changePasswordSchema } from "@/lib/validation/schemas";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parseResult = changePasswordSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parseResult.data;

    // Fetch user with current password hash
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, passwordHash: true },
    });

    if (!dbUser || !dbUser.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          error: "This account was registered using Google OAuth and does not have a direct password.",
        },
        { status: 400 }
      );
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Incorrect current password. Please re-enter." },
        { status: 400 }
      );
    }

    // Hash and update new password
    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (err: any) {
    console.error("Password update error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to change password. Please try again." },
      { status: 500 }
    );
  }
}
