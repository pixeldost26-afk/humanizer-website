import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createCheckoutSession } from "@/lib/billing/stripe";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const userId = user?.id || "user-default-id";
  const userEmail = user?.email || "user@humanizeai.com";

  try {
    const body = await req.json();
    const { planId, billingCycle } = body;

    if (!["PRO", "BUSINESS"].includes(planId)) {
      return NextResponse.json(
        { success: false, error: "Invalid plan selected." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create session
    const session = await createCheckoutSession({
      userId,
      userEmail,
      planId,
      billingCycle: billingCycle || "monthly",
      successUrl: `${appUrl}/billing?success=true`,
      cancelUrl: `${appUrl}/billing?canceled=true`,
    });

    // If demo upgrade triggered, update user's plan in DB immediately to test the feature
    if (session.isDemo) {
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          planId,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
        },
        create: {
          userId,
          planId,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
        },
      });

      // Refill credits corresponding to upgraded tier
      const credits = planId === "BUSINESS" ? 250000 : 50000;
      await prisma.creditBalance.upsert({
        where: { userId },
        update: {
          monthlyCredits: credits,
          usedCredits: 0,
        },
        create: {
          userId,
          monthlyCredits: credits,
          usedCredits: 0,
        },
      });
    }

    return NextResponse.json({ success: true, data: session, error: null });
  } catch (error: any) {
    console.error("Billing checkout error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize checkout." },
      { status: 500 }
    );
  }
}
