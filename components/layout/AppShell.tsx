"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Sparkles,
  ShieldCheck,
  PenTool,
  Repeat,
  SpellCheck,
  FileText,
  Palette,
  LayoutDashboard,
  History,
  CreditCard,
  Settings,
  ShieldAlert,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Zap,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AppShell({ children, title, description }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userCredits, setUserCredits] = useState<{
    available: number;
    total: number;
    plan: string;
  }>({
    available: 1000,
    total: 1000,
    plan: "FREE",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/signup?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/usage")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setUserCredits({
              available: data.data.balance.available,
              total: data.data.balance.total,
              plan: data.data.plan,
            });
          }
        })
        .catch(() => {});
    }
  }, [pathname, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">Loading studio...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">Redirecting to Sign Up...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Humanizer", href: "/humanizer", icon: Sparkles, color: "text-indigo-500" },
    { name: "AI Detector", href: "/ai-detector", icon: ShieldCheck, color: "text-emerald-500" },
    { name: "AI Writer", href: "/ai-writer", icon: PenTool, color: "text-blue-500" },
    { name: "Paraphraser", href: "/paraphraser", icon: Repeat, color: "text-purple-500" },
    { name: "Grammar", href: "/grammar", icon: SpellCheck, color: "text-amber-500" },
    { name: "Summarizer", href: "/summarizer", icon: FileText, color: "text-pink-500" },
    { name: "Tone Rewriter", href: "/tone", icon: Palette, color: "text-cyan-500" },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
      {/* Desktop Sidebar with Clean Professional Enterprise Depth */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card shrink-0 shadow-sm z-20">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-border justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-base">
              Humanize<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </Link>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Studio Tools
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-primary-foreground" : item.color || "text-muted-foreground"
                  )}
                />
                <span className="flex-1 truncate">{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}

          {isAdmin && (
            <div className="pt-4 space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Administration
              </div>
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  pathname === "/admin"
                    ? "bg-rose-600 text-white font-semibold shadow-md"
                    : "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                )}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Admin Console</span>
              </Link>
            </div>
          )}
        </div>

        {/* Unlimited Access Badge */}
        <div className="p-3.5 m-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">Access Status</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-500/30">
              Unlimited Free
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            All AI tools and word limits are 100% unlocked with zero restrictions.
          </p>
        </div>

        {/* User Account / Footer */}
        <div className="p-3 border-t border-border">
          {session?.user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-8 h-8 rounded-full shrink-0 object-cover border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0">
                    {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex-1 py-2 text-center rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex-1 py-2 text-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors shadow-sm shadow-indigo-600/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-border text-foreground hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-foreground">
                {title || "HumanizeAI Studio"}
              </h1>
              {description && (
                <p className="text-xs text-muted-foreground hidden sm:block">{description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />

          <div className="relative w-72 max-w-[85vw] bg-card border-r border-border h-full flex flex-col p-4 z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-base">HumanizeAI</span>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1 rounded-lg border border-border text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
                      isActive
                        ? "bg-indigo-600 text-white font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>

            <div className="pt-3 border-t border-border">
              {session?.user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 px-2">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-7 h-7 rounded-full shrink-0 object-cover border border-border"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0">
                        {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2.5 text-center rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2.5 text-center rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
