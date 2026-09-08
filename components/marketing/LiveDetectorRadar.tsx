"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Sparkles, Layers, Sliders } from "lucide-react";

interface LinguisticDimension {
  id: string;
  name: string;
  category: string;
  rating: string;
  badge: string;
  detail: string;
}

const DIMENSIONS: LinguisticDimension[] = [
  {
    id: "burstiness",
    name: "Sentence Burstiness & Pacing",
    category: "Syntactic Dynamics",
    rating: "Optimized Cadence",
    badge: "Dynamic Lengths",
    detail: "Breaks machine monotony by interleaving crisp, punchy assertions with rich, multi-clause explanations.",
  },
  {
    id: "perplexity",
    name: "Perplexity & Vocabulary Depth",
    category: "Lexical Distribution",
    rating: "High Variation",
    badge: "Organic Flow",
    detail: "Selects contextual, natural synonyms to prevent predictable n-gram clusters common in AI completions.",
  },
  {
    id: "cliche",
    name: "Formulaic Trope Neutralization",
    category: "Pattern Deconstruction",
    rating: "Clean Prose",
    badge: "Clichés Purged",
    detail: "Identifies and replaces overused AI filler like 'delve', 'testament to', 'beacon', and 'multifaceted dynamics'.",
  },
  {
    id: "transitions",
    name: "Fluid Transitional Cadence",
    category: "Discourse Cohesion",
    rating: "Contextual Flow",
    badge: "Natural Transitions",
    detail: "Replaces repetitive textbook transitions ('furthermore', 'moreover') with smooth, conversational progression.",
  },
  {
    id: "integrity",
    name: "Citation & Quote Shielding",
    category: "Factual Precision",
    rating: "100% Preserved",
    badge: "Protected",
    detail: "Strictly protects direct quotes, academic references, numbers, and technical terminology from alteration.",
  },
  {
    id: "voice",
    name: "Persona & Tone Calibration",
    category: "Authorial Voice",
    rating: "Calibrated",
    badge: "Authentic Voice",
    detail: "Harmonizes phrasing with target audience expectations: Academic, Executive, Conversational, or Creative.",
  },
];

export function LiveDetectorRadar() {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  return (
    <section className="w-full py-16 sm:py-20 border-t border-border bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 badge-pro shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Probabilistic Style Analysis</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              6-Point Natural Writing Evaluation Grid
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ManaHumanizeAI evaluates and refactors text across six critical linguistic dimensions to dismantle formulaic AI patterns and cultivate genuine human cadence.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground self-start sm:self-auto">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Linguistic Analysis Engine</span>
          </div>
        </div>

        {/* 6-Dimension Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIMENSIONS.map((dim) => {
            const isSelected = selectedDimension === dim.id;
            return (
              <div
                key={dim.id}
                onClick={() => setSelectedDimension(isSelected ? null : dim.id)}
                className={`card-pro p-5 flex flex-col justify-between space-y-4 transition-all cursor-pointer ${
                  isSelected
                    ? "border-indigo-500 shadow-md shadow-indigo-500/10"
                    : "hover:border-emerald-500/40"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {dim.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {dim.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{dim.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{dim.detail}</p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Optimization Standard:</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {dim.rating}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Footer Strip */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Engine Framework: <strong>6-Tier Probabilistic Linguistic Optimization</strong>
            </span>
          </div>
          <div>Designed to improve readability and stylistic variation</div>
        </div>
      </div>
    </section>
  );
}
