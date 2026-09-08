import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { createCustomerPortalSession } from "@/lib/billing/stripe";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const { user, response: authResponse } = await requireAuth();
    if (authResponse || !user) {
      return authResponse;
    }

    const sub = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });


    if (!sub?.stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          error: "No active Stripe customer found for this account. Upgrade to a paid plan first.",
        },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const portal = await createCustomerPortalSession({
      customerId: sub.stripeCustomerId,
      returnUrl: `${appUrl}/billing`,
    });

    return NextResponse.json({ success: true, data: portal, error: null });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.status === 401) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Stripe customer portal error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create portal session." },
      { status: 500 }
    );
  }
}

