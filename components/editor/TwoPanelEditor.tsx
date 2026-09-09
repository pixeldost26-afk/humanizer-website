"use client";

import React, { useRef, useState } from "react";
import {
  Copy,
  Check,
  Download,
  Trash2,
  Upload,
  Clipboard,
  Sparkles,
  RefreshCw,
  Bookmark,
  Activity,
  ShieldCheck,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { countWords, countCharacters } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { CadenceWaveformVisualizer } from "@/components/marketing/CadenceWaveformVisualizer";
import { ClichePurgeInspector } from "@/components/marketing/ClichePurgeInspector";

interface TwoPanelEditorProps {
  inputTitle?: string;
  outputTitle?: string;
  inputText: string;
  setInputText: (val: string) => void;
  outputText: string;
  isLoading: boolean;
  onAction: () => void;
  actionButtonText: string;
  actionButtonIcon?: React.ReactNode;
  onRegenerate?: () => void;
  onSave?: () => void;
  readingEase?: { score: number; label: string; gradeLevel: string };
  metricsBadge?: string;
  creditsRequired?: number;
  remainingCredits?: number;
  isDemoMode?: boolean;
  childrenControls?: React.ReactNode;
}

export function TwoPanelEditor({
  inputTitle = "Original Text",
  outputTitle = "Humanized Result",
  inputText,
  setInputText,
  outputText,
  isLoading,
  onAction,
  actionButtonText,
  actionButtonIcon = <Sparkles className="w-4 h-4" />,
  onRegenerate,
  onSave,
  readingEase,
  metricsBadge,
  creditsRequired = 1,
  remainingCredits,
  isDemoMode = true,
  childrenControls,
}: TwoPanelEditorProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [diagnosticTab, setDiagnosticTab] = useState<"none" | "waveform" | "cliches">("none");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProviderName = "ManaHumanizeAI Advanced NLP Engine";

  const wordsIn = countWords(inputText);
  const charsIn = countCharacters(inputText);
  const wordsOut = countWords(outputText);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Text is ready to paste anywhere.",
      type: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast({
        title: "Pasted text",
        description: `Imported ${countWords(text)} words from clipboard.`,
        type: "info",
      });
    } catch {
      toast({
        title: "Clipboard Access",
        description: "Please press Ctrl+V or Cmd+V to paste your text.",
        type: "error",
      });
    }
  };

  const handleClear = () => {
    setInputText("");
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `manahumanizeai-export-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "File Downloaded",
      description: "Saved text as a .txt document.",
      type: "success",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 5MB.",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.extractedText) {
        setInputText(data.data.extractedText);
        toast({
          title: "Document Loaded",
          description: `Extracted ${data.data.wordCount} words from ${data.data.fileName}.`,
          type: "success",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: data.error || "Could not parse file.",
          type: "error",
        });
      }
    } catch {
      toast({
        title: "Upload Error",
        description: "Failed to upload document.",
        type: "error",
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Banner with Demo Mode & Credit status */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            {activeProviderName}
          </span>
          {metricsBadge && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
              <Activity className="w-3 h-3 text-emerald-500" />
              {metricsBadge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          {creditsRequired === 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Unlimited Words • No Limits
            </span>
          ) : (
            remainingCredits !== undefined && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Cost: <strong className="text-foreground">{creditsRequired} credits</strong>
                </span>
                <span>•</span>
                <span>
                  Balance: <strong className="text-foreground">{remainingCredits.toLocaleString()}</strong>
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Editor Controls Bar (Modes, Sliders, Tones) */}
      {childrenControls && (
        <div className="p-5 card-pro shadow-sm">
          {childrenControls}
        </div>
      )}

      {/* Split Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Input */}
        <div className="flex flex-col h-[520px] card-pro overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
            <span className="text-xs font-bold tracking-wider text-foreground uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-xs" />
              {inputTitle}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePaste}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                Paste
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border transition-colors"
                title="Upload TXT, DOCX, or PDF"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.docx,.pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
              {inputText && (
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
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
            placeholder="Type, paste your AI-written draft, or upload a document here..."
            className="flex-1 w-full p-5 bg-transparent resize-none focus:outline-none text-sm leading-relaxed placeholder:text-muted-foreground/50"
          />

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-muted/20 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-medium">
              <span className="px-2.5 py-1 rounded-lg bg-background border border-border shadow-xs">{wordsIn} words</span>
              <span className="px-2.5 py-1 rounded-lg bg-background border border-border shadow-xs">{charsIn} chars</span>
            </div>

            <button
              onClick={onAction}
              disabled={isLoading || wordsIn < 2}
              className="btn-primary text-xs disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Transforming...
                </>
              ) : (
                <>
                  {actionButtonIcon}
                  {actionButtonText}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="flex flex-col h-[520px] card-pro overflow-hidden relative">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wide text-foreground/80 uppercase">
                {outputTitle}
              </span>
              {readingEase && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {readingEase.label} ({readingEase.score}/100)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {onRegenerate && outputText && (
                <button
                  onClick={onRegenerate}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Regenerate with same settings"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
              {onSave && outputText && (
                <button
                  onClick={onSave}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 transition-colors"
                  title="Save to History"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleDownload}
                disabled={!outputText}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                title="Download as TXT"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Text Area / Content */}
          <div className="flex-1 p-4 overflow-y-auto relative">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Humanizing and refining syntax...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Balancing sentence cadence, vocabulary variation, and natural voice.
                  </p>
                </div>
              </div>
            ) : outputText ? (
              <div className="text-sm leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/20">
                {outputText}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/60 text-center p-6">
                <Sparkles className="w-8 h-8 mb-2 stroke-[1.5]" />
                <p className="text-sm font-medium">Your enhanced output will appear here.</p>
                <p className="text-xs mt-1 max-w-xs">
                  Paste some AI text on the left and click "{actionButtonText}" to see the transformation.
                </p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>{wordsOut} words</span>
              {wordsIn > 0 && wordsOut > 0 && (
                <>
                  <span>•</span>
                  <span>
                    {wordsOut > wordsIn ? `+${wordsOut - wordsIn}` : `${wordsOut - wordsIn}`} delta
                  </span>
                </>
              )}
            </div>
            {readingEase && (
              <span className="text-muted-foreground text-xs">{readingEase.gradeLevel}</span>
            )}
          </div>
        </div>
      </div>

      {/* Forensic Diagnostic Suite (Waveform & Cliché Purge) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl card-pro bg-card text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              Linguistic Forensic Suite:
            </span>
            <span className="text-muted-foreground hidden sm:inline">
              Inspect rhythm burstiness or verify stripped synthetic buzzwords.
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDiagnosticTab(diagnosticTab === "waveform" ? "none" : "waveform")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                diagnosticTab === "waveform"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Cadence Waveform</span>
              {diagnosticTab === "waveform" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={() => setDiagnosticTab(diagnosticTab === "cliches" ? "none" : "cliches")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                diagnosticTab === "cliches"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileCheck className="w-3 h-3" />
              <span>AI Cliché Shield</span>
              {diagnosticTab === "cliches" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {diagnosticTab === "waveform" && (
          <div className="animate-in fade-in duration-200">
            <CadenceWaveformVisualizer />
          </div>
        )}

        {diagnosticTab === "cliches" && (
          <div className="animate-in fade-in duration-200">
            <ClichePurgeInspector />
          </div>
        )}
      </div>

    </div>
  );
}
