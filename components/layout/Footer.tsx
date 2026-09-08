import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/40 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                ManaHumanize<span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The modern AI writing, detection analysis, humanization, and editorial platform.
              Crafting clear, authentic prose with confidence.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Probabilistic Analysis & Ethical AI Standards</span>
              </div>
            </div>
          </div>

          {/* AI Tools */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Tools
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/humanizer" className="hover:text-foreground transition-colors">
                  AI Humanizer
                </Link>
              </li>
              <li>
                <Link href="/ai-detector" className="hover:text-foreground transition-colors">
                  AI Detector
                </Link>
              </li>
              <li>
                <Link href="/ai-writer" className="hover:text-foreground transition-colors">
                  AI Writer
                </Link>
              </li>
              <li>
                <Link href="/paraphraser" className="hover:text-foreground transition-colors">
                  Paraphraser
                </Link>
              </li>
              <li>
                <Link href="/grammar" className="hover:text-foreground transition-colors">
                  Grammar Checker
                </Link>
              </li>
              <li>
                <Link href="/summarizer" className="hover:text-foreground transition-colors">
                  Summarizer
                </Link>
              </li>
              <li>
                <Link href="/tone" className="hover:text-foreground transition-colors">
                  Tone Rewriter
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-foreground transition-colors">
                  Document History
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-foreground transition-colors">
                  Settings & Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Ethics & Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>

              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  AI Detection Disclaimer
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Responsible AI Policy
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Security Architecture
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Transparency Disclaimer */}
        <div className="mt-12 pt-6 border-t border-border/60 text-xs text-muted-foreground/80 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> AI detection and humanization algorithms are probabilistic
            tools designed to enhance writing style, natural vocabulary cadence, and reading flow.
            AI detection scores represent statistical heuristics and should not be considered
            definitive proof of human or synthetic authorship. We encourage responsible and
            transparent usage across academic, creative, and professional environments.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ManaHumanizeAI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built for natural prose & high-trust writing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
