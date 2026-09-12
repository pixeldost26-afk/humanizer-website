import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { createCheckoutSession } from "@/lib/billing/stripe";

export async function POST(req: NextRequest) {
  try {
    const { user, response: authResponse } = await requireAuth();
    if (authResponse || !user) {
      return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const { planId, billingCycle } = body;

    if (!["PRO", "BUSINESS"].includes(planId)) {
      return NextResponse.json(
        { success: false, error: "Invalid plan selected. Must be PRO or BUSINESS." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      planId,
      billingCycle: billingCycle || "monthly",
      successUrl: `${appUrl}/billing?success=true`,
      cancelUrl: `${appUrl}/billing?canceled=true`,
    });


    return NextResponse.json({ success: true, data: session, error: null });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.status === 401) {
      return NextResponse.json(
        { success: false, error: "You must be signed in to upgrade your subscription." },
        { status: 401 }
      );
    }

    console.error("Billing checkout error:", error);
    const statusCode = error.message?.includes("not configured") ? 503 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize checkout session." },
      { status: statusCode }
    );
  }
}

