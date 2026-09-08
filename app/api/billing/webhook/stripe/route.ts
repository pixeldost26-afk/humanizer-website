import { NextRequest, NextResponse } from "next/server";
import { verifyStripeWebhookSignature } from "@/lib/billing/stripe";
import { PRICING_PLANS } from "@/lib/billing/plans";
import prisma from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json(
      { error: "Webhook secret not configured on server" },
      { status: 500 }
    );
  }

  const signatureHeader = req.headers.get("stripe-signature");
  if (!signatureHeader) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read request body" },
      { status: 400 }
    );
  }

  const isValid = verifyStripeWebhookSignature(rawBody, signatureHeader, webhookSecret);
  if (!isValid) {
    console.warn("Stripe webhook HMAC signature verification failed.");
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const planId = (session.metadata?.planId?.toUpperCase() as "PRO" | "BUSINESS") || "PRO";

        if (userId) {
          const planConfig = PRICING_PLANS[planId] || PRICING_PLANS.PRO;
          const credits = planConfig.monthlyCredits || 50000;

          await prisma.$transaction([
            prisma.subscription.upsert({
              where: { userId },
              update: {
                planId,
                status: "ACTIVE",
                stripeCustomerId: session.customer?.toString() || null,
                stripeSubscriptionId: session.subscription?.toString() || null,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
                cancelAtPeriodEnd: false,
              },
              create: {
                userId,
                planId,
                status: "ACTIVE",
                stripeCustomerId: session.customer?.toString() || null,
                stripeSubscriptionId: session.subscription?.toString() || null,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
                cancelAtPeriodEnd: false,
              },
            }),
            prisma.creditBalance.upsert({
              where: { userId },
              update: {
                monthlyCredits: credits,
                usedCredits: 0,
                lastRefillDate: new Date(),
              },
              create: {
                userId,
                monthlyCredits: credits,
                usedCredits: 0,
                lastRefillDate: new Date(),
              },
            }),
            prisma.payment.upsert({
              where: { transactionId: session.id },
              update: {
                status: "SUCCEEDED",
              },
              create: {
                userId,
                amount: session.amount_total || (planId === "BUSINESS" ? 3900 : 1500),
                currency: (session.currency || "usd").toUpperCase(),
                provider: "STRIPE",
                status: "SUCCEEDED",
                transactionId: session.id,
              },
            }),
          ]);

          console.info(`Stripe checkout completed for user ${userId} to plan ${planId}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const stripeSubId = sub.id;
        const statusMap: Record<string, string> = {
          active: "ACTIVE",
          past_due: "PAST_DUE",
          canceled: "CANCELED",
          unpaid: "PAST_DUE",
          trialing: "TRIALING",
        };
        const status = statusMap[sub.status] || "ACTIVE";

        const existingSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: stripeSubId },
        });

        if (existingSub) {
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: {
              status,
              cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
              ...(sub.current_period_end
                ? { currentPeriodEnd: new Date(sub.current_period_end * 1000) }
                : {}),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const stripeSubId = sub.id;

        const existingSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: stripeSubId },
        });

        if (existingSub) {
          await prisma.$transaction([
            prisma.subscription.update({
              where: { id: existingSub.id },
              data: {
                planId: "FREE",
                status: "CANCELED",
              },
            }),
            prisma.creditBalance.update({
              where: { userId: existingSub.userId },
              data: {
                monthlyCredits: PRICING_PLANS.FREE.monthlyCredits,
              },
            }),
          ]);
          console.info(`Subscription deleted for user ${existingSub.userId}, downgraded to FREE`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const stripeSubId = invoice.subscription;

        if (stripeSubId) {
          const existingSub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: stripeSubId },
          });

          if (existingSub) {
            // New billing cycle paid: reset monthly used credits
            await prisma.creditBalance.update({
              where: { userId: existingSub.userId },
              data: {
                usedCredits: 0,
                lastRefillDate: new Date(),
              },
            });
          }
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook processing failure:", error);
    return NextResponse.json(
      { error: "Webhook event processing failed" },
      { status: 500 }
    );
  }
}
