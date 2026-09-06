"use client";

import React, { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DetectionGauge } from "@/components/editor/DetectionGauge";
import { SentenceAnalysisViewer } from "@/components/editor/SentenceAnalysisViewer";
import { ShieldCheck, Upload, Trash2, Clipboard, RefreshCw, AlertTriangle } from "lucide-react";
import { DetectionResult } from "@/lib/ai";
import { useToast } from "@/components/ui/toast";
import { countWords, countCharacters } from "@/lib/utils";

export default function AIDetectorPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputText, setInputText] = useState(
    "Furthermore, utilizing artificial intelligence empowers organizations to facilitate seamless digital transformation. It is important to note that predictive algorithms play a crucial role across modern technical landscapes. Moreover, empirical observations stand as a testament to transformative efficiency."
  );
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wordsIn = countWords(inputText);
  const charsIn = countCharacters(inputText);

  const handleAnalyze = async () => {
    if (wordsIn < 5) {
      toast({
        title: "Text Too Short",
        description: "Please enter at least 15-20 characters for meaningful analysis.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        toast({
          title: "Detection Completed",
          description: `Identified verdict: ${data.data.verdict}`,
          type: "success",
        });
      } else {
        toast({
          title: "Scan Failed",
          description: data.error || "Unable to analyze text.",
          type: "error",
        });
      }
    } catch {
      toast({
        title: "Connection Error",
        description: "Could not reach detection service.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast({ title: "Pasted from clipboard", type: "info" });
    } catch {
      toast({ title: "Use Ctrl+V to paste", type: "error" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.data?.extractedText) {
        setInputText(data.data.extractedText);
        toast({
          title: "File Loaded",
          description: `Extracted ${data.data.wordCount} words from ${data.data.fileName}.`,
          type: "success",
        });
      }
    } catch {
      toast({ title: "Upload Failed", type: "error" });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <AppShell
      title="AI Content Detector"
      description="Sentence-level probabilistic analysis with perplexity and burstiness metrics."
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Transparent Disclaimer Banner */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Scientific Notice:</strong> AI detection is probabilistic and may
            produce false positives or false negatives. Results should not be treated as definitive
            proof of authorship. Our engine provides heuristic indicators of lexical predictability
            and syntax variation.
          </p>
        </div>

        {/* Input Textarea Card */}
        <div className="rounded-3xl bg-card border border-border/80 shadow-sm overflow-hidden space-y-2">
          {/* Header controls */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Input Document or Draft
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePaste}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Clipboard className="w-3.5 h-3.5" />
                Paste
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.docx,.pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
              {inputText && (
                <button
                  onClick={() => setInputText("")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text here to scan for AI likelihood and sentence-level syntactical patterns..."
            rows={7}
            className="w-full px-5 py-3 bg-transparent resize-none focus:outline-none text-sm leading-relaxed"
          />

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>{wordsIn} words</span>
              <span>•</span>
              <span>{charsIn} characters</span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || wordsIn < 3}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 text-xs transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Scanning Metrics...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Analyze Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <DetectionGauge result={result} />
            <SentenceAnalysisViewer sentences={result.sentences} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
