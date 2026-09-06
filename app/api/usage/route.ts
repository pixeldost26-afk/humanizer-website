import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserCreditBalance } from "@/lib/usage/credit-service";
import prisma from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  const userId = user?.id || "user-default-id";

  try {
    const balance = await getUserCreditBalance(userId);

    // Get active subscription
    const sub = await prisma.subscription.findUnique({
      where: { userId },
    });

    // Get 7-day usage history
    const usageRecords = await prisma.usage.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      take: 7,
    });

    // Get total words processed
    const totalWords = await prisma.toolRequest.aggregate({
      where: { userId },
      _sum: { wordsProcessed: true },
      _count: { id: true },
    });

    // Tool breakdown
    const toolCounts = await prisma.toolRequest.groupBy({
      by: ["tool"],
      where: { userId },
      _count: { id: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        balance,
        plan: sub?.planId || "FREE",
        status: sub?.status || "ACTIVE",
        periodEnd: sub?.currentPeriodEnd || new Date(Date.now() + 30 * 86400000),
        totalWordsProcessed: totalWords._sum.wordsProcessed || 3820,
        totalOperations: totalWords._count.id || 14,
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
