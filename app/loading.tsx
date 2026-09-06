import React from "react";
import { Sparkles } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm relative z-50">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-200">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        </div>
        <div className="text-center space-y-1">
          <div className="text-sm font-semibold tracking-tight text-foreground">
            Loading Workspace...
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            Optimizing syntactical engine
          </div>
        </div>
      </div>
    </div>
  );
}
