import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQSection } from "@/components/marketing/FAQSection";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  PenTool,
  Repeat,
  SpellCheck,
  FileText,
  Palette,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100% Free Access — ManaHumanizeAI",
  description:
    "ManaHumanizeAI is completely free to use with unlimited words. No billing plans, credit cards, or subscriptions required.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  const tools = [
    {
      name: "AI Humanizer",
      href: "/humanizer",
      desc: "Transform robotic text into natural human prose with fluid cadence.",
      icon: Sparkles,
      color: "text-indigo-500 bg-indigo-500/10",
    },
    {
      name: "AI Content Detector",
      href: "/ai-detector",
      desc: "Sentence-level probability analysis with transparent explanations.",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      name: "AI Writer",
      href: "/ai-writer",
      desc: "Draft essays, articles, professional emails, and copy in seconds.",
      icon: PenTool,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      name: "Paraphraser",
      href: "/paraphraser",
      desc: "Rephrase sentences with fluent vocabulary and diverse modes.",
      icon: Repeat,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      name: "Grammar Checker",
      href: "/grammar",
      desc: "Instant inline corrections for spelling, punctuation, and style.",
      icon: SpellCheck,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      name: "Text Summarizer",
      href: "/summarizer",
      desc: "Condense long papers and articles into crisp takeaways.",
      icon: FileText,
      color: "text-pink-500 bg-pink-500/10",
    },
    {
      name: "Tone Rewriter",
      href: "/tone",
      desc: "Adapt writing for Professional, Academic, Casual, and more.",
      icon: Palette,
      color: "text-cyan-500 bg-cyan-500/10",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-16 space-y-16">
        {/* Main Free Banner */}
        <section className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero Paywalls • No Billing Plans Needed</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            ManaHumanizeAI is <span className="text-gradient">100% Free</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            All AI writing, detection analysis, humanization, and grammar tools are completely free to use
            with unlimited words. No credit card, no subscription plans, and no hidden fees.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/humanizer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              Start Humanizing Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-detector"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-base transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Open AI Detector
            </Link>
          </div>
        </section>

        {/* Unlocked Features Grid */}
        <section className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="rounded-3xl bg-card border border-border/80 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                All Features Unlocked For Everyone
              </h2>
              <p className="text-sm text-muted-foreground">
                Everything you need to write and analyze text with complete confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="p-5 rounded-2xl border border-border bg-background/50 hover:bg-muted/50 transition-all hover:border-indigo-500/30 group"
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tool.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tool.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
