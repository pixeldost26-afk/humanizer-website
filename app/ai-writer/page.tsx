"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PenTool, Sparkles, Copy, Check, Bookmark, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { countWords } from "@/lib/utils";

export default function AIWriterPage() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(
    "10 proven strategies to enhance focus and deep work in a remote work environment"
  );
  const [contentType, setContentType] = useState("article");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [language, setLanguage] = useState("English (US)");
  const [audience, setAudience] = useState("General Professionals");
  const [creativity, setCreativity] = useState(3);

  const [outputContent, setOutputContent] = useState("");
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    { id: "blog", label: "Blog Post" },
    { id: "essay", label: "Academic Essay" },
    { id: "article", label: "In-Depth Article" },
    { id: "email", label: "Business Email" },
    { id: "social", label: "Social Media Post" },
    { id: "product", label: "Product Description" },
    { id: "marketing", label: "Marketing Copy" },
    { id: "story", label: "Creative Story" },
    { id: "youtube", label: "YouTube Script" },
    { id: "seo", label: "SEO Optimized Post" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: "Prompt Required", description: "Please enter a topic or prompt.", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          contentType,
          tone,
          length,
          language,
          audience,
          creativity,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setOutputContent(data.data.content);
        setSuggestedTitles(data.data.suggestedTitles || []);
        toast({
          title: "Generation Complete",
          description: `Generated ${data.data.wordCount} words.`,
          type: "success",
        });
      } else {
        toast({ title: "Generation Error", description: data.error, type: "error" });
      }
    } catch {
      toast({ title: "Network Error", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard", type: "success" });
  };

  const handleDownload = () => {
    const blob = new Blob([outputContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contentType}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported as Markdown", type: "success" });
  };

  const handleSave = async () => {
    try {
      await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: suggestedTitles[0] || `${contentType}: ${prompt.slice(0, 30)}`,
          content: outputContent,
          toolType: "WRITER",
        }),
      });
      toast({ title: "Saved to History", type: "success" });
    } catch {
      toast({ title: "Failed to save", type: "error" });
    }
  };

  return (
    <AppShell
      title="AI Writer"
      description="Create tailored essays, blog posts, emails, and articles across 10 distinct formats."
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Controls Grid */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
          {/* Format selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Content Format
            </label>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    contentType === type.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-muted/40 border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Topic or Instructions
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like the AI to write about? Include key points, goals, or constraints..."
              rows={3}
              className="w-full p-3.5 rounded-2xl bg-muted/20 border border-border focus:border-indigo-500 focus:outline-none text-sm leading-relaxed"
            />
          </div>

          {/* Nuance Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-1">
            <div>
              <label className="text-muted-foreground block mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground"
              >
                {["Professional", "Conversational", "Persuasive", "Academic", "Inspirational"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="text-muted-foreground block mb-1">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground"
              >
                <option value="short">Short (~150 words)</option>
                <option value="medium">Medium (~350 words)</option>
                <option value="long">Long (~700 words)</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground block mb-1">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground"
              />
            </div>

            <div>
              <label className="text-muted-foreground block mb-1">
                Creativity Level: <span className="font-semibold text-foreground">{creativity}/5</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={creativity}
                onChange={(e) => setCreativity(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Viewer */}
        {outputContent && (
          <div className="rounded-3xl bg-card border border-border/80 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20 text-xs">
              <span className="font-bold text-foreground uppercase tracking-wider">
                Generated Draft ({countWords(outputContent)} words)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSave}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 transition-colors"
                  title="Save to History"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  title="Export Markdown"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="p-6 text-sm leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/20 font-sans">
              {outputContent}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
