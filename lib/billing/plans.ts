export interface PricingTier {
  id: "FREE" | "PRO" | "BUSINESS";
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  monthlyCredits: number;
  wordAllowanceFormatted: string;
  detectorChecksFormatted: string;
  features: string[];
  popular?: boolean;
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
}

export const PRICING_PLANS: Record<string, PricingTier> = {
  FREE: {
    id: "FREE",
    name: "Free Starter",
    tagline: "Explore the core AI rewriting and detection tools.",
    priceMonthly: 0,
    priceAnnual: 0,
    monthlyCredits: 1000,
    wordAllowanceFormatted: "1,000 words/month",
    detectorChecksFormatted: "5 detector scans/month",
    features: [
      "Standard AI Humanizer mode",
      "Basic AI Content Detector",
      "Grammar & Spell Checking",
      "Short Summary generation",
      "Single paragraph document input",
      "Community support",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Professional",
    tagline: "For authors, creators, students, and active professionals.",
    priceMonthly: 15,
    priceAnnual: 144, // $12/month billed annually
    monthlyCredits: 50000,
    wordAllowanceFormatted: "50,000 words/month",
    detectorChecksFormatted: "Unlimited detector scans",
    popular: true,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly",
    stripePriceIdAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL || "price_pro_annual",
    features: [
      "All 6 Humanizer Modes (Natural, Academic, etc.)",
      "Advanced AI Detection with sentence-level analysis",
      "Full Paraphrasing & Grammar Suite",
      "Full Document Uploads (PDF, DOCX, TXT)",
      "Unrestricted Document History & Export",
      "Custom Tone Rewriting (9 tones)",
      "Priority processing speed",
      "Email support within 24 hours",
    ],
  },
  BUSINESS: {
    id: "BUSINESS",
    name: "Business & Teams",
    tagline: "High-volume generation & team collaboration.",
    priceMonthly: 39,
    priceAnnual: 372, // $31/month billed annually
    monthlyCredits: 250000,
    wordAllowanceFormatted: "250,000 words/month",
    detectorChecksFormatted: "Unlimited team detector scans",
    stripePriceIdMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || "price_biz_monthly",
    stripePriceIdAnnual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL || "price_biz_annual",
    features: [
      "250,000 words monthly allowance",
      "Unlimited batch document processing",
      "Team collaboration & shared history workspace",
      "Highest priority server queue",
      "Advanced burstiness & perplexity analytics",
      "Dedicated account manager",
      "Custom billing & invoicing",
    ],
  },
};
