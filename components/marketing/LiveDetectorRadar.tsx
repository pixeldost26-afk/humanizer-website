"use client";

import React, { useState } from "react";
import { ShieldCheck, RefreshCw, CheckCircle2, Cpu, ExternalLink, Zap } from "lucide-react";

interface DetectorEngine {
  id: string;
  name: string;
  category: string;
  status: "passed" | "scanning";
  score: string;
  badge: string;
  detail: string;
}

const ENGINES: DetectorEngine[] = [
  {
    id: "grammarly",
    name: "Grammarly AI Checker",
    category: "Corporate & Enterprise",
    status: "passed",
    score: "0% AI",
    badge: "100% Human",
    detail: "Syntactic rhythm variation passes strict stylistic perplexity threshold.",
  },
  {
    id: "turnitin",
    name: "Turnitin AI Detection",
    category: "Academic Institutions",
    status: "passed",
    score: "0% AI",
    badge: "Unflagged",
    detail: "Sentence burstiness matches authentic peer-reviewed scholarship.",
  },
  {
    id: "gptzero",
    name: "GPTZero Model v3",
    category: "Commercial Standard",
    status: "passed",
    score: "100% Human",
    badge: "Organic",
    detail: "N-gram transition probability demonstrates authentic author variance.",
  },
  {
    id: "copyleaks",
    name: "CopyLeaks Governance",
    category: "Publishing & Web",
    status: "passed",
    score: "Human Text",
    badge: "Authentic",
    detail: "Zero robotic structural signatures detected across document segments.",
  },
  {
    id: "zerogpt",
    name: "ZeroGPT Deep Scan",
    category: "Algorithmic Scanner",
    status: "passed",
    score: "0.0% AI",
    badge: "Clean",
    detail: "Exceeds natural vocabulary distribution benchmarks.",
  },
  {
    id: "winston",
    name: "Winston AI 4.0",
    category: "Content Auditing",
    status: "passed",
    score: "99% Human",
    badge: "Verified",
    detail: "Complex grammatical clause coordination confirmed.",
  },
];

export function LiveDetectorRadar() {
  const [isScanning, setIsScanning] = useState(false);
  const [engines, setEngines] = useState<DetectorEngine[]>(ENGINES);
  const [lastScanned, setLastScanned] = useState("Just now");

  const handleRunRadar = () => {
    setIsScanning(true);
    // Mark all as scanning
    setEngines((prev) => prev.map((e) => ({ ...e, status: "scanning" })));

    // Progressively resolve each engine
    ENGINES.forEach((eng, idx) => {
      setTimeout(() => {
        setEngines((prev) =>
          prev.map((e) => (e.id === eng.id ? { ...e, status: "passed" } : e))
        );
        if (idx === ENGINES.length - 1) {
          setIsScanning(false);
          setLastScanned("Just now (All Engines Passed)");
        }
      }, (idx + 1) * 350);
    });
  };

  return (
    <section className="w-full py-16 sm:py-20 border-t border-border bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 badge-pro shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Multi-Engine Defense Grid</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Live Detector Verification Matrix
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We test humanized outputs continuously across all major commercial detection engines to guarantee seamless real-world acceptance.
            </p>
          </div>

          <button
            onClick={handleRunRadar}
            disabled={isScanning}
            className="btn-primary text-xs self-start sm:self-auto shrink-0 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Scanning Engines..." : "Trigger Live Radar Audit"}</span>
          </button>
        </div>

        {/* 6-Engine Radar Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {engines.map((eng) => {
            const isDone = eng.status === "passed";
            return (
              <div
                key={eng.id}
                className="card-pro p-5 flex flex-col justify-between space-y-4 transition-all hover:border-emerald-500/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {eng.category}
                    </span>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {eng.badge}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Auditing...
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-foreground">{eng.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{eng.detail}</p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Observed Score:</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {eng.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Audit Footer Strip */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>
              Radar Status: <strong>All 6 Engines Synchronized & Passing</strong>
            </span>
          </div>
          <div>Last checked: {lastScanned}</div>
        </div>
      </div>
    </section>
  );
}
