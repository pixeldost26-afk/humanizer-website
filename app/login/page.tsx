"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, ArrowRight, Lock, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        toast({ title: "Sign In Failed", description: res.error, type: "error" });
      } else {
        toast({ title: "Welcome back!", type: "success" });
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: demoEmail,
      password: demoPass,
      redirect: false,
    });
    setIsLoading(false);
    if (!res?.error) {
      toast({ title: "Quick Sign In Successful", type: "success" });
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background relative overflow-hidden">
      <div className="glow-orb w-96 h-96 bg-indigo-600/15 -top-20 left-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Humanize<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="text-xs text-muted-foreground">
            Access your tools, saved documents, and writing history.
          </p>
        </div>

        {/* Quick Demo Logins Box */}
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2.5">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
            Instant Demo Access (One-Click):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("user@humanizeai.com", "UserPass123!")}
              className="px-3 py-2 rounded-xl bg-card border border-border hover:border-indigo-500/40 text-xs font-semibold text-foreground shadow-sm transition-all text-center"
            >
              Demo Pro User
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@humanizeai.com", "AdminPass123!")}
              className="px-3 py-2 rounded-xl bg-card border border-border hover:border-rose-500/40 text-xs font-semibold text-rose-600 dark:text-rose-400 shadow-sm transition-all text-center"
            >
              Admin Console
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xl space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-muted-foreground font-medium">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-muted-foreground font-medium">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Social / OAuth ready */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => toast({ title: "Google OAuth", description: "Ready for your client ID in .env.local", type: "info" })}
              className="w-full py-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted text-xs font-semibold text-foreground transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
