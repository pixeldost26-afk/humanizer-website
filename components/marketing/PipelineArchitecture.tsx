"use client";

import React from "react";
import { Cpu, Shuffle, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export function PipelineArchitecture() {
  const steps = [
    {
      num: "01",
      name: "Lexical Deconstruction",
      desc: "Detects robotic jargon (delve, testament, pivotal, furthermore) and rigid textbook transitions.",
      icon: Cpu,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      num: "02",
      name: "Burstiness Variation",
      desc: "Reorganizes uniform sentence lengths into dynamic human cadence—mixing short statements with rich clauses.",
      icon: Shuffle,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      num: "03",
      name: "Idiomatic Shaping",
      desc: "Injects natural conversational rhythms, contractions, and context-tailored vocabulary without altering facts.",
      icon: Sparkles,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      num: "04",
      name: "Probabilistic Cadence Review",
      desc: "Evaluates sentence burstiness, vocabulary diversity, and natural cadence to substantially reduce formulaic patterns before finalizing.",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <section className="w-full py-20 lg:py-28 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20 shadow-xs">
            Algorithmic Precision
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            The 4-Stage Humanization Pipeline
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            How our heuristic engine transforms rigid machine text into authentic, organic prose.
          </p>
        </div>

        {/* 4 Connected Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="card-pro p-6 flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${s.color} shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-muted-foreground/30">{s.num}</span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {s.name}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>Phase {s.num} Active</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
