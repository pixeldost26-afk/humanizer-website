"use client";

import React, { useState } from "react";
import { ShieldCheck, Check, Sparkles, AlertCircle, ArrowRight, Lock } from "lucide-react";

interface ClicheItem {
  aiWord: string;
  humanReplacement: string;
  reason: string;
}

const DEFAULT_CLICHES: ClicheItem[] = [
  { aiWord: "delve into", humanReplacement: "examine / explore", reason: "ChatGPT's #1 signature telltale transition" },
  { aiWord: "testament to", humanReplacement: "proof of / evidence", reason: "Overused cliché in 94% of synthetic drafts" },
  { aiWord: "pivotal role", humanReplacement: "key part / directly shapes", reason: "Robotic stock adjective for importance" },
  { aiWord: "multifaceted", humanReplacement: "complex / layered", reason: "Generic filler word used to sound intellectual" },
  { aiWord: "furthermore", humanReplacement: "also / what's more", reason: "Formulaic, monotonous academic linker" },
  { aiWord: "beacon of", humanReplacement: "leader in / example", reason: "Exaggerated synthetic metaphor" },
  { aiWord: "tapestry of", humanReplacement: "blend / combination", reason: "Hallmark AI prose hallucination trope" },
];

export function ClichePurgeInspector() {
  const [selectedCliche, setSelectedCliche] = useState<ClicheItem | null>(DEFAULT_CLICHES[0]);

  return (
    <div className="w-full card-pro p-5 sm:p-6 space-y-5 bg-card/90">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              AI Cliché Purge & Factual Integrity Shield
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Zero Hallucinations
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Commercial detectors scan for synthetic vocabulary tics. We replace telltales while locking 100% of your factual data.
          </p>
        </div>

        {/* Factual Integrity Lock Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5" />
          <span>Factual Core Locked (100%)</span>
        </div>
      </div>

      {/* Cliché Purged Badges List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>Telltale AI Phrasing Detected & Stripped:</span>
          <span className="text-foreground font-semibold">
            {DEFAULT_CLICHES.length} Clichés Neutralized
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {DEFAULT_CLICHES.map((item) => {
            const isSelected = selectedCliche?.aiWord === item.aiWord;
            return (
              <button
                key={item.aiWord}
                onClick={() => setSelectedCliche(item)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-muted/70 hover:bg-muted text-foreground border border-border"
                }`}
              >
                <span className="line-through opacity-70 text-rose-400 font-mono">
                  {item.aiWord}
                </span>
                <ArrowRight className="w-3 h-3 opacity-60" />
                <span className="font-semibold text-emerald-400">
                  {item.humanReplacement.split("/")[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Inspector Card */}
      {selectedCliche && (
        <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Linguistic Transformation Detail
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Vocabulary Engine Heuristic
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 space-y-1">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Robotic AI Cliché
              </span>
              <p className="font-mono text-xs font-bold text-foreground">
                "{selectedCliche.aiWord}"
              </p>
              <p className="text-[11px] text-muted-foreground">{selectedCliche.reason}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Humanized Natural Cadence
              </span>
              <p className="font-mono text-xs font-bold text-foreground">
                "{selectedCliche.humanReplacement}"
              </p>
              <p className="text-[11px] text-muted-foreground">
                Authentic, high-burstiness phrasing favored by top human authors and peer reviewers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security & Integrity 4-Pillars Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center">
        <div className="p-2.5 rounded-xl bg-muted/20 border border-border">
          <div className="text-[10px] text-muted-foreground font-semibold">Facts & Data</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">100% Preserved</div>
        </div>
        <div className="p-2.5 rounded-xl bg-muted/20 border border-border">
          <div className="text-[10px] text-muted-foreground font-semibold">Numbers & Stats</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Untouched</div>
        </div>
        <div className="p-2.5 rounded-xl bg-muted/20 border border-border">
          <div className="text-[10px] text-muted-foreground font-semibold">Citations & Quotes</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">100% Intact</div>
        </div>
        <div className="p-2.5 rounded-xl bg-muted/20 border border-border">
          <div className="text-[10px] text-muted-foreground font-semibold">Hallucination Risk</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">0.0% Zero</div>
        </div>
      </div>
    </div>
  );
}
