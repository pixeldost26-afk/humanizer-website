"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InlineGrammarViewer } from "@/components/editor/InlineGrammarViewer";
import { SpellCheck, Upload, Trash2, Clipboard, RefreshCw, Copy, Check } from "lucide-react";
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

  const handleCheck = async () => {
    if (!inputText.trim()) return;
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
        toast({
          title: "Scan Completed",
          description: `Identified ${data.data.issuesCount} areas for improvement.`,
          type: "success",
        });
      }
    } catch {
      toast({ title: "Grammar scan failed", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySingle = (corrId: string) => {
    if (!result) return;
    const corr = result.corrections.find((c) => c.id === corrId);
    if (!corr) return;
    setInputText((prev) => prev.replace(corr.original, corr.replacement));
  };

  const handleApplyAll = (newText: string) => {
    setInputText(newText);
    if (result) {
      setResult({ ...result, correctedText: newText, corrections: [] });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied text", type: "success" });
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
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Working Document
            </span>
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
                  onClick={() => setInputText("")}
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
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text to check grammar and style..."
            rows={8}
            className="w-full px-5 py-3 bg-transparent resize-none focus:outline-none text-sm leading-relaxed"
          />

          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground">
            <span>{countWords(inputText)} words</span>
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
            corrections={result.corrections}
            onApplySingle={handleApplySingle}
            onApplyAll={handleApplyAll}
          />
        )}
      </div>
    </AppShell>
  );
}
