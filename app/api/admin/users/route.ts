import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const { user, response: adminResponse } = await requireAdmin();
  if (adminResponse || !user) {
    return adminResponse || NextResponse.json({ success: false, error: "Access denied. Admin role required." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  try {
    const users = await prisma.user.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
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
    console.error("Admin user directory error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user directory." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { user, response: adminResponse } = await requireAdmin();
  if (adminResponse || !user) {
    return adminResponse || NextResponse.json({ success: false, error: "Access denied. Admin role required." }, { status: 403 });
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

    if (role && ["USER", "ADMIN"].includes(role)) {
      await prisma.user.update({
        where: { id: userId },
        data: { role },
      });
    }

    if (planId && ["FREE", "PRO", "BUSINESS"].includes(planId)) {
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

    if (addBonusCredits && typeof addBonusCredits === "number" && addBonusCredits > 0) {
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

    // Record admin log for audit trail
    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: "UPDATE_USER_SETTINGS",
        targetUserId: userId,
        details: JSON.stringify({ role, planId, addBonusCredits }),
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: "User updated successfully" },
      error: null,
    });
  } catch (err: any) {
    console.error("Admin user update error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update user." },
      { status: 500 }
    );
  }
}
