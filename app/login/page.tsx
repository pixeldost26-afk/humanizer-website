"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { GoogleIcon } from "@/components/ui/google-icon";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    searchParams.get("error") === "OAuthSignin"
      ? "Could not start Google sign in. Please check Google OAuth settings."
      : searchParams.get("error") === "OAuthCallback"
      ? "Google sign in error during callback. Please try again."
      : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        toast({ title: "Sign In Failed", description: res.error, type: "error" });
      } else {
        toast({ title: "Welcome back!", type: "success" });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage("");
    try {
      await signIn("google", { callbackUrl });
    } catch (err: any) {
      setIsGoogleLoading(false);
      setErrorMessage("Unable to connect with Google right now.");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 relative z-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            ManaHumanize<span className="text-indigo-600 dark:text-indigo-400">AI</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="text-xs text-muted-foreground">
          Access your tools, saved documents, and writing history.
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xl space-y-5">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {searchParams.get("registered") === "true" && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
            Account created successfully! Please enter your password to sign in.
          </div>
        )}

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <GoogleIcon className="w-4 h-4 shrink-0" />
          )}
          <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-card px-2 text-muted-foreground font-semibold">
              Or continue with email
            </span>
          </div>
        </div>

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
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
          </button>

          <p className="text-[11px] text-center text-muted-foreground pt-1 leading-relaxed">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Privacy Policy
            </Link>.
          </p>
        </form>
      </div>


      {/* Footer link */}
      <p className="text-center text-xs text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href={callbackUrl !== "/dashboard" ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/signup"}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background text-foreground relative overflow-hidden">
      <div className="glow-orb w-96 h-96 bg-indigo-600/15 -top-20 left-1/2 -translate-x-1/2" />
      <Suspense fallback={<div className="text-xs text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
