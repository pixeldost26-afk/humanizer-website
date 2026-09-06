import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (user && user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Access denied. Admin role required." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  try {
    const users = await prisma.user.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query } },
              { email: { contains: query } },
            ],
          }
        : undefined,
      include: {
        creditBalance: true,
        subscription: true,
        _count: {
          select: { documents: true, toolRequests: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: users, error: null });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch user directory." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (user && user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Access denied. Admin role required." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { userId, role, planId, addBonusCredits } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }

    if (role) {
      await prisma.user.update({
        where: { id: userId },
        data: { role },
      });
    }

    if (planId) {
      await prisma.subscription.upsert({
        where: { userId },
        update: { planId },
        create: {
          userId,
          planId,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
        },
      });
    }

    if (addBonusCredits && typeof addBonusCredits === "number") {
      await prisma.creditBalance.upsert({
        where: { userId },
        update: { bonusCredits: { increment: addBonusCredits } },
        create: {
          userId,
          monthlyCredits: 1000,
          bonusCredits: addBonusCredits,
        },
      });
    }

    // Log admin action
    if (user?.id) {
      await prisma.adminLog.create({
        data: {
          adminId: user.id,
          action: "UPDATE_USER_SETTINGS",
          targetUserId: userId,
          details: JSON.stringify({ role, planId, addBonusCredits }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { message: "User updated successfully" },
      error: null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update user." },
      { status: 500 }
    );
  }
}
