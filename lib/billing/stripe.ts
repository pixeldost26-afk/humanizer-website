import { PRICING_PLANS } from "./plans";

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
  isDemo: boolean;
}> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const plan = PRICING_PLANS[params.planId];

  if (!stripeSecret || stripeSecret.trim() === "") {
    // Return simulated success URL with query param indicating demo upgrade
    console.info("Stripe Secret Key not provided. Returning simulated checkout URL.");
    return {
      url: `${params.successUrl}?demo_upgrade=true&plan=${params.planId}`,
      isDemo: true,
    };
  }

  // If real Stripe is configured, invoke Stripe API
  try {
    const priceId =
      params.billingCycle === "annual" ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly;

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        mode: "subscription",
        customer_email: params.userEmail,
        "line_items[0][price]": priceId || "",
        "line_items[0][quantity]": "1",
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        "client_reference_id": params.userId,
      }).toString(),
    });

    const session = await res.json();
    if (session.url) {
      return { url: session.url, isDemo: false };
    }
    throw new Error(session.error?.message || "Failed to create Stripe session");
  } catch (err) {
    console.warn("Stripe API error, falling back to simulated upgrade:", err);
    return {
      url: `${params.successUrl}?demo_upgrade=true&plan=${params.planId}`,
      isDemo: true,
    };
  }
}

export async function createCustomerPortalSession(params: {
  customerId?: string;
  returnUrl: string;
}): Promise<{ url: string; isDemo: boolean }> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret || !params.customerId) {
    return { url: params.returnUrl, isDemo: true };
  }

  try {
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
    return { url: data.url || params.returnUrl, isDemo: false };
  } catch {
    return { url: params.returnUrl, isDemo: true };
  }
}
