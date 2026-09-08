"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TwoPanelEditor } from "@/components/editor/TwoPanelEditor";
import { Sparkles, SlidersHorizontal, Info, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { calculateRequiredCredits } from "@/lib/usage/credit-service";
import { countWords } from "@/lib/utils";

export default function HumanizerPage() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState(
    "Furthermore, utilizing this innovative system facilitates seamless operational synergy. It is crucial to remember that our product stands as a testament to transformative business optimization."
  );
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<
    "Standard" | "Natural" | "Professional" | "Academic" | "Casual" | "Creative"
  >("Natural");
  const [preserveMeaning, setPreserveMeaning] = useState(4);
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [sentenceVariation, setSentenceVariation] = useState(4);
  const [vocabularyVariation, setVocabularyVariation] = useState(3);
  const [tone, setTone] = useState("Natural");

  const [isLoading, setIsLoading] = useState(false);
  const [readingEase, setReadingEase] = useState<{
    score: number;
    label: string;
    gradeLevel: string;
  } | undefined>(undefined);
  const [variantCount, setVariantCount] = useState(0);
  const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined);

  const wordCount = countWords(inputText);
  const requiredCredits = calculateRequiredCredits("HUMANIZER", wordCount);

  const handleHumanize = async () => {
    if (wordCount < 2) {
      toast({
        title: "Text Too Short",
        description: "Please enter at least a few words to humanize.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          mode,
          preserveMeaning,
          preserveFormatting,
          sentenceVariation,
          vocabularyVariation,
          tone,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const nextVariant = variantCount + 1;
        setVariantCount(nextVariant);
        setOutputText(data.data.humanizedText);
        setReadingEase(data.data.readingEase);
        setRemainingCredits(data.data.remainingCredits);
        toast({
          title: nextVariant > 1 ? `Variation #${nextVariant} Generated` : "Humanization Complete",
          description:
            nextVariant > 1
              ? `Created an alternative version with fresh vocabulary and syntactic cadence.`
              : `Processed ${data.data.humanizedWordCount} words with natural cadence.`,
          type: "success",
        });
      } else {
        toast({
          title: "Action Failed",
          description: data.error || "Unable to complete request.",
          type: "error",
        });
      }
    } catch {
      toast({
        title: "Network Error",
        description: "Failed to connect to the server.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!outputText) return;
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Humanized Draft (${new Date().toLocaleDateString()})`,
          content: outputText,
          toolType: "HUMANIZER",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Saved to History",
          description: "Document stored in your account history.",
          type: "success",
        });
      }
    } catch {
      toast({
        title: "Save Failed",
        description: "Could not save document.",
        type: "error",
      });
    }
  };

  const modes = [
    { id: "Natural", label: "Natural", desc: "Best balance for blog posts & general writing" },
    { id: "Standard", label: "Standard", desc: "Clean rewrite maintaining syntax simplicity" },
    { id: "Professional", label: "Professional", desc: "Polished corporate voice for emails & memos" },
    { id: "Academic", label: "Academic", desc: "Formal vocabulary suitable for essays & research" },
    { id: "Casual", label: "Casual", desc: "Friendly conversational tone with contractions" },
    { id: "Creative", label: "Creative", desc: "Engaging phrasing and evocative descriptors" },
  ];

  return (
    <AppShell
      title="AI Humanizer"
      description="Rewrite rigid AI drafts into engaging, authentic human prose."
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <TwoPanelEditor
          inputTitle="AI or Raw Draft Text"
          outputTitle="Humanized Prose"
          inputText={inputText}
          setInputText={setInputText}
          outputText={outputText}
          isLoading={isLoading}
          onAction={handleHumanize}
          actionButtonText="Humanize Text"
          actionButtonIcon={<Sparkles className="w-4 h-4" />}
          onRegenerate={handleHumanize}
          onSave={handleSaveToHistory}
          readingEase={readingEase}
          metricsBadge={variantCount > 1 ? `Variation #${variantCount}` : undefined}
          creditsRequired={requiredCredits}
          remainingCredits={remainingCredits}
          childrenControls={
            <div className="space-y-4">
              {/* Humanization Modes Selector */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Humanization Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as any)}
                      className={`p-3 rounded-xl text-left transition-all border ${
                        mode === m.id
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="text-xs font-semibold">{m.label}</div>
                      <div className="text-[10px] opacity-80 line-clamp-1 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders and Toggles Bar */}
              <div className="pt-2 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preserve Meaning:</span>
                    <span className="font-semibold text-foreground">{preserveMeaning}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={preserveMeaning}
                    onChange={(e) => setPreserveMeaning(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sentence Rhythm Variation:</span>
                    <span className="font-semibold text-foreground">{sentenceVariation}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sentenceVariation}
                    onChange={(e) => setSentenceVariation(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vocabulary Diversity:</span>
                    <span className="font-semibold text-foreground">{vocabularyVariation}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={vocabularyVariation}
                    onChange={(e) => setVocabularyVariation(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>
          }
        />

        {/* Responsible Usage Disclosure */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border/80 text-xs text-muted-foreground">
          <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Ethical Positioning:</strong> ManaHumanizeAI focuses on improving naturalness,
            fluency, syntactic rhythm, and readability. We do not claim or guarantee that text will
            bypass every third-party AI detector, as detector heuristics are probabilistic and prone
            to false readings.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
