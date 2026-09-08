"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TwoPanelEditor } from "@/components/editor/TwoPanelEditor";
import { Palette } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function ToneRewriterPage() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState(
    "We need to discuss the upcoming project deliverables and make sure everyone is ready for the deadline next Monday."
  );
  const [outputText, setOutputText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [isLoading, setIsLoading] = useState(false);

  const tones = [
    { id: "Professional", label: "Professional", desc: "Polished and executive" },
    { id: "Friendly", label: "Friendly", desc: "Warm and inviting" },
    { id: "Casual", label: "Casual", desc: "Relaxed and conversational" },
    { id: "Formal", label: "Formal", desc: "Rigorous and ceremonial" },
    { id: "Persuasive", label: "Persuasive", desc: "Compelling call to action" },
    { id: "Confident", label: "Confident", desc: "Assertive and decisive" },
    { id: "Academic", label: "Academic", desc: "Scholarly and analytical" },
    { id: "Simple", label: "Simple", desc: "Plain language, easy to read" },
    { id: "Creative", label: "Creative", desc: "Vivid and poetic imagery" },
  ];

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/tone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, tone }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOutputText(data.data.rewrittenText);
        toast({
          title: "Tone Shifted",
          description: `Adapted text into ${tone} voice.`,
          type: "success",
        });
      } else {
        toast({
          title: "Tone Rewrite Notice",
          description: data.error || "Unable to rewrite tone. Please try again.",
          type: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Tone rewrite failed",
        description: err?.message || "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell
      title="Tone Rewriter"
      description="Adapt your message across 9 distinct communication styles and emotional registers."
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <TwoPanelEditor
          inputTitle="Draft Message"
          outputTitle={`${tone} Tone Result`}
          inputText={inputText}
          setInputText={setInputText}
          outputText={outputText}
          isLoading={isLoading}
          onAction={handleRewrite}
          actionButtonText={`Rewrite as ${tone}`}
          actionButtonIcon={<Palette className="w-4 h-4" />}
          onRegenerate={handleRewrite}
          childrenControls={
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Select Desired Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      tone === t.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-muted/40 border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="text-xs font-bold">{t.label}</div>
                    <div className="text-[10px] opacity-75 line-clamp-1 mt-0.5">{t.desc}</div>
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
