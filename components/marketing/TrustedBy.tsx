import React from "react";

export function TrustedBy() {
  const brands = [
    { name: "Academic Research Labs", icon: "🏛️" },
    { name: "NexGen Publishing", icon: "📚" },
    { name: "Substack Authors", icon: "✍️" },
    { name: "Veritas AI Review", icon: "🔬" },
    { name: "Nordic Writers Guild", icon: "🖋️" },
    { name: "Global EduTech", icon: "🎓" },
  ];

  return (
    <section className="w-full py-10 border-y border-border/60 bg-muted/20">
      <div className="container mx-auto px-4 text-center space-y-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Trusted by over 120,000+ authors, researchers, students, and content teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-card border border-border/80 text-xs sm:text-sm font-bold text-foreground/80 shadow-sm hover:border-indigo-500/40 hover:text-foreground transition-all duration-200"
            >
              <span>{brand.icon}</span>
              <span>{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
