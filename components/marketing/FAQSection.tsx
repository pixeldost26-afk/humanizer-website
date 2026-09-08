"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is ManaHumanizeAI and how does it work?",
      a: "ManaHumanizeAI is an all-in-one platform engineered to transform rigid, robotic AI text into natural, engaging, human-crafted prose. It refactors predictable sentence lengths, strips out overused transition clichés (like 'furthermore' and 'testament to'), and enhances vocabulary cadence while preserving 100% of your facts.",
    },
    {
      q: "Does ManaHumanizeAI guarantee 100% undetectable AI text?",
      a: "No ethical tool can guarantee a 100% bypass because AI detectors are statistical algorithms with changing heuristics that often produce false positives and false negatives. ManaHumanizeAI focuses on genuine literary quality, burstiness, natural rhythm, and readability improvements rather than deceptive promises.",
    },
    {
      q: "How does the AI Detector analyze content?",
      a: "Our AI Detector scans text across multiple probabilistic dimensions: lexical perplexity (predictability of word sequences), burstiness (variation in sentence lengths and clause structures), and synthetic stylistic markers. We provide sentence-by-sentence highlights and transparent confidence metrics.",
    },
    {
      q: "What document formats can I upload?",
      a: "You can upload standard Plain Text (.txt), Markdown (.md), Microsoft Word documents (.docx), and PDF documents (.pdf). Uploaded files are extracted directly into the editor for instant polishing and are not stored permanently unless you save them to your account.",
    },
    {
      q: "Is my content private and secure?",
      a: "Yes. Your text is processed securely with strict encryption standards. We do not use your proprietary documents or drafts to train public AI models. Your saved history is strictly accessible only to your authenticated account.",
    },
    {
      q: "Is ManaHumanizeAI completely free to use with no billing plans?",
      a: "Yes! ManaHumanizeAI is 100% free to use with unlimited words. All features — including the AI Humanizer, AI Detector, AI Writer, Paraphraser, and Grammar Checker — are available without any credit cards, subscriptions, or paywalls.",
    },
  ];

  return (
    <section id="faq" className="w-full py-20 lg:py-28 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Everything you need to know about our tools, detection analysis, and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-card border border-border/80 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-foreground">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                      isOpen && "rotate-180 text-indigo-600 dark:text-indigo-400"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
