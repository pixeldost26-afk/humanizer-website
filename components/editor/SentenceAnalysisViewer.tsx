"use client";

import React, { useState } from "react";
import { SentenceAnalysis } from "@/lib/ai";
import { Info, HelpCircle } from "lucide-react";

export function SentenceAnalysisViewer({ sentences }: { sentences: SentenceAnalysis[] }) {
  const [selectedSentence, setSelectedSentence] = useState<SentenceAnalysis | null>(
    sentences[0] || null
  );

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-muted/40 border border-border text-xs">
        <span className="font-semibold text-foreground">Sentence Breakdown:</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500" />
            <span>Human / Natural (&lt;35%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500" />
            <span>Mixed / Uncertain (35-64%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500" />
            <span>Likely AI (65%+)</span>
          </span>
        </div>
      </div>

      {/* Highlighted Paragraph */}
      <div className="p-6 card-pro shadow-sm leading-relaxed text-sm space-y-3">
        <p className="space-x-1.5 leading-loose">
          {sentences.map((sentence) => {
            let bgClass = "hover:bg-muted/80";
            let borderClass = "border-transparent";

            if (sentence.aiProbability >= 65) {
              bgClass = "bg-rose-500/15 hover:bg-rose-500/25 text-rose-950 dark:text-rose-200";
              borderClass = "border-b-2 border-rose-500";
            } else if (sentence.aiProbability >= 35) {
              bgClass = "bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 dark:text-amber-200";
              borderClass = "border-b-2 border-amber-500";
            } else {
              bgClass = "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-950 dark:text-emerald-200";
              borderClass = "border-b-2 border-emerald-500/50";
            }

            const isSelected = selectedSentence?.index === sentence.index;

            return (
              <span
                key={sentence.index}
                onClick={() => setSelectedSentence(sentence)}
                className={`cursor-pointer px-1 py-0.5 rounded transition-all inline ${bgClass} ${borderClass} ${
                  isSelected ? "ring-2 ring-indigo-500 font-medium" : ""
                }`}
                title={`Click to view analysis (AI: ${sentence.aiProbability}%)`}
              >
                {sentence.text}{" "}
              </span>
            );
          })}
        </p>
      </div>

      {/* Selected Sentence Inspector Box */}
      {selectedSentence && (
        <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              Sentence #{selectedSentence.index + 1} Analysis:
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full ${
                selectedSentence.aiProbability >= 65
                  ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                  : selectedSentence.aiProbability >= 35
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {selectedSentence.label} ({selectedSentence.aiProbability}% AI score)
            </span>
          </div>
          <blockquote className="italic text-foreground/80 border-l-2 border-indigo-500 pl-2">
            "{selectedSentence.text}"
          </blockquote>
          <div className="space-y-1 pt-1 text-muted-foreground">
            <strong>Key Heuristics:</strong>
            <ul className="list-disc list-inside space-y-0.5">
              {selectedSentence.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
