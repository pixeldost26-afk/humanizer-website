"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TwoPanelEditor } from "@/components/editor/TwoPanelEditor";
import { Repeat } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function ParaphraserPage() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState(
    "It is important to understand that difficult problems often require quick action and innovative thinking to improve the overall outcome."
  );
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<
    "Standard" | "Fluency" | "Formal" | "Simple" | "Creative" | "Academic"
  >("Standard");
  const [isLoading, setIsLoading] = useState(false);

  const modes = [
    { id: "Standard", label: "Standard", desc: "Balanced rephrasing" },
    { id: "Fluency", label: "Fluency", desc: "Improves readability & flow" },
    { id: "Formal", label: "Formal", desc: "Elevates tone for business & academia" },
    { id: "Simple", label: "Simple", desc: "Clear, concise, everyday terms" },
    { id: "Creative", label: "Creative", desc: "Expressive & varied wording" },
    { id: "Academic", label: "Academic", desc: "Scholarly vocabulary" },
  ];

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/paraphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, mode }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOutputText(data.data.paraphrasedText);
        toast({
          title: "Paraphrased Successfully",
          description: `Rewritten in ${mode} style.`,
          type: "success",
        });
      } else {
        toast({
          title: "Paraphrase Notice",
          description: data.error || "Unable to paraphrase text. Please try again.",
          type: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Paraphrase Failed",
        description: err?.message || "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell
      title="Paraphraser"
      description="Rephrase sentences with fluent vocabulary and diverse syntactic variations."
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <TwoPanelEditor
          inputTitle="Original Passage"
          outputTitle="Paraphrased Version"
          inputText={inputText}
          setInputText={setInputText}
          outputText={outputText}
          isLoading={isLoading}
          onAction={handleParaphrase}
          actionButtonText="Paraphrase Text"
          actionButtonIcon={<Repeat className="w-4 h-4" />}
          onRegenerate={handleParaphrase}
          childrenControls={
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Paraphrasing Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
