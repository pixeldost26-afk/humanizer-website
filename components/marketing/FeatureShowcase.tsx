import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  PenTool,
  Repeat,
  SpellCheck,
  FileText,
  Palette,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card3D } from "@/components/3d/Card3D";

export function FeatureShowcase() {
  const tools = [
    {
      id: "humanizer",
      name: "AI Humanizer",
      tagline: "Rewrite robotic sentences into flowing, human prose",
      description:
        "Removes typical AI markers like 'delve', 'testament', and repetitive sentence rhythms while keeping your original meaning completely intact.",
      href: "/humanizer",
      icon: Sparkles,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      highlights: ["6 Writing Modes", "Sentence Variation Slider", "Flesch-Kincaid Reading Ease"],
    },
    {
      id: "ai-detector",
      name: "Probabilistic AI Detector",
      tagline: "Transparent sentence-level analysis & metric scores",
      description:
        "Provides sentence-by-sentence color highlighting with lexical perplexity and burstiness metrics, supported by ethical probabilistic disclaimers.",
      href: "/ai-detector",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      highlights: ["Sentence-by-sentence Breakdown", "Lexical Perplexity", "Burstiness Metric"],
    },
    {
      id: "ai-writer",
      name: "Structured AI Writer",
      tagline: "10 high-impact formats tailored to your audience",
      description:
        "Draft compelling blog posts, essays, marketing copy, newsletters, and YouTube descriptions with audience, length, and creativity controls.",
      href: "/ai-writer",
      icon: PenTool,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      highlights: ["10 Content Types", "Audience Targeting", "Markdown Export"],
    },
    {
      id: "paraphraser",
      name: "Intelligent Paraphraser",
      tagline: "Rephrase passages with vocabulary depth",
      description:
        "Reframe sentences in Formal, Simple, Creative, or Fluency styles with instant synonym swaps and real-time word comparisons.",
      href: "/paraphraser",
      icon: Repeat,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      highlights: ["Side-by-Side View", "6 Paraphrasing Styles", "Zero Meaning Distortion"],
    },
    {
      id: "grammar",
      name: "Grammar & Style Doctor",
      tagline: "Inline spelling, grammar, and clarity suggestions",
      description:
        "Detect and fix subject-verb agreements, typos, punctuation nuances, and wordy phrasing with one-click individual or bulk accept.",
      href: "/grammar",
      icon: SpellCheck,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      highlights: ["One-click 'Accept All'", "Categorized Error Badges", "Inline Previews"],
    },
    {
      id: "summarizer",
      name: "Executive Summarizer",
      tagline: "Condense long documents into actionable bullets",
      description:
        "Turn lengthy research papers, articles, and meeting notes into concise executive summaries or high-impact bulleted takeaways.",
      href: "/summarizer",
      icon: FileText,
      color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
      highlights: ["Compression Ratio Calculator", "Key Takeaway Extraction", "Bullet Mode"],
    },
    {
      id: "tone",
      name: "Tone Rewriter",
      tagline: "Adapt your message to 9 distinct emotional registers",
      description:
        "Effortlessly transform draft content into Professional, Confident, Friendly, Persuasive, Academic, or Casual tones.",
      href: "/tone",
      icon: Palette,
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
      highlights: ["9 Curated Voices", "Context-Aware Adaptation", "Instant Comparison"],
    },
  ];

  return (
    <section className="w-full py-20 lg:py-28 bg-muted/20 relative overflow-hidden perspective-1200">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20 shadow-sm">
            All-In-One Writing Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Complete Suite for Modern Communicators
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Everything you need to write, evaluate, polish, and publish high-quality content in one
            seamless workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card3D
                key={tool.id}
                className="card-pro p-7 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Clean Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${tool.color} shadow-xs`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary mt-1">
                      {tool.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {tool.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-center gap-2 text-xs text-foreground/85"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border">
                  <Link
                    href={tool.href}
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-secondary hover:bg-primary hover:text-white text-xs font-semibold text-foreground transition-all duration-150 border border-border group"
                  >
                    <span>Launch {tool.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}
