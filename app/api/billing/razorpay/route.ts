import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { createRazorpayOrder } from "@/lib/billing/razorpay";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const { user, response: authResponse } = await requireAuth();
    if (authResponse || !user) {
      return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();

    const { planId } = body;

    if (!["PRO", "BUSINESS"].includes(planId)) {
      return NextResponse.json(
        { success: false, error: "Invalid plan selected. Must be PRO or BUSINESS." },
        { status: 400 }
      );
    }

    const amountInInr = planId === "BUSINESS" ? 3200 : 1200;

    const order = await createRazorpayOrder({
      amount: amountInInr,
      receipt: `receipt_${user.id.slice(-6)}_${Date.now()}`,
      notes: { userId: user.id, planId },
    });

    // Record pending payment
    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: amountInInr * 100, // paise
        currency: "INR",
        provider: "RAZORPAY",
        status: "PENDING",
        transactionId: order.id,
      },
    });

    return NextResponse.json({ success: true, data: order, error: null });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized") || err.status === 401) {
      return NextResponse.json(
        { success: false, error: "You must be signed in to purchase a plan." },
        { status: 401 }
      );
    }

    console.error("Razorpay order creation error:", err);
    const statusCode = err.message?.includes("not configured") ? 503 : 500;
    return NextResponse.json(
      { success: false, error: err.message || "Razorpay order generation failed" },
      { status: statusCode }
    );
  }
}

