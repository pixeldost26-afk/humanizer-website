"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Sparkles,
  ShieldCheck,
  PenTool,
  Repeat,
  SpellCheck,
  FileText,
  Palette,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  LayoutDashboard,
  LogOut,
  User,
  Zap,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const tools = [
    {
      name: "AI Humanizer",
      href: "/humanizer",
      desc: "Transform robotic AI text into natural human prose",
      icon: Sparkles,
      color: "text-indigo-500 bg-indigo-500/10",
    },
    {
      name: "AI Detector",
      href: "/ai-detector",
      desc: "Sentence-level probabilistic AI detection & analysis",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      name: "AI Writer",
      href: "/ai-writer",
      desc: "Generate blogs, essays, emails & marketing copy",
      icon: PenTool,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      name: "Paraphraser",
      href: "/paraphraser",
      desc: "Rewrite sentences with fluent synonyms and tones",
      icon: Repeat,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      name: "Grammar Checker",
      href: "/grammar",
      desc: "Instant inline spelling, grammar & style fixes",
      icon: SpellCheck,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      name: "Summarizer",
      href: "/summarizer",
      desc: "Condense long articles and documents to key points",
      icon: FileText,
      color: "text-pink-500 bg-pink-500/10",
    },
    {
      name: "Tone Rewriter",
      href: "/tone",
      desc: "Change mood into Professional, Casual, Academic, etc.",
      icon: Palette,
      color: "text-cyan-500 bg-cyan-500/10",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">
              ManaHumanize<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-medium">
          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted/70 transition-colors">
              Tools
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  toolsOpen && "rotate-180"
                )}
              />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-0 w-[540px] p-3 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-xl grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-150 card-pro">
                {tools.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setToolsOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/70 transition-colors group"
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                          item.color
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/#how-it-works"
            className="px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/#faq"
            className="px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup?callbackUrl=/humanizer"
                prefetch={true}
                className="btn-primary"
              >
                <Zap className="w-4 h-4" />
                Try Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg border border-border text-foreground hover:bg-muted"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-xl px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-2">
            AI Tools
          </div>
          <div className="grid grid-cols-1 gap-1">
            {tools.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-foreground text-sm font-medium"
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center",
                      item.color
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-foreground text-sm font-medium"
            >
              <span>Contact Support</span>
            </Link>
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            {session?.user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl border border-border text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
