import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { verifyRazorpayPaymentSignature } from "@/lib/billing/razorpay";
import { PRICING_PLANS } from "@/lib/billing/plans";
import prisma from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { user, response: authResponse } = await requireAuth();
    if (authResponse || !user) {
      return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required Razorpay payment verification parameters." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret is not configured on the server." },
        { status: 500 }
      );
    }

    const isValid = verifyRazorpayPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret
    );

    if (!isValid) {
      console.warn(
        `Razorpay payment verification failed for user ${user.id}, order ${razorpay_order_id}`
      );
      return NextResponse.json(
        { success: false, error: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    const targetPlan = (planId?.toUpperCase() as "PRO" | "BUSINESS") || "PRO";
    const planConfig = PRICING_PLANS[targetPlan] || PRICING_PLANS.PRO;
    const credits = planConfig.monthlyCredits || 50000;
    const amountInPaise = targetPlan === "BUSINESS" ? 320000 : 120000;

    await prisma.$transaction([
      // Update or create payment record
      prisma.payment.upsert({
        where: { transactionId: razorpay_payment_id },
        update: {
          status: "SUCCEEDED",
        },
        create: {
          userId: user.id,
          amount: amountInPaise,
          currency: "INR",
          provider: "RAZORPAY",
          status: "SUCCEEDED",
          transactionId: razorpay_payment_id,
        },
      }),

      // Upgrade subscription
      prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          planId: targetPlan,
          status: "ACTIVE",
          razorpaySubscriptionId: razorpay_order_id,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
          cancelAtPeriodEnd: false,
        },
        create: {
          userId: user.id,
          planId: targetPlan,
          status: "ACTIVE",
          razorpaySubscriptionId: razorpay_order_id,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
          cancelAtPeriodEnd: false,
        },
      }),

      // Refill credits
      prisma.creditBalance.upsert({
        where: { userId: user.id },
        update: {
          monthlyCredits: credits,
          usedCredits: 0,
          lastRefillDate: new Date(),
        },
        create: {
          userId: user.id,
          monthlyCredits: credits,
          usedCredits: 0,
          lastRefillDate: new Date(),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        verified: true,
        planId: targetPlan,
        credits,
      },
      error: null,
    });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized") || err.status === 401) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Razorpay verification error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify Razorpay payment." },
      { status: 500 }
    );
  }
}
