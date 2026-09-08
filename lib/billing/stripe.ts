import { PRICING_PLANS } from "./plans";
import crypto from "crypto";

export interface CreateCheckoutParams {
  userId: string;
  userEmail: string;
  planId: "PRO" | "BUSINESS";
  billingCycle: "monthly" | "annual";
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(params: CreateCheckoutParams): Promise<{
  url: string;
}> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret || stripeSecret.trim() === "") {
    throw new Error("Stripe payment gateway is not configured. STRIPE_SECRET_KEY is required.");
  }

  const plan = PRICING_PLANS[params.planId];
  if (!plan) {
    throw new Error(`Invalid plan identifier: ${params.planId}`);
  }

  const priceId =
    params.billingCycle === "annual" ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly;

  if (!priceId) {
    throw new Error(`Stripe Price ID is not configured for plan ${params.planId} (${params.billingCycle}).`);
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      mode: "subscription",
      customer_email: params.userEmail,
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      client_reference_id: params.userId,
      "metadata[userId]": params.userId,
      "metadata[planId]": params.planId,
      "metadata[billingCycle]": params.billingCycle,
    }).toString(),
  });

  const session = await res.json();
  if (!res.ok || !session.url) {
    throw new Error(session.error?.message || "Failed to create Stripe checkout session");
  }

  return { url: session.url };
}

export async function createCustomerPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  const res = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      customer: params.customerId,
      return_url: params.returnUrl,
    }).toString(),
  });

  const data = await res.json();
  if (!res.ok || !data.url) {
    throw new Error(data.error?.message || "Failed to open billing portal session.");
  }

  return { url: data.url };
}

/**
 * Cryptographically verify incoming Stripe webhook signatures with HMAC-SHA256
 * and replay attack timestamp tolerance.
 */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string | undefined,
  toleranceSeconds = 300
): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  const elements = signatureHeader.split(",");
  let timestamp = "";
  const signatures: string[] = [];

  for (const element of elements) {
    const [key, value] = element.trim().split("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const parsedTimestamp = parseInt(timestamp, 10);
  if (isNaN(parsedTimestamp)) {
    return false;
  }

  const eventAge = Math.floor(Date.now() / 1000) - parsedTimestamp;
  if (Math.abs(eventAge) > toleranceSeconds) {
    console.warn(`Stripe webhook signature expired or invalid timestamp: age is ${eventAge}s`);
    return false;
  }

  const payload = `${timestamp}.${rawBody}`;
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  for (const sig of signatures) {
    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(computedSignature);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}
