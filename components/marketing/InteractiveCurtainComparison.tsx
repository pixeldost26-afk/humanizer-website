"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  MoveHorizontal,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  Copy,
  Check,
  Columns,
  Sliders,
  GraduationCap,
  Cpu,
  Briefcase,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface SampleCase {
  id: string;
  topic: string;
  category: string;
  icon: React.ElementType;
  rawAI: string;
  rawCliches: string[];
  aiScore: number;
  rawPerplexity: number;
  rawBurstiness: number;
  human: string;
  humanScore: number;
  humanPerplexity: number;
  humanBurstiness: number;
  grammarlyStatus: string;
  turnitinStatus: string;
  gptZeroStatus: string;
  summary: string;
}

const CASES: SampleCase[] = [
  {
    id: "academic",
    topic: "Macroeconomic Policy",
    category: "Academic & Research",
    icon: GraduationCap,
    rawAI:
      "Furthermore, empirical investigations delve into the multifaceted dynamics of economic disparities, demonstrating that a multitude of structural variables play a pivotal role in regulating fiscal stability and market equilibrium.",
    rawCliches: [
      "Furthermore,",
      "delve into the multifaceted dynamics",
      "multitude of structural variables",
      "play a pivotal role",
    ],
    aiScore: 94,
    rawPerplexity: 14.2,
    rawBurstiness: 1.1,
    human:
      "Scholarly research highlights how complex economic gaps can be—showing that distinct institutional factors directly shape lasting financial stability across national and regional markets.",
    humanScore: 0,
    humanPerplexity: 89.4,
    humanBurstiness: 5.8,
    grammarlyStatus: "0% AI Written",
    turnitinStatus: "0% AI Detected",
    gptZeroStatus: "100% Human",
    summary:
      "Replaces inflated academic jargon with concise, authoritative scholarly prose while preserving precise econometric terminology.",
  },
  {
    id: "tech",
    topic: "Distributed Systems Architecture",
    category: "Computer Science",
    icon: Cpu,
    rawAI:
      "It is crucial to remember that distributed systems utilize consensus algorithms to ensure fault tolerance. In this context, Byzantine agreement protocols serve as a testament to algorithmic robustness across asynchronous compute networks.",
    rawCliches: [
      "It is crucial to remember that",
      "utilize",
      "In this context,",
      "serve as a testament to",
    ],
    aiScore: 89,
    rawPerplexity: 16.8,
    rawBurstiness: 1.3,
    human:
      "Distributed systems rely on consensus algorithms to stay up and running when nodes fail. Protocols like Byzantine agreement keep computers in sync even under unpredictable network delays.",
    humanScore: 0,
    humanPerplexity: 91.2,
    humanBurstiness: 6.2,
    grammarlyStatus: "0% AI Written",
    turnitinStatus: "0% AI Detected",
    gptZeroStatus: "100% Human",
    summary:
      "Swaps robotic introductory clauses for direct engineering explanations with varied cadence and natural developer terminology.",
  },
  {
    id: "business",
    topic: "Enterprise Strategy",
    category: "Executive Memo",
    icon: Briefcase,
    rawAI:
      "Moreover, implementing this transformative paradigm facilitates seamless operational synergy. Organizations must foster an agile mindset to navigate the ever-evolving landscape of global market competitiveness.",
    rawCliches: [
      "Moreover,",
      "transformative paradigm",
      "seamless operational synergy",
      "ever-evolving landscape",
    ],
    aiScore: 86,
    rawPerplexity: 18.1,
    rawBurstiness: 1.2,
    human:
      "Adopting this workflow helps cross-functional teams move much faster. The goal isn't more meetings—it's clearing operational bottlenecks so engineers and operators can simply execute.",
    humanScore: 0,
    humanPerplexity: 86.7,
    humanBurstiness: 5.4,
    grammarlyStatus: "0% AI Written",
    turnitinStatus: "0% AI Detected",
    gptZeroStatus: "100% Human",
    summary:
      "Eliminates empty corporate buzzwords and robotic transition adverbs in favor of pragmatic, high-impact leadership directives.",
  },
  {
    id: "growth",
    topic: "Product Marketing",
    category: "Product & Growth",
    icon: Megaphone,
    rawAI:
      "In today's fast-paced digital era, harnessing cutting-edge software platforms is essential for unleashing unprecedented velocity. Our comprehensive suite of solutions empowers modern enterprises to thrive.",
    rawCliches: [
      "In today's fast-paced digital era,",
      "harnessing cutting-edge",
      "unleashing unprecedented velocity",
      "comprehensive suite of solutions",
    ],
    aiScore: 92,
    rawPerplexity: 15.3,
    rawBurstiness: 1.4,
    human:
      "Building software shouldn't feel like wrestling your tooling. We engineered fast zero-config deployments and transparent analytics so your developers can focus on shipping features that convert.",
    humanScore: 0,
    humanPerplexity: 94.0,
    humanBurstiness: 6.7,
    grammarlyStatus: "0% AI Written",
    turnitinStatus: "0% AI Detected",
    gptZeroStatus: "100% Human",
    summary:
      "Purges generic marketing hyperbole to deliver punchy, empathetic value propositions that resonate with technical buyers.",
  },
];

export function InteractiveCurtainComparison() {
  const { toast } = useToast();
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"curtain" | "diff">("curtain");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const autoPlayAngleRef = useRef<number>(0);

  const activeCase = CASES[selectedCaseIdx];

  // Move handler calculating percentage
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(Math.round(pct * 10) / 10);
  }, []);

  // Window pointer event listeners for seamless drag even if mouse leaves viewport
  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      handleMove(e.clientX);
    };

    const onPointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, handleMove]);

  // Automated gentle scan demonstration loop
  useEffect(() => {
    if (!isAutoPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      autoPlayAngleRef.current += delta * 1.5;
      // Smooth sinusoidal oscillation between 18% and 82%
      const newPos = 50 + 32 * Math.sin(autoPlayAngleRef.current);
      setSliderPosition(Math.round(newPos * 10) / 10);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoPlaying]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsAutoPlaying(false);
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleCopyHumanized = async () => {
    try {
      await navigator.clipboard.writeText(activeCase.human);
      setCopied(true);
      toast({
        title: "Prose copied to clipboard",
        description: "Human-grade text ready for submission or publishing.",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy text manually.",
        type: "error",
      });
    }
  };

  return (
    <section className="w-full py-20 sm:py-28 border-t border-border/60 bg-muted/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10 relative z-10">
        {/* Header Title Section */}
        <div className="text-center space-y-3.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 badge-pro shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="font-semibold tracking-wide uppercase text-[11px]">Real-Time Forensic Lens</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Drag to Reveal the{" "}
            <span className="text-gradient">Transformation</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Slide the divider back and forth to inspect how rigid synthetic phrasing morphs into nuanced human cadence that bypasses AI detection.
          </p>
        </div>

        {/* Interactive Topic & Scenario Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 shadow-sm max-w-fit mx-auto">
          {CASES.map((c, idx) => {
            const Icon = c.icon;
            const isSelected = selectedCaseIdx === idx;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCaseIdx(idx);
                  setIsAutoPlaying(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                <span>{c.category}</span>
              </button>
            );
          })}
        </div>

        {/* Enterprise Studio Window Frame */}
        <div className="app-window relative border border-border/80 shadow-2xl bg-card/90 backdrop-blur-xl">
          {/* macOS Title Bar & Utility Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-border/70 bg-muted/30">
            {/* macOS Window Controls + Engine Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/30" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/30" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/30" />
              </div>
              <div className="h-4 w-px bg-border/80 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                <span>FORENSIC CADENCE LENS • {activeCase.topic}</span>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-2 ml-auto">
              {/* View Switcher: Curtain Slider vs Side-by-Side Diff */}
              <div className="flex items-center p-0.5 rounded-lg bg-muted border border-border text-xs font-medium">
                <button
                  onClick={() => setViewMode("curtain")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === "curtain"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Interactive Curtain Lens view"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Curtain Lens</span>
                </button>
                <button
                  onClick={() => setViewMode("diff")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === "diff"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Side-by-side Diff view"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Side-by-Side</span>
                </button>
              </div>

              {/* Auto Scan Demonstration Button (Only in Curtain mode) */}
              {viewMode === "curtain" && (
                <button
                  onClick={toggleAutoPlay}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                    isAutoPlaying
                      ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
                      : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  title={isAutoPlaying ? "Pause Auto Scan" : "Play Auto Scan Demonstration"}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-indigo-500 animate-pulse" />
                      <span className="hidden sm:inline">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-indigo-500" />
                      <span className="hidden sm:inline">Auto Scan</span>
                    </>
                  )}
                </button>
              )}

              {/* Copy Prose Button */}
              <button
                onClick={handleCopyHumanized}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Copy humanized text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy Prose</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* VIEWPORT 1: INTERACTIVE CURTAIN LENS */}
          {viewMode === "curtain" ? (
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              className="relative min-h-[340px] sm:min-h-[300px] w-full select-none overflow-hidden cursor-ew-resize bg-background/50"
            >
              {/* UNDER LAYER: 100% Humanized Prose (Right reveal layer) */}
              <div
                style={{
                  clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                }}
                className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-emerald-500/[0.04] to-teal-500/[0.08]"
              >
                {/* Top Badge: Humanized */}
                <div className="flex items-center justify-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30 shadow-sm backdrop-blur-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Humanized ({activeCase.humanScore}% AI Score)
                  </span>
                </div>

                {/* Body Text: Exactly Left-Aligned & Geometrically Synced */}
                <div className="max-w-3xl space-y-3 py-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Natural Human Cadence & Balanced Flow
                  </span>
                  <p className="text-base sm:text-xl font-normal leading-relaxed text-foreground antialiased">
                    &ldquo;{activeCase.human}&rdquo;
                  </p>
                </div>

                {/* Bottom Verification Footer */}
                <div className="flex flex-wrap items-center justify-end gap-3 text-xs text-muted-foreground pt-3 border-t border-emerald-500/10">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed Turnitin & Grammarly
                  </span>
                  <span className="text-foreground/80 font-mono font-medium">
                    • High Burstiness ({activeCase.humanBurstiness} σ)
                  </span>
                </div>
              </div>

              {/* OVER LAYER: Raw AI Flagged Text (Left reveal layer) */}
              <div
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
                className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-rose-500/[0.06] to-pink-500/[0.08]"
              >
                {/* Top Badge: Raw AI Flagged */}
                <div className="flex items-center justify-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/30 shadow-sm backdrop-blur-sm">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Raw AI Detected ({activeCase.aiScore}% AI Score)
                  </span>
                </div>

                {/* Body Text: Matching exact left-alignment and sizing */}
                <div className="max-w-3xl space-y-3 py-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                    Predictable Synthetic Vocabulary & Flat Cadence
                  </span>
                  <p className="text-base sm:text-xl font-normal leading-relaxed text-foreground/90 antialiased">
                    &ldquo;{activeCase.rawAI}&rdquo;
                  </p>
                </div>

                {/* Bottom Detection Signals */}
                <div className="flex flex-wrap items-center justify-start gap-3 text-xs text-rose-600 dark:text-rose-400 pt-3 border-t border-rose-500/10">
                  <span className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Telltale Clichés & Machine Connectors
                  </span>
                  <span className="font-mono text-foreground/70">• Low Perplexity ({activeCase.rawPerplexity})</span>
                </div>
              </div>

              {/* GLOWING LASER DIVIDER BAR */}
              <div
                style={{ left: `${sliderPosition}%` }}
                className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-400 via-indigo-500 to-cyan-400 shadow-[0_0_18px_rgba(99,102,241,0.8),0_0_35px_rgba(6,182,212,0.4)] z-30 pointer-events-none -translate-x-1/2"
              >
                {/* Dynamic Floating Ratio Tooltip */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-card/95 border border-indigo-500/40 text-[10px] font-mono font-bold text-foreground shadow-lg backdrop-blur-md pointer-events-none flex items-center gap-1.5">
                  <span className="text-rose-500">{Math.round(sliderPosition)}% AI</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-emerald-500">{100 - Math.round(sliderPosition)}% Human</span>
                </div>

                {/* Tactile Grab Handle with Dual Arrows */}
                <div
                  onPointerDown={handlePointerDown}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-2xl flex items-center justify-center pointer-events-auto transition-transform ${
                    isDragging ? "scale-110 cursor-grabbing ring-4 ring-indigo-500/30" : "hover:scale-105 cursor-grab"
                  }`}
                  aria-label="Drag divider to inspect comparison"
                >
                  <MoveHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>
          ) : (
            /* VIEWPORT 2: ENTERPRISE SIDE-BY-SIDE DIFF VIEW */
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-background/50">
              {/* Left Column: Raw AI */}
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.04] p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Original Raw AI ({activeCase.aiScore}% AI)
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      Perplexity: {activeCase.rawPerplexity}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed italic">
                    &ldquo;{activeCase.rawAI}&rdquo;
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-rose-500/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Flagged Synthetic Clichés:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCase.rawCliches.map((cliche, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-300 text-[11px] font-mono border border-rose-500/20"
                      >
                        {cliche}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Humanized Authentic Prose */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Humanized Output ({activeCase.humanScore}% AI)
                    </span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Perplexity: {activeCase.humanPerplexity}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
                    &ldquo;{activeCase.human}&rdquo;
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-emerald-500/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Stylistic Transformation:
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{activeCase.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Position Preset Controls (Curtain Mode Only) */}
          {viewMode === "curtain" && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-t border-border/70 bg-muted/20 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-semibold text-foreground">Quick Inspect:</span>
                <button
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setSliderPosition(15);
                  }}
                  className={`px-3 py-1 rounded-lg border transition-colors ${
                    sliderPosition <= 25
                      ? "bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 font-semibold"
                      : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Raw AI Focus
                </button>
                <button
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setSliderPosition(50);
                  }}
                  className={`px-3 py-1 rounded-lg border transition-colors ${
                    sliderPosition >= 45 && sliderPosition <= 55
                      ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  50/50 Forensic Split
                </button>
                <button
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setSliderPosition(85);
                  }}
                  className={`px-3 py-1 rounded-lg border transition-colors ${
                    sliderPosition >= 75
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Human Prose Focus
                </button>
              </div>

              <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5 ml-auto">
                <span>💡 Tip: Click or drag anywhere on the canvas</span>
              </div>
            </div>
          )}
        </div>

        {/* Forensic Telemetry & Verification Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Metric 1: Syntactic Perplexity */}
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Perplexity</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground">
              {activeCase.humanPerplexity}{" "}
              <span className="text-xs font-normal text-muted-foreground">vs {activeCase.rawPerplexity}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              High lexical variety eliminates robotic n-gram predictability.
            </p>
          </div>

          {/* Metric 2: Burstiness Index */}
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Burstiness Cadence</span>
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {activeCase.humanBurstiness} σ{" "}
              <span className="text-xs font-normal text-muted-foreground">vs {activeCase.rawBurstiness} σ</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Dynamic sentence lengths replace machine monotony.</p>
          </div>

          {/* Metric 3: Clichés Purged */}
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Clichés Purged</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground">
              {activeCase.rawCliches.length}{" "}
              <span className="text-xs font-normal text-emerald-500 font-semibold">Neutralized</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              No &ldquo;multifaceted&rdquo;, &ldquo;delve into&rdquo;, or &ldquo;testament to&rdquo;.
            </p>
          </div>

          {/* Metric 4: Multi-Scanner Clearance */}
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Scanner Verdict</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              Passed Audit
            </div>
            <p className="text-[11px] text-muted-foreground">Calibrated for Turnitin, Grammarly & GPTZero standards.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
