import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Zap, Award, Layers } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroInteractiveDemo } from "@/components/marketing/HeroInteractiveDemo";
import { DetectorBenchmark } from "@/components/marketing/DetectorBenchmark";
import { BentoFeatureGrid } from "@/components/marketing/BentoFeatureGrid";
import { PipelineArchitecture } from "@/components/marketing/PipelineArchitecture";
import { TrustedBy } from "@/components/marketing/TrustedBy";
import { SupportedLanguages } from "@/components/marketing/SupportedLanguages";
import { FAQSection } from "@/components/marketing/FAQSection";
import { InteractiveCurtainComparison } from "@/components/marketing/InteractiveCurtainComparison";
import { PersonaStudioSelector } from "@/components/marketing/PersonaStudioSelector";
import { LiveDetectorRadar } from "@/components/marketing/LiveDetectorRadar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-indigo-500/20 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full relative">
        {/* =========================================================
            HERO SECTION: Clean, Authoritative Enterprise Architecture
            ========================================================= */}
        <section className="relative w-full pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8 max-w-5xl">
            {/* Release Pill Badge */}
            <div className="inline-flex items-center gap-2 badge-pro shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HumanizeAI 2.0 • 0% AI Detection Guaranteed on Grammarly</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.12]">
              Turn AI-Generated Text Into{" "}
              <span className="text-gradient">100% Human Prose</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
              Engineered for researchers, authors, and professionals. Transform robotic syntax into natural cadence
              with verified 0% AI detection across all commercial scanners.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/humanizer"
                prefetch={true}
                className="btn-primary text-base px-7 py-3 rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Humanize Text Free</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
              <Link
                href="/ai-detector"
                prefetch={true}
                className="btn-secondary text-base px-7 py-3 rounded-xl active:scale-[0.98] transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verify with AI Detector</span>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-foreground">0% AI on Grammarly & Turnitin</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-foreground">100% Free • Unlimited Words</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-foreground">Preserves Citations & Facts</span>
              </div>
            </div>

            {/* macOS Framed Interactive Studio Window */}
            <div className="pt-6">
              <HeroInteractiveDemo />
            </div>
          </div>
        </section>

        {/* =========================================================
            SIGNATURE FEATURE 1: DRAGGABLE FORENSIC CURTAIN LENS
            ========================================================= */}
        <InteractiveCurtainComparison />

        {/* =========================================================
            DETECTOR BENCHMARK EVIDENCE
            ========================================================= */}
        <DetectorBenchmark />

        {/* =========================================================
            SIGNATURE FEATURE 2: AUTHORIAL PERSONA VOICE STUDIO
            ========================================================= */}
        <PersonaStudioSelector />

        {/* =========================================================
            CORE VALUE PILLARS & BENTO GRID
            ========================================================= */}
        <BentoFeatureGrid />

        {/* =========================================================
            SIGNATURE FEATURE 3: LIVE MULTI-DETECTOR RADAR MATRIX
            ========================================================= */}
        <LiveDetectorRadar />

        {/* =========================================================
            4-STAGE PRECISION PIPELINE
            ========================================================= */}
        <PipelineArchitecture />

        {/* =========================================================
            INSTITUTION & PUBLISHER PROOF
            ========================================================= */}
        <TrustedBy />

        {/* =========================================================
            GLOBAL MULTILINGUAL ENGINE (50+ LANGUAGES)
            ========================================================= */}
        <SupportedLanguages />

        {/* =========================================================
            FREQUENTLY ASKED QUESTIONS
            ========================================================= */}
        <FAQSection />

        {/* =========================================================
            FINAL CALL TO ACTION BANNER
            ========================================================= */}
        <section className="w-full py-20 bg-muted/30 border-t border-border/80 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl space-y-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2 border border-indigo-500/20 shadow-xs">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready to Make Your Writing Naturally Yours?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Join over 120,000+ authors, researchers, students, and professionals publishing high-trust prose every single day.
              Unlimited words, zero subscriptions, completely free forever.
            </p>
            <div className="pt-2">
              <Link
                href="/humanizer"
                prefetch={true}
                className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Humanizing for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
