"use client";

import React, { useState } from "react";
import { GrammarCorrection } from "@/lib/ai";
import { Check, X, Sparkles, CheckCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface InlineGrammarViewerProps {
  originalText: string;
  corrections: GrammarCorrection[];
  onApplyAll: (newText: string) => void;
  onApplySingle: (corrId: string) => void;
}

export function InlineGrammarViewer({
  originalText,
  corrections,
  onApplyAll,
  onApplySingle,
}: InlineGrammarViewerProps) {
  const { toast } = useToast();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);

  const activeCorrections = corrections.filter(
    (c) => !dismissedIds.includes(c.id) && !acceptedIds.includes(c.id)
  );

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const handleAccept = (corr: GrammarCorrection) => {
    setAcceptedIds((prev) => [...prev, corr.id]);
    onApplySingle(corr.id);
    toast({
      title: "Correction Accepted",
      description: `Replaced "${corr.original}" with "${corr.replacement}".`,
      type: "success",
    });
  };

  const handleAcceptAll = () => {
    // Sequentially apply all active replacements
    let newText = originalText;
    corrections.forEach((c) => {
      if (!dismissedIds.includes(c.id)) {
        newText = newText.replace(c.original, c.replacement);
      }
    });
    setAcceptedIds(corrections.map((c) => c.id));
    onApplyAll(newText);
    toast({
      title: "All Fixes Applied",
      description: `Successfully resolved ${activeCorrections.length} suggestions.`,
      type: "success",
    });
  };

  const getTypeBadge = (type: GrammarCorrection["type"]) => {
    switch (type) {
      case "spelling":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "grammar":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "punctuation":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "style":
      case "clarity":
      default:
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/80 shadow-sm">
        <div>
          <span className="text-sm font-semibold text-foreground">
            {activeCorrections.length} Issues Detected
          </span>
          <p className="text-xs text-muted-foreground">
            Review recommendations individually or accept all with one click.
          </p>
        </div>

        {activeCorrections.length > 0 && (
          <button
            onClick={handleAcceptAll}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            Accept All Fixes
          </button>
        )}
      </div>

      {/* Cards for each issue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeCorrections.map((corr) => (
          <div
            key={corr.id}
            className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-2 hover:border-indigo-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(
                  corr.type
                )}`}
              >
                {corr.type}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDismiss(corr.id)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Dismiss suggestion"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleAccept(corr)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="line-through text-rose-500 font-medium">{corr.original}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {corr.replacement}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{corr.explanation}</p>
          </div>
        ))}

        {activeCorrections.length === 0 && (
          <div className="col-span-2 p-8 text-center rounded-xl bg-muted/20 border border-border">
            <Sparkles className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">All clear!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              No grammatical errors or style suggestions pending.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
