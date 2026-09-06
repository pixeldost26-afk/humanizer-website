import React from "react";
import { ClipboardCheck, Sliders, Sparkles, ArrowRight } from "lucide-react";
import { Card3D } from "@/components/3d/Card3D";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: ClipboardCheck,
      title: "Paste or Upload Your Text",
      description:
        "Input any AI-generated draft, essay, marketing email, or upload TXT, PDF, and DOCX documents directly into our 3D workspace.",
      badge: "Instant Import",
      gradient: "from-indigo-600 to-purple-600",
    },
    {
      step: "02",
      icon: Sliders,
      title: "Choose Style & Cadence Controls",
      description:
        "Select from Natural, Academic, Casual, or Professional modes. Fine-tune sentence variation and vocabulary diversity.",
      badge: "Custom Nuance",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Get Clear, Human-Grade Prose",
      description:
        "Our engine reorganizes robotic syntax, improves reading ease, and delivers polished writing with certified 0% AI detection.",
      badge: "0% AI Detection",
      gradient: "from-pink-600 to-indigo-600",
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-24 lg:py-32 relative perspective-1200 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20 shadow-sm">
            Streamlined Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            How HumanizeAI Works
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Turn mechanical drafts into compelling, authentic writing in three intuitive steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Card3D
                key={item.step}
                className="card-pro p-8 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    {/* Clean Icon Box */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center font-bold text-base shadow-sm`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-muted-foreground/30 select-none">
                      {item.step}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                    {item.badge}
                  </span>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}
