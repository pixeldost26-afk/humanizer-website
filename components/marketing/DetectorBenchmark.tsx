"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface BenchmarkItem {
  id: string;
  title: string;
  rawAI: string;
  rawScore: number;
  humanized: string;
  cadenceStatus: string;
  burstinessStatus: string;
  patternStatus: string;
}

const BENCHMARKS: BenchmarkItem[] = [
  {
    id: "tech",
    title: "Computer Science & Tech",
    rawAI:
      "Primary memory, primarily consisting of RAM, functions as volatile storage that temporarily retains actively running processes. Conversely, secondary storage comprises non-volatile media engineered to ensure enduring data retention across compute lifecycles.",
    rawScore: 88,
    humanized:
      "Primary memory (mainly RAM) works as high-speed workspace for running software. Secondary storage, like SSDs and hard drives, keeps files intact even after shutting down.",
    cadenceStatus: "Natural Cadence",
    burstinessStatus: "High Variation",
    patternStatus: "Formulaic Patterns Reduced",
  },
  {
    id: "academic",
    title: "Academic Research Essay",
    rawAI:
      "Moreover, empirical investigations delve into the multifaceted dynamics of economic disparities, demonstrating that a multitude of structural variables play a pivotal role in regulating fiscal stability.",
    rawScore: 94,
    humanized:
      "Scholarly research highlights how complex economic gaps can be—showing that distinct institutional factors directly shape lasting financial stability.",
    cadenceStatus: "Scholarly Flow",
    burstinessStatus: "Varied Syntax",
    patternStatus: "Clichés Neutralized",
  },
  {
    id: "marketing",
    title: "Marketing & Growth Copy",
    rawAI:
      "Furthermore, leveraging this state-of-the-art software solution facilitates seamless operational excellence. It is crucial to remember that our platform stands as a testament to transformative business optimization.",
    rawScore: 82,
    humanized:
      "Using this modern software helps your team ship faster without the headaches. It's a proven way to eliminate bottlenecks and get real work done.",
    cadenceStatus: "Engaging & Direct",
    burstinessStatus: "Punchy Rhythm",
    patternStatus: "Hyperbole Purged",
  },
  {
    id: "email",
    title: "Executive Business Email",
    rawAI:
      "In order to facilitate a prompt and effective resolution regarding the aforementioned matter, it is imperative that all relevant stakeholders utilize the designated internal portal to submit requisitions.",
    rawScore: 79,
    humanized:
      "To wrap this up quickly, please submit your team requests directly through the company portal by end of day.",
    cadenceStatus: "Executive Clarity",
    burstinessStatus: "Concise Phrasing",
    patternStatus: "Jargon Eliminated",
  },
];

export function DetectorBenchmark() {
  const [activeTab, setActiveTab] = useState(0);
  const active = BENCHMARKS[activeTab];

  return (
    <section className="w-full py-20 lg:py-28 relative overflow-hidden bg-muted/20 border-y border-border/60">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Benchmarked Against Formulaic AI Patterns</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            How ManaHumanizeAI Transforms Formulaic Writing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Formulaic AI text typically exhibits repetitive syntax, uniform sentence lengths, and overused transitions.
            See how our dynamic cadence engine transforms predictable machine text into varied, natural human prose.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {BENCHMARKS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === idx
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Comparison Showcase Container */}
        <div className="card-pro p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Raw AI Text */}
            <div className="rounded-2xl bg-rose-500/[0.03] border border-rose-500/25 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    Before: Formulaic AI Output
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black border border-rose-500/20">
                    {active.rawScore}% Pattern Likelihood
                  </span>
                </div>
                <blockquote className="text-sm text-foreground/80 leading-relaxed italic bg-background/50 p-4 rounded-xl border border-rose-500/10">
                  &ldquo;{active.rawAI}&rdquo;
                </blockquote>
              </div>
              <div className="pt-3 border-t border-rose-500/15 flex items-center justify-between text-xs text-rose-600/80 dark:text-rose-400/80">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Predictable Transitional Phrasing
                </span>
                <span className="font-semibold">Monotonous Rhythm</span>
              </div>
            </div>

            {/* Humanized Text */}
            <div className="rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/30 p-5 space-y-4 flex flex-col justify-between shadow-lg shadow-emerald-500/5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    After: ManaHumanizeAI Output
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-500/30 shadow-xs">
                    Natural Cadence • Varied Flow
                  </span>
                </div>
                <blockquote className="text-sm text-foreground font-medium leading-relaxed bg-background/60 p-4 rounded-xl border border-emerald-500/20">
                  &ldquo;{active.humanized}&rdquo;
                </blockquote>
              </div>
              <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Optimized Sentence Variation
                </span>
                <span className="font-bold">Organic Human Flow</span>
              </div>
            </div>
          </div>

          {/* Linguistic Quality Dimensions */}
          <div className="pt-4 border-t border-border/60">
            <div className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Linguistic Quality Dimensions Across Writing Samples
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-center space-y-1">
                <div className="text-xs text-muted-foreground font-semibold">Sentence Burstiness</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  High Variation
                </div>
                <div className="text-[10px] text-emerald-600/80 font-bold uppercase">Dynamic Lengths</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-center space-y-1">
                <div className="text-xs text-muted-foreground font-semibold">Lexical Perplexity</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  Natural Cadence
                </div>
                <div className="text-[10px] text-emerald-600/80 font-bold uppercase">Rich Vocabulary</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-center space-y-1">
                <div className="text-xs text-muted-foreground font-semibold">Transition Flow</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  Contextual Flow
                </div>
                <div className="text-[10px] text-emerald-600/80 font-bold uppercase">Zero Machine Tropes</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-center space-y-1">
                <div className="text-xs text-muted-foreground font-semibold">Structure Balance</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  Polished Rhythm
                </div>
                <div className="text-[10px] text-emerald-600/80 font-bold uppercase">Authentic Cadence</div>
              </div>
            </div>
          </div>

          {/* CTA Strip */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>Ready to test your own essay, article, or business draft?</span>
            <Link
              href="/signup?callbackUrl=/humanizer"
              prefetch={true}
              className="btn-primary text-xs shrink-0 active:scale-[0.98] transition-all"
            >
              <span>Launch Free Humanizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
