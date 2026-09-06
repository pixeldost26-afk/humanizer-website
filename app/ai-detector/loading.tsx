import React from "react";
import { ShieldCheck } from "lucide-react";

export default function AIDetectorLoading() {
  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card shrink-0 shadow-sm z-20">
        <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 space-y-4 animate-pulse">
              <div className="h-6 w-36 bg-muted/70 rounded-md" />
              <div className="h-64 bg-muted/20 rounded-xl border border-border/50" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-32 bg-muted/40 rounded" />
                <div className="h-10 w-36 bg-emerald-600/70 rounded-xl" />
              </div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 animate-pulse">
              <div className="h-6 w-40 bg-muted/70 rounded-md" />
              <div className="h-48 rounded-full bg-muted/20 mx-auto w-48 border border-border/50" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted/40 rounded" />
                <div className="h-4 w-4/5 bg-muted/40 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
