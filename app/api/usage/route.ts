import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { getUserCreditBalance } from "@/lib/usage/credit-service";
import prisma from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    const balance = await getUserCreditBalance(user.id);

    // Get active subscription
    const sub = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    // Get 7-day usage history
    const usageRecords = await prisma.usage.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
      take: 7,
    });

    // Get total words processed
    const totalWords = await prisma.toolRequest.aggregate({
      where: { userId: user.id },
      _sum: { wordsProcessed: true },
      _count: { id: true },
    });

    // Tool breakdown
    const toolCounts = await prisma.toolRequest.groupBy({
      by: ["tool"],
      where: { userId: user.id },
      _count: { id: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        balance,
        plan: sub?.planId || "FREE",
        status: sub?.status || "ACTIVE",
        periodEnd: sub?.currentPeriodEnd || new Date(Date.now() + 30 * 86400000),
        totalWordsProcessed: totalWords._sum.wordsProcessed || 0,
        totalOperations: totalWords._count.id || 0,
        usageHistory: usageRecords.map((r) => ({
          date: r.date,
          words: r.wordsTotal,
          checks: r.checksCount,
        })),
        toolBreakdown: toolCounts.map((tc) => ({
          tool: tc.tool,
          count: tc._count.id,
        })),
      },
      error: null,
    });
  } catch (error) {
    console.error("Error fetching usage:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load usage data." },
      { status: 500 }
    );
  }
}
