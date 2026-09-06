"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Sun, Moon, Laptop, User, Palette } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <AppShell
      title="Settings & Preferences"
      description="Manage your profile and interface theme preferences."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Details Card */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            <h3 className="text-base font-bold text-foreground">User Profile</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-muted-foreground font-medium">Full Name</label>
              <input
                type="text"
                disabled
                value={session?.user?.name || "Alex Johnson"}
                className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-medium">Email Address</label>
              <input
                type="email"
                disabled
                value={session?.user?.email || "user@humanizeai.com"}
                className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-500" />
            <div>
              <h3 className="text-base font-bold text-foreground">Appearance & Theme</h3>
              <p className="text-xs text-muted-foreground">
                Choose your interface color mode. System mode aligns with your OS preference.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Laptop },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
