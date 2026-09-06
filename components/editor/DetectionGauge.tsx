"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, Cpu, Sparkles } from "lucide-react";
import { DetectionResult } from "@/lib/ai";

export function DetectionGauge({ result }: { result: DetectionResult }) {
  const { aiLikelihood, humanLikelihood, verdict, confidence, indicators } = result;

  // Compute stroke offset for 240-degree arc
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (aiLikelihood / 100) * circumference;

  let colorClass = "text-emerald-500";
  let bgGradient = "from-emerald-500/20 to-transparent";
  if (aiLikelihood >= 65) {
    colorClass = "text-rose-500";
    bgGradient = "from-rose-500/20 to-transparent";
  } else if (aiLikelihood >= 35) {
    colorClass = "text-amber-500";
    bgGradient = "from-amber-500/20 to-transparent";
  }

  return (
    <div className="card-pro p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-xl scale-125" />
          <svg className="w-44 h-44 transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="currentColor"
              strokeWidth="14"
              fill="transparent"
              className="text-muted/30"
            />
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="currentColor"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`}
            />
          </svg>

          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black tracking-tight text-foreground">
              {aiLikelihood}%
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
              AI Score
            </span>
          </div>
        </div>

        {/* Verdict & Confidence Summary */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                aiLikelihood >= 65
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  : aiLikelihood >= 35
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              }`}
            >
              {aiLikelihood >= 65 ? (
                <Cpu className="w-3.5 h-3.5" />
              ) : aiLikelihood >= 35 ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              {verdict}
            </span>
            <span className="text-xs text-muted-foreground">
              Confidence: <strong>{confidence}</strong>
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {aiLikelihood >= 65
              ? "High probability of machine-generated phrasing, consistent sentence lengths, or low burstiness."
              : aiLikelihood >= 35
              ? "Mixed indicators. Likely human-crafted with AI assistance, or edited machine text."
              : "High human probability. Natural variations in rhythm, sentence structures, and vocabulary."}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
              <div className="text-[11px] text-muted-foreground">Human Probability</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {humanLikelihood}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
              <div className="text-[11px] text-muted-foreground">Repetition Risk</div>
              <div className="text-lg font-bold text-foreground">
                {indicators.repetitionRisk}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Perplexity & Burstiness Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Lexical Perplexity</span>
            <span className="font-semibold text-foreground">{indicators.perplexityScore}/100</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${indicators.perplexityScore}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Measures unexpected word transitions typical of human creativity.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Sentence Burstiness</span>
            <span className="font-semibold text-foreground">{indicators.burstinessScore}/100</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${indicators.burstinessScore}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Measures variation in sentence rhythm and clause complexity.
          </p>
        </div>
      </div>
    </div>
  );
}
