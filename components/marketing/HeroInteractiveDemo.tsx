"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Check, Copy, RefreshCw, ShieldCheck, Sliders, Activity, FileCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import { CadenceWaveformVisualizer } from "./CadenceWaveformVisualizer";
import { ClichePurgeInspector } from "./ClichePurgeInspector";

const SAMPLES = [
  {
    id: "academic",
    label: "Academic Research",
    mode: "Academic",
    aiText:
      "Furthermore, empirical investigations delve into the multifaceted dynamics of economic disparities, demonstrating that a multitude of structural variables play a pivotal role in regulating fiscal stability.",
    aiScore: 92,
    humanText:
      "Scholarly research highlights how complex economic gaps can be—showing that distinct institutional factors directly shape lasting financial stability.",
    humanScore: 0,
    words: 19,
    readingEase: "High (Scholarly & Clear)",
  },
  {
    id: "tech",
    label: "Computer Science",
    mode: "Natural",
    aiText:
      "Primary memory functions as volatile storage that temporarily retains actively executing compute threads, while secondary memory utilizes non-volatile mechanisms to ensure persistent data preservation across operating system lifecycles.",
    aiScore: 88,
    humanText:
      "Primary memory (mainly RAM) works as high-speed workspace for running software. Secondary storage, like SSDs and hard drives, keeps files intact even after shutting down.",
    humanScore: 0,
    words: 24,
    readingEase: "Very Clear (Natural)",
  },
  {
    id: "marketing",
    label: "Marketing & Growth",
    mode: "Professional",
    aiText:
      "Moreover, implementing this state-of-the-art solution facilitates seamless operational execution. It is crucial to remember that our platform stands as a testament to transformative business optimization.",
    aiScore: 84,
    humanText:
      "What's more, using this modern platform helps your team execute smoothly. Keep in mind that it's a proven way to eliminate friction and get real work done.",
    humanScore: 0,
    words: 27,
    readingEase: "High Conversational",
  },
];

export function HeroInteractiveDemo() {
  const { toast } = useToast();
  const [activeIdx, setActiveIdx] = useState(0);
  const [studioView, setStudioView] = useState<"preview" | "waveform" | "cliches">("preview");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sample = SAMPLES[activeIdx];

  const handleCustomHumanize = async () => {
    if (!customInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: customInput,
          mode: "Natural",
          preserveMeaning: 4,
          preserveFormatting: true,
          sentenceVariation: 4,
          vocabularyVariation: 3,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCustomOutput(data.data.humanizedText);
        toast({
          title: "Humanized to 0% AI!",
          description: "Applied natural syntactical variation and idiomatic rhythm.",
          type: "success",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to humanizer engine.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard", type: "success" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto app-window">
      {/* macOS Window Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/80 bg-muted/40 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground ml-2 hidden sm:inline">
            HumanizeAI Studio — Fluency Engine 2.0
          </span>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setStudioView("preview")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              studioView === "preview"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Studio
          </button>
          <button
            onClick={() => setStudioView("waveform")}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              studioView === "waveform"
                ? "bg-indigo-600 text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Cadence Wave</span>
          </button>
          <button
            onClick={() => setStudioView("cliches")}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              studioView === "cliches"
                ? "bg-emerald-600 text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck className="w-3 h-3" />
            <span>Cliché Shield</span>
          </button>
        </div>
      </div>

      {/* Main Window Body */}
      <div className="p-5 sm:p-6 space-y-4">
        {studioView === "waveform" ? (
          <CadenceWaveformVisualizer />
        ) : studioView === "cliches" ? (
          <ClichePurgeInspector />
        ) : (
          <>
            {/* Tab Controls for Samples */}
            <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                {SAMPLES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveIdx(idx);
                      setIsCustomMode(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      !isCustomMode && activeIdx === idx
                        ? "bg-background text-foreground shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsCustomMode(!isCustomMode);
                  if (!customInput) {
                    setCustomInput(sample.aiText);
                    setCustomOutput(sample.humanText);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  isCustomMode
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>{isCustomMode ? "Live Test Active" : "Custom Text"}</span>
              </button>
            </div>
        {isCustomMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Input */}
            <div className="flex flex-col h-64 rounded-xl bg-muted/20 border border-border p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">Input Text</span>
                <span className="text-muted-foreground">
                  {customInput.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type or paste AI content here..."
                className="flex-1 w-full bg-transparent resize-none focus:outline-none text-xs sm:text-sm leading-relaxed"
              />
              <button
                onClick={handleCustomHumanize}
                disabled={isLoading || !customInput.trim()}
                className="btn-primary text-xs w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Transforming...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Humanize Text (0% AI)
                  </>
                )}
              </button>
            </div>

            {/* Custom Output */}
            <div className="flex flex-col h-64 rounded-xl bg-muted/20 border border-border p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Humanized (0% AI)
                </span>
                {customOutput && (
                  <button
                    onClick={() => handleCopy(customOutput)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {customOutput || (
                  <span className="text-muted-foreground/60 italic">
                    Click "Humanize Text" to transform your prose...
                  </span>
                )}
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Certified 0% on Grammarly & Turnitin</span>
                <Link href="/signup?callbackUrl=/humanizer" prefetch={true} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Full Editor →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preset AI Card */}
            <div className="rounded-xl bg-muted/20 border border-border p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    AI Output (Flagged)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
                    {sample.aiScore}% AI
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed bg-background/50 p-4 rounded-lg border border-border/50">
                  "{sample.aiText}"
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span>Monotonous syntax & Latinate jargon</span>
                <span className="font-semibold text-rose-500">Flagged</span>
              </div>
            </div>

            {/* Preset Humanized Card */}
            <div className="rounded-xl bg-muted/20 border border-border p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    HumanizeAI (0% AI)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    0% AI • Passed
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed bg-background/50 p-4 rounded-lg border border-border/50 font-medium">
                  "{sample.humanText}"
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Bypasses Grammarly & Turnitin
                </span>
                <button
                  onClick={() => handleCopy(sample.humanText)}
                  className="inline-flex items-center gap-1 text-xs hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )}

        {/* Window Footer Status */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-foreground">Next-Gen Heuristic Engine Active</span>
            <span>•</span>
            <span>Unlimited Words</span>
          </div>
          <Link
            href="/signup?callbackUrl=/humanizer"
            prefetch={true}
            className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
