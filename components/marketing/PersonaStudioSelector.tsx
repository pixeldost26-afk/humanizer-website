"use client";

import React, { useState } from "react";
import { UserCheck, Sparkles, BookOpen, Rocket, Feather, Briefcase, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PersonaVoice {
  id: string;
  name: string;
  archetype: string;
  icon: any;
  accentColor: string;
  tone: string;
  sampleBefore: string;
  sampleAfter: string;
  burstinessScore: number;
  complexity: string;
  bestFor: string;
}

const PERSONAS: PersonaVoice[] = [
  {
    id: "scholar",
    name: "Ivy League Scholar",
    archetype: "Academic & Research",
    icon: BookOpen,
    accentColor: "from-blue-600 to-indigo-600",
    tone: "Intellectual, rigorous, measured, zero fluff words",
    sampleBefore:
      "Furthermore, empirical investigations delve into the multifaceted dynamics of economic disparities.",
    sampleAfter:
      "Scholarly research highlights how complex economic gaps can be—showing that institutional factors directly shape lasting financial stability.",
    burstinessScore: 96,
    complexity: "High Nuance",
    bestFor: "Research papers, theses, grant proposals, journal submissions",
  },
  {
    id: "founder",
    name: "Silicon Valley Founder",
    archetype: "Tech & Product",
    icon: Rocket,
    accentColor: "from-purple-600 to-indigo-600",
    tone: "Direct, high-conviction, crisp, active verbs",
    sampleBefore:
      "Implementing this state-of-the-art solution facilitates seamless operational execution across teams.",
    sampleAfter:
      "Adopting this platform lets teams move fast. It clears friction so people actually get real work done.",
    burstinessScore: 92,
    complexity: "Direct & Punchy",
    bestFor: "Pitch decks, tech blogs, product announcements, engineering updates",
  },
  {
    id: "essayist",
    name: "Substack Essayist",
    archetype: "Literary & Culture",
    icon: Feather,
    accentColor: "from-amber-600 to-pink-600",
    tone: "Conversational, vivid cadence, personal warmth",
    sampleBefore:
      "It is crucial to remember that our platform stands as a testament to transformative business optimization.",
    sampleAfter:
      "Here's the honest truth: good tools don't just optimize workflows—they give people their time and sanity back.",
    burstinessScore: 98,
    complexity: "Lyrical Flow",
    bestFor: "Newsletters, personal essays, longform articles, thought leadership",
  },
  {
    id: "executive",
    name: "Fortune 500 Executive",
    archetype: "Boardroom & Strategy",
    icon: Briefcase,
    accentColor: "from-emerald-600 to-teal-600",
    tone: "Decisive, concise, high-signal, outcomes-first",
    sampleBefore:
      "Additionally, organizations must prioritize systemic interventions to mitigate vulnerabilities over time.",
    sampleAfter:
      "Leadership must address these risks immediately before they erode margin and downstream delivery.",
    burstinessScore: 90,
    complexity: "High Signal",
    bestFor: "Executive memos, stakeholder updates, strategic reviews",
  },
];

export function PersonaStudioSelector() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaVoice>(PERSONAS[0]);

  const Icon = selectedPersona.icon;

  return (
    <section className="w-full py-16 sm:py-20 border-t border-border bg-card/40 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 badge-pro shadow-xs">
            <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Authorial Persona Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Don't Just Bypass AI. Find Your Voice.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Standard humanizers only shuffle synonyms. HumanizeAI lets you adopt authentic, curated author personas engineered for your exact audience.
          </p>
        </div>

        {/* Persona Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PERSONAS.map((p) => {
            const PIcon = p.icon;
            const isSelected = selectedPersona.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p)}
                className={`card-pro p-4 text-left space-y-2 transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md -translate-y-0.5"
                    : "hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${p.accentColor} text-white flex items-center justify-center shadow-xs`}
                  >
                    <PIcon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{p.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{p.archetype}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Showcase Card */}
        <div className="card-pro p-6 sm:p-8 space-y-6 bg-card border-primary/20 shadow-lg">
          {/* Persona Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${selectedPersona.accentColor} text-white flex items-center justify-center shadow-md shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{selectedPersona.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedPersona.tone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto text-xs">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                Burstiness: {selectedPersona.burstinessScore}/100
              </span>
              <span className="px-3 py-1 rounded-lg bg-muted text-muted-foreground font-medium border border-border">
                {selectedPersona.complexity}
              </span>
            </div>
          </div>

          {/* Transformation Sample Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 space-y-2">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Raw Robotic Input
              </span>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed italic">
                "{selectedPersona.sampleBefore}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Morphed to {selectedPersona.name}
              </span>
              <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                "{selectedPersona.sampleAfter}"
              </p>
            </div>
          </div>

          {/* Best For Footer & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-muted-foreground">
            <div>
              <strong>Ideal for:</strong> {selectedPersona.bestFor}
            </div>
            <Link
              href="/humanizer"
              prefetch={true}
              className="btn-primary text-xs shrink-0 flex items-center gap-1.5 active:scale-[0.98] transition-all"
            >
              <span>Write with {selectedPersona.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
