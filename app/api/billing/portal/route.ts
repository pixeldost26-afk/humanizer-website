import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createCustomerPortalSession } from "@/lib/billing/stripe";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const userId = user?.id || "user-default-id";

  try {
    const sub = await prisma.subscription.findUnique({
      where: { userId },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const portal = await createCustomerPortalSession({
      customerId: sub?.stripeCustomerId || undefined,
      returnUrl: `${appUrl}/billing`,
    });

    return NextResponse.json({ success: true, data: portal, error: null });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to create portal session." },
      { status: 500 }
    );
  }
}
