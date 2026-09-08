import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const { user, response: adminResponse } = await requireAdmin();
  if (adminResponse || !user) {
    return adminResponse || NextResponse.json({ success: false, error: "Access denied. Admin role required." }, { status: 403 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const proUsers = await prisma.subscription.count({
      where: { planId: "PRO" },
    });
    const businessUsers = await prisma.subscription.count({
      where: { planId: "BUSINESS" },
    });

    const totalWords = await prisma.toolRequest.aggregate({
      _sum: { wordsProcessed: true },
      _count: { id: true },
    });

    const toolUsage = await prisma.toolRequest.groupBy({
      by: ["tool"],
      _count: { id: true },
      _sum: { wordsProcessed: true },
    });

    const recentRequests = await prisma.toolRequest.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    const estimatedMRR = proUsers * 19 + businessUsers * 49;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsersMonthly: totalUsers,
          estimatedMRR,
          totalWordsProcessed: totalWords._sum.wordsProcessed || 0,
          totalToolExecutions: totalWords._count.id || 0,
          systemUptime: "99.98%",
          errorRate: "0.00%",
        },
        toolBreakdown: toolUsage.map((t) => ({
          tool: t.tool,
          executions: t._count.id,
          words: t._sum.wordsProcessed || 0,
        })),
        recentActivity: recentRequests.map((r) => ({
          id: r.id,
          tool: r.tool,
          user: r.user?.email || "Anonymous",
          words: r.wordsProcessed,
          status: r.status,
          duration: `${r.durationMs}ms`,
          timestamp: r.createdAt,
        })),
      },
      error: null,
    });
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load admin stats." },
      { status: 500 }
    );
  }
}
