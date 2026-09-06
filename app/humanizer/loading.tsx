import React from "react";
import { Sparkles } from "lucide-react";

export default function HumanizerLoading() {
  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
      {/* Sidebar Skeleton (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card shrink-0 shadow-sm z-20">
        <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="font-bold tracking-tight text-base">
            Humanize<span className="text-indigo-600 dark:text-indigo-400">AI</span>
          </span>
        </div>

        <div className="p-4 space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-muted/60 animate-pulse" />
          ))}
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
          <div className="space-y-1.5">
            <div className="h-5 w-40 bg-muted/70 rounded-md animate-pulse" />
            <div className="h-3 w-64 bg-muted/40 rounded-md animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 bg-muted/60 rounded-lg animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-muted/60 animate-pulse" />
          </div>
        </header>

        <div className="p-6 max-w-6xl w-full mx-auto space-y-6">
          {/* Dual Panel Editor Skeleton */}
          <div className="app-window border border-border/80 rounded-2xl bg-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="h-6 w-36 bg-muted/70 rounded-md animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-muted/50 rounded-lg animate-pulse" />
                <div className="h-8 w-28 bg-indigo-500/20 rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[350px]">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-3 animate-pulse">
                <div className="h-4 w-28 bg-muted/80 rounded" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 w-full bg-muted/50 rounded" />
                  <div className="h-3.5 w-5/6 bg-muted/50 rounded" />
                  <div className="h-3.5 w-4/6 bg-muted/50 rounded" />
                </div>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-5 space-y-3 animate-pulse">
                <div className="h-4 w-32 bg-emerald-500/20 rounded" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 w-full bg-muted/40 rounded" />
                  <div className="h-3.5 w-4/5 bg-muted/40 rounded" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <div className="h-11 w-44 rounded-xl bg-indigo-600/80 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
