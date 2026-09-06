"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TwoPanelEditor } from "@/components/editor/TwoPanelEditor";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function SummarizerPage() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState(
    "Artificial intelligence has fundamentally revolutionized modern communication across business, education, and creative industries. While language models excel at synthesizing information and generating cohesive paragraphs, their output frequently suffers from predictable rhythmic cadences and repetitive transitions. Consequently, authors and researchers are increasingly adopting hybrid workflows that combine AI drafting with human discernment and targeted stylistic refinement. This balance guarantees speed while safeguarding authenticity and credibility."
  );
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"short" | "medium" | "detailed" | "bullets">("bullets");
  const [compressionRatio, setCompressionRatio] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const modes = [
    { id: "bullets", label: "Key Bullet Points", desc: "Top actionable takeaways" },
    { id: "short", label: "Quick Summary", desc: "1-2 punchy sentences" },
    { id: "medium", label: "Balanced Overview", desc: "Core context & main premises" },
    { id: "detailed", label: "In-Depth Summary", desc: "Comprehensive recap of all nuances" },
  ];

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, mode }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOutputText(data.data.summary);
        setCompressionRatio(data.data.compressionRatio);
        toast({
          title: "Summary Ready",
          description: `Condensed text by ${data.data.compressionRatio}%.`,
          type: "success",
        });
      }
    } catch {
      toast({ title: "Summarization Failed", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell
      title="Executive Summarizer"
      description="Condense long documents, research papers, and articles into actionable insights."
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <TwoPanelEditor
          inputTitle="Source Document / Article"
          outputTitle="Executive Summary"
          inputText={inputText}
          setInputText={setInputText}
          outputText={outputText}
          isLoading={isLoading}
          onAction={handleSummarize}
          actionButtonText="Summarize Content"
          actionButtonIcon={<FileText className="w-4 h-4" />}
          onRegenerate={handleSummarize}
          metricsBadge={
            compressionRatio !== undefined ? `Compressed by ${compressionRatio}%` : undefined
          }
          childrenControls={
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Summary Output Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      mode === m.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-muted/40 border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[10px] opacity-75 line-clamp-1 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          }
        />
      </div>
    </AppShell>
  );
}
