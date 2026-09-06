export interface RazorpayOrderParams {
  amount: number; // in INR
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(params: RazorpayOrderParams) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    // Return deterministic mock order for development
    return {
      id: `order_mock_${Date.now()}`,
      entity: "order",
      amount: params.amount * 100, // convert to paise
      amount_paid: 0,
      amount_due: params.amount * 100,
      currency: params.currency || "INR",
      receipt: params.receipt,
      status: "created",
      isDemo: true,
    };
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount * 100,
      currency: params.currency || "INR",
      receipt: params.receipt,
      notes: params.notes,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay Order Creation Failed: ${text}`);
  }

  const data = await res.json();
  return { ...data, isDemo: false };
}
