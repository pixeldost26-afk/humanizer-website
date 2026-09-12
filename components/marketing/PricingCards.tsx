"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRICING_PLANS } from "@/lib/billing/plans";
import { Check, Sparkles, Zap, ArrowRight } from "lucide-react";

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <section id="pricing" className="w-full py-20 lg:py-28 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Simple Plans for Every Writer
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Choose the plan that best fits your workflow. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center p-1 rounded-2xl bg-muted border border-border">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  billingCycle === "annual"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.values(PRICING_PLANS).map((tier) => {
            const isPopular = tier.popular;
            const price =
              billingCycle === "annual"
                ? Math.round(tier.priceAnnual / 12)
                : tier.priceMonthly;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? "bg-card border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 lg:-translate-y-2"
                    : "bg-card border border-border/80 shadow-sm hover:border-border"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-md">
                      <Sparkles className="w-3 h-3" />
                      Most Popular Choice
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tier.tagline}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-foreground">
                      ${price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      /month {billingCycle === "annual" && tier.priceMonthly > 0 ? "(billed annually)" : ""}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1 text-xs">
                    <div className="font-semibold text-foreground">
                      {tier.wordAllowanceFormatted}
                    </div>
                    <div className="text-muted-foreground">{tier.detectorChecksFormatted}</div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Included Features:
                    </span>
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-border/60">
                  <Link
                    href={tier.id === "FREE" ? "/humanizer" : "/billing"}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-xs shadow-md transition-all ${
                      isPopular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 hover:scale-[1.02]"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    {tier.id === "FREE" ? "Use Free Now" : `Subscribe to ${tier.name}`}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
