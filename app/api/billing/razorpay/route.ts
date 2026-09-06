import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createRazorpayOrder } from "@/lib/billing/razorpay";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const userId = user?.id || "user-default-id";

  try {
    const body = await req.json();
    const { planId } = body;

    const amountInInr = planId === "BUSINESS" ? 3200 : 1200;

    const order = await createRazorpayOrder({
      amount: amountInInr,
      receipt: `receipt_${userId.slice(-6)}_${Date.now()}`,
      notes: { userId, planId },
    });

    // Record pending payment
    await prisma.payment.create({
      data: {
        userId,
        amount: amountInInr * 100,
        currency: "INR",
        provider: "RAZORPAY",
        status: "SUCCEEDED", // simulated success in dev
        transactionId: order.id,
      },
    });

    return NextResponse.json({ success: true, data: order, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Razorpay order generation failed" },
      { status: 500 }
    );
  }
}
