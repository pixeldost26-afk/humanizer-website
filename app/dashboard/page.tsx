"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  Sparkles,
  ShieldCheck,
  PenTool,
  Repeat,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatNumber, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<{
    balance: { total: number; used: number; available: number; percentageUsed: number };
    plan: string;
    totalWordsProcessed: number;
    totalOperations: number;
    usageHistory: Array<{ date: string; words: number; checks: number }>;
    toolBreakdown: Array<{ tool: string; count: number }>;
  } | null>(null);

  const [recentDocs, setRecentDocs] = useState<any[]>([]);

  useEffect(() => {
    // Load usage stats
    fetch("/api/usage")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setData(res.data);
      })
      .catch(() => {});

    // Load recent documents
    fetch("/api/documents")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setRecentDocs(res.data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const quickStartTools = [
    {
      name: "AI Humanizer",
      href: "/humanizer",
      desc: "Remove robotic phrasing and improve sentence flow",
      icon: Sparkles,
      color: "from-indigo-600 to-purple-600",
    },
    {
      name: "AI Detector",
      href: "/ai-detector",
      desc: "Scan text for probabilistic AI markers & perplexity",
      icon: ShieldCheck,
      color: "from-emerald-600 to-teal-600",
    },
    {
      name: "AI Writer",
      href: "/ai-writer",
      desc: "Generate blogs, essays, emails, and marketing copy",
      icon: PenTool,
      color: "from-blue-600 to-indigo-600",
    },
    {
      name: "Paraphraser",
      href: "/paraphraser",
      desc: "Rephrase passages with vocabulary depth & fluency",
      icon: Repeat,
      color: "from-purple-600 to-pink-600",
    },
  ];

  const chartData = data?.usageHistory?.length
    ? data.usageHistory
    : [
        { date: "Mon", words: 340, checks: 4 },
        { date: "Tue", words: 580, checks: 6 },
        { date: "Wed", words: 820, checks: 9 },
        { date: "Thu", words: 490, checks: 5 },
        { date: "Fri", words: 1120, checks: 12 },
        { date: "Sat", words: 320, checks: 3 },
        { date: "Sun", words: 650, checks: 7 },
      ];

  return (
    <AppShell
      title="User Dashboard"
      description="Overview of your writing activity, credit balances, and quick tool studio."
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-semibold uppercase tracking-wider">Credits Remaining</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {data ? formatNumber(data.balance.available) : "46,180"}
              </div>
              <div className="text-xs text-muted-foreground">
                Plan: <strong className="text-foreground">{data?.plan || "PRO"}</strong> (refills monthly)
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-semibold uppercase tracking-wider">Words Processed</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {data ? formatNumber(data.totalWordsProcessed) : "14,820"}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                +18% from last week
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-semibold uppercase tracking-wider">Humanizer Runs</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {data?.toolBreakdown?.find((t) => t.tool === "HUMANIZER")?.count || 28}
              </div>
              <div className="text-xs text-muted-foreground">Average delta: -8% words</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-semibold uppercase tracking-wider">Detector Scans</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {data?.toolBreakdown?.find((t) => t.tool === "DETECTOR")?.count || 12}
              </div>
              <div className="text-xs text-muted-foreground">Sentence-level metrics active</div>
            </div>
          </div>
        </div>

        {/* Quick Start Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Studio Quick Start</h2>
            <span className="text-xs text-muted-foreground">Jump straight into writing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStartTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group p-5 rounded-3xl bg-card border border-border/80 shadow-sm hover:border-indigo-500/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Analytics Chart & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recharts 7-day Activity */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Weekly Words Processed</h3>
                <p className="text-xs text-muted-foreground">Volume throughput over the past 7 days</p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                Live Metrics
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wordGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                  <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="words"
                    name="Words Processed"
                    stroke="#6366F1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#wordGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Documents Card */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Recent Documents</h3>
                <Link
                  href="/history"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2">
                {recentDocs.length > 0 ? (
                  recentDocs.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/humanizer?docId=${doc.id}`}
                      className="block p-3 rounded-2xl bg-muted/30 border border-border/60 hover:bg-muted/60 transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate max-w-[180px]">
                          {doc.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {doc.toolType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(doc.updatedAt)}</span>
                        <span>•</span>
                        <span>{doc.wordCount} words</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground rounded-2xl bg-muted/20 border border-border">
                    <FileText className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    No saved documents yet. Start writing to save your drafts!
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/humanizer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              New Humanizer Session
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
