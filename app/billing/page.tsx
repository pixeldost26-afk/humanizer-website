"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Sparkles, ShieldCheck, CheckCircle2, Zap, ArrowRight } from "lucide-react";

export default function BillingPage() {
  const [userBalance, setUserBalance] = useState({ total: 1000, used: 0, available: 1000 });

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUserBalance(data.data.balance);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AppShell
      title="Account & Quota Status"
      description="View your active tier, available quotas, and tool access privileges."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Active Plan Overview Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Access Level
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% Free & Unlimited
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Lifetime Free Access
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              All tools, modes, and document features are fully unlocked for your account. You have
              unlimited words, unlimited AI detector scans, and no billing limits.
            </p>
          </div>

          <Link
            href="/humanizer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all w-full sm:w-auto shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Launch Humanizer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Entitlements Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Your Plan Privileges</h3>
            <p className="text-xs text-muted-foreground">
              All tools are completely free to use with zero subscriptions or fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Unlimited Humanizer Words</h4>
                <p className="text-xs text-muted-foreground">
                  Transform essays, papers, and articles of any length without word restrictions.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Unlimited AI Content Scans</h4>
                <p className="text-xs text-muted-foreground">
                  Analyze text for probabilistic AI markers with sentence-level highlights.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">All 6 Tone Modes</h4>
                <p className="text-xs text-muted-foreground">
                  Switch freely between Academic, Natural, Standard, Professional, Casual, and Creative.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Document File Uploads</h4>
                <p className="text-xs text-muted-foreground">
                  Upload PDF, DOCX, TXT, and Markdown files directly into the editor for processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
