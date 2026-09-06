import React from "react";
import { Globe } from "lucide-react";

export function SupportedLanguages() {
  const languages = [
    { name: "English (US)", flag: "🇺🇸" },
    { name: "English (UK)", flag: "🇬🇧" },
    { name: "Spanish", flag: "🇪🇸" },
    { name: "French", flag: "🇫🇷" },
    { name: "German", flag: "🇩🇪" },
    { name: "Portuguese", flag: "🇧🇷" },
    { name: "Italian", flag: "🇮🇹" },
    { name: "Dutch", flag: "🇳🇱" },
    { name: "Japanese", flag: "🇯🇵" },
    { name: "Hindi", flag: "🇮🇳" },
    { name: "Korean", flag: "🇰🇷" },
    { name: "Arabic", flag: "🇸🇦" },
    { name: "Swedish", flag: "🇸🇪" },
    { name: "Polish", flag: "🇵🇱" },
    { name: "Turkish", flag: "🇹🇷" },
    { name: "Indonesian", flag: "🇮🇩" },
  ];

  return (
    <section className="w-full py-16 border-y border-border/40 bg-card/60">
      <div className="container mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          Global Multilingual Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Flawless Natural Phrasing in 50+ Languages
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          HumanizeAI respects cultural idioms, localized grammatical cadences, and nuanced
          vocabulary across global linguistic variations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto pt-4">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="card-pro px-3.5 py-2 rounded-xl text-xs font-medium text-foreground cursor-default transition-colors hover:border-primary/50 flex items-center gap-2"
            >
              <span className="text-sm">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          ))}
          <span className="text-xs font-medium text-primary px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20">
            + 38 more languages
          </span>
        </div>
      </div>
    </section>
  );
}
