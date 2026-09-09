"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InlineGrammarViewer } from "@/components/editor/InlineGrammarViewer";
import { SpellCheck, Trash2, RefreshCw, Copy, Check, Sparkles } from "lucide-react";
import { GrammarCorrection, GrammarResult } from "@/lib/ai";
import { useToast } from "@/components/ui/toast";
import { countWords } from "@/lib/utils";

export default function GrammarCheckerPage() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState(
    "Teh quick brown fox jumped over a lazy dog, but their is many people who think this is a very unique sentence that affect the results."
  );
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined);

  const handleCheck = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter or paste text to check grammar and style.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        if (typeof data.data.remainingCredits === "number") {
          setRemainingCredits(data.data.remainingCredits);
        }
        toast({
          title: "Scan Completed",
          description:
            data.data.issuesCount > 0
              ? `Identified ${data.data.issuesCount} areas for improvement.`
              : "No issues detected. Your text is clear and well-structured.",
          type: "success",
        });
      } else {
        toast({
          title: "Grammar Scan Notice",
          description: data.error || "Unable to complete grammar scan. Please try again.",
          type: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Grammar Scan Failed",
        description: err?.message || "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySingle = (corrId: string) => {
    if (!result) return;
    const corr = result.corrections.find((c) => c.id === corrId);
    if (!corr) return;

    setInputText((prev) => {
      // 1. Precise slice replacement if offsets match
      if (
        typeof corr.start === "number" &&
        typeof corr.end === "number" &&
        prev.slice(corr.start, corr.end) === corr.original
      ) {
        return prev.slice(0, corr.start) + corr.replacement + prev.slice(corr.end);
      }
      // 2. Fallback to exact occurrence replacement
      return prev.replace(corr.original, corr.replacement);
    });

    // Synchronize result state so active issue counts reflect user actions
    const remaining = result.corrections.filter((c) => c.id !== corrId);
    setResult({
      ...result,
      issuesCount: remaining.length,
      corrections: remaining,
    });
  };

  const handleApplyAll = (newText: string) => {
    setInputText(newText);
    if (result) {
      setResult({ ...result, correctedText: newText, corrections: [], issuesCount: 0 });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied text to clipboard", type: "success" });
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
  };

  return (
    <AppShell
      title="Grammar & Clarity Checker"
      description="Real-time spelling, punctuation, syntax agreements, and style polish."
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Editor Box */}
        <div className="rounded-3xl bg-card border border-border/80 shadow-sm overflow-hidden space-y-2">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Working Document
              </span>
              {result && result.readabilityImprovement && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" />
                  {result.readabilityImprovement}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              {inputText && (
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (!e.target.value.trim()) {
                setResult(null);
              }
            }}
            placeholder="Type or paste your text to check grammar and style..."
            rows={8}
            className="w-full px-5 py-3 bg-transparent resize-none focus:outline-none text-sm leading-relaxed"
          />

          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{countWords(inputText)} words</span>
              {remainingCredits !== undefined && (
                <>
                  <span>•</span>
                  <span>{remainingCredits.toLocaleString()} credits available</span>
                </>
              )}
            </div>
            <button
              onClick={handleCheck}
              disabled={isLoading || !inputText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 text-xs transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Checking Grammar...
                </>
              ) : (
                <>
                  <SpellCheck className="w-4 h-4" />
                  Check Grammar & Style
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inline Corrections Viewer */}
        {result && (
          <InlineGrammarViewer
            originalText={inputText}
            correctedText={result.correctedText}
            corrections={result.corrections}
            onApplySingle={handleApplySingle}
            onApplyAll={handleApplyAll}
          />
        )}
      </div>
    </AppShell>
  );
}
