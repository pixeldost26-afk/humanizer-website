"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Repeat,
  FileUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function BentoFeatureGrid() {
  return (
    <section className="w-full py-20 lg:py-28 relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="badge-pro">
            Core Tool Suite
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Everything You Need for Human-Grade Publishing
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Engineered with probabilistic NLP heuristics, multi-tier vocabulary depth, and zero paywalls.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Item 1: Large Flagship Humanizer Card */}
          <div className="md:col-span-2 card-pro p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Flagship Engine
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Humanizer 2.0 with Syntactic De-formulaization
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Commercial AI models write with predictable sentence rhythms and Latinate buzzwords.
                HumanizeAI dismantles robotic patterns, introduces human sentence burstiness, and
                produces fluid writing that achieves a verified <strong>0% AI score on Grammarly</strong>.
              </p>

              {/* Mode Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {[
                  { name: "Academic", desc: "Rigorous scholarly prose & citations" },
                  { name: "Natural", desc: "Balanced everyday cadence" },
                  { name: "Professional", desc: "Polished executive business clarity" },
                  { name: "Casual", desc: "Friendly tone with contractions" },
                  { name: "Creative", desc: "Evocative phrasing & metaphors" },
                  { name: "Standard", desc: "Clean, direct simplification" },
                ].map((m) => (
                  <div
                    key={m.name}
                    className="p-3 rounded-xl bg-muted/40 border border-border/80 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="text-xs font-bold text-foreground">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {m.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground font-medium">
                Guaranteed 0% Detection • Preserves Citations & Quotes
              </span>
              <Link
                href="/humanizer"
                prefetch={true}
                className="btn-primary text-xs active:scale-[0.98] transition-all"
              >
                <span>Open Humanizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Item 2: AI Detector Card */}
          <div className="card-pro p-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">Probabilistic AI Detector</h3>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Sentence-level probabilistic scans
                </p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Color-coded sentence analysis highlighting exact lines flagged for high perplexity,
                repetitive structure, or synthetic vocabulary.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium flex items-center justify-between">
                  <span>Humanized Output</span>
                  <span className="font-bold">0% AI</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-medium flex items-center justify-between">
                  <span>Raw Textbook AI</span>
                  <span className="font-bold">81-94% AI</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-border/60">
              <Link
                href="/ai-detector"
                prefetch={true}
                className="btn-secondary w-full text-xs active:scale-[0.98] transition-all"
              >
                <span>Launch Detector</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Item 3: 100% Free Lifetime Access */}
          <div className="card-pro p-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">100% Free & Unlimited</h3>
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                  Zero subscriptions • Zero word paywalls
                </p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                No credit cards, no monthly subscriptions, and no trial expirations. Transform long
                articles, essays, and documents freely with no word limits.
              </p>

              <div className="space-y-1.5 pt-2 text-xs text-foreground/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Unlimited words per session</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>All 6 modes fully unlocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>No credit card required ever</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-border/60">
              <Link
                href="/humanizer"
                prefetch={true}
                className="btn-secondary w-full text-xs active:scale-[0.98] transition-all"
              >
                <span>Start Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Item 4: Paraphraser & Grammar */}
          <div className="card-pro p-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Repeat className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">Paraphraser & Grammar</h3>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mt-0.5">
                  Vocabulary depth & inline style doctor
                </p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Rephrase passages in seconds, swap synonyms with context-aware suggestions, and fix
                complex grammar issues with one-click bulk accept.
              </p>

              <div className="space-y-1.5 pt-2 text-xs text-foreground/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Subject-verb agreement fixes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Side-by-side synonym depth</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-border/60">
              <Link
                href="/paraphraser"
                prefetch={true}
                className="btn-secondary w-full text-xs active:scale-[0.98] transition-all"
              >
                <span>Try Paraphraser</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Item 5: Full Document Studio */}
          <div className="card-pro p-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <FileUp className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">Full Document Studio</h3>
                <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400 mt-0.5">
                  PDF, DOCX, TXT & Markdown support
                </p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Drag-and-drop your research papers, essays, or chapters directly into the studio.
                Export finished humanized drafts instantly in clean formatted text.
              </p>

              <div className="space-y-1.5 pt-2 text-xs text-foreground/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Preserves citations & quotes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Zero formatting degradation</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-border/60">
              <Link
                href="/humanizer"
                prefetch={true}
                className="btn-secondary w-full text-xs active:scale-[0.98] transition-all"
              >
                <span>Upload Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
