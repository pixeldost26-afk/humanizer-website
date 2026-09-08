"use client";

import React, { useState } from "react";
import { Activity, Info, Sparkles, AlertTriangle } from "lucide-react";

interface SentenceData {
  id: number;
  words: number;
  text: string;
  type: "short" | "medium" | "long";
  status: "robotic" | "natural";
}

interface CadenceWaveformVisualizerProps {
  aiSentences?: SentenceData[];
  humanSentences?: SentenceData[];
  compact?: boolean;
}

const DEFAULT_AI_SENTENCES: SentenceData[] = [
  { id: 1, words: 19, text: "Furthermore, empirical investigations delve into the multifaceted dynamics of economic disparities.", type: "medium", status: "robotic" },
  { id: 2, words: 18, text: "Demonstrating that a multitude of structural variables play a pivotal role in regulating stability.", type: "medium", status: "robotic" },
  { id: 3, words: 19, text: "It is crucial to remember that these frameworks serve as a testament to modern fiscal architecture.", type: "medium", status: "robotic" },
  { id: 4, words: 20, text: "Additionally, policymakers must prioritize systemic interventions to mitigate vulnerabilities over time.", type: "medium", status: "robotic" },
  { id: 5, words: 19, text: "Consequently, comprehensive analyses facilitate deeper understanding of complex socio-economic paradigms.", type: "medium", status: "robotic" },
];

const DEFAULT_HUMAN_SENTENCES: SentenceData[] = [
  { id: 1, words: 6, text: "Economic gaps are surprisingly complex.", type: "short", status: "natural" },
  { id: 2, words: 24, text: "Scholarly research highlights how distinct institutional factors—from credit access to regional job markets—directly shape lasting financial stability across communities.", type: "long", status: "natural" },
  { id: 3, words: 12, text: "They aren't just abstract statistics on a government ledger.", type: "medium", status: "natural" },
  { id: 4, words: 5, text: "Real families feel them.", type: "short", status: "natural" },
  { id: 5, words: 17, text: "That is why modern policy needs practical solutions tailored to ground realities rather than broad theories.", type: "medium", status: "natural" },
];

export function CadenceWaveformVisualizer({
  aiSentences = DEFAULT_AI_SENTENCES,
  humanSentences = DEFAULT_HUMAN_SENTENCES,
  compact = false,
}: CadenceWaveformVisualizerProps) {
  const [activeTab, setActiveTab] = useState<"comparison" | "human" | "ai">("comparison");
  const [hoveredSentence, setHoveredSentence] = useState<SentenceData | null>(null);

  const maxWords = 28;

  return (
    <div className="w-full card-pro p-5 sm:p-6 space-y-5 bg-card/90">
      {/* Header telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Linguistic Cadence & Waveform Diagnostic
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
              Exclusive
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Commercial AI detectors identify machine text by measuring <strong>Burstiness</strong> (rhythm variance). Human prose ebbs and flows melodically.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === "comparison"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Side-by-Side Wave
          </button>
          <button
            onClick={() => setActiveTab("human")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === "human"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Human Rhythm
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === "ai"
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AI Flatline
          </button>
        </div>
      </div>

      {/* Waveform Visualization Containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Raw AI Barcode Waveform */}
        {(activeTab === "comparison" || activeTab === "ai") && (
          <div className="p-4 rounded-xl bg-rose-500/[0.03] border border-rose-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Raw AI Cadence: Monotone Flatline
              </span>
              <span className="text-[11px] font-semibold text-rose-600/80">
                Variance: <strong>±1 word (Robotic)</strong>
              </span>
            </div>

            {/* Audio Wave Bars */}
            <div className="h-28 flex items-end justify-between gap-2.5 px-3 py-2 bg-background/60 rounded-lg border border-rose-500/10">
              {aiSentences.map((s) => {
                const heightPct = Math.min(100, Math.max(25, (s.words / maxWords) * 100));
                return (
                  <div
                    key={s.id}
                    onMouseEnter={() => setHoveredSentence(s)}
                    onMouseLeave={() => setHoveredSentence(null)}
                    className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-rose-600 transition-colors">
                      {s.words}w
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[32px] rounded-t-md bg-rose-500/40 group-hover:bg-rose-500 transition-all shadow-xs"
                    />
                    <span className="text-[9px] text-muted-foreground font-mono">#{s.id}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>Predictable sentence lengths</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">Flagged: 92% AI</span>
            </div>
          </div>
        )}

        {/* Humanized Dynamic Melodic Waveform */}
        {(activeTab === "comparison" || activeTab === "human") && (
          <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/25 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Humanized Cadence: Melodic Ebb & Flow
              </span>
              <span className="text-[11px] font-semibold text-emerald-600/80">
                Variance: <strong>±19 words (High Burstiness)</strong>
              </span>
            </div>

            {/* Audio Wave Bars */}
            <div className="h-28 flex items-end justify-between gap-2.5 px-3 py-2 bg-background/60 rounded-lg border border-emerald-500/10">
              {humanSentences.map((s) => {
                const heightPct = Math.min(100, Math.max(20, (s.words / maxWords) * 100));
                return (
                  <div
                    key={s.id}
                    onMouseEnter={() => setHoveredSentence(s)}
                    onMouseLeave={() => setHoveredSentence(null)}
                    className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-emerald-600 transition-colors">
                      {s.words}w
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-emerald-500/50 to-indigo-500/80 group-hover:from-emerald-500 group-hover:to-indigo-500 transition-all shadow-xs"
                    />
                    <span className="text-[9px] text-muted-foreground font-mono">#{s.id}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>Natural tempo: short punches + lyrical clauses</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Natural Human Cadence</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover Sentence Telemetry Inspector */}
      {hoveredSentence ? (
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs flex items-start gap-3 animate-in fade-in duration-150">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                Sentence #{hoveredSentence.id} ({hoveredSentence.words} words)
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  hoveredSentence.status === "natural"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                }`}
              >
                {hoveredSentence.status === "natural" ? "Natural Flow" : "Robotic Predictability"}
              </span>
            </div>
            <p className="text-muted-foreground italic leading-relaxed">
              "{hoveredSentence.text}"
            </p>
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-muted-foreground/75 flex items-center justify-center gap-1.5 py-1">
          <span>💡 Hover over any waveform bar to inspect its syntactic cadence and rhythm telemetry</span>
        </div>
      )}
    </div>
  );
}
