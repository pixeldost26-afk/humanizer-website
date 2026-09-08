"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Prefetch login page for instant transition
  useEffect(() => {
    router.prefetch("/login");
  }, [router]);

  // Steps: 1 = Enter Email, 2 = Set New Password, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 1: Verify Account
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "No account found with this email address.");
        toast({
          title: "Account Not Found",
          description: data.error || "Please check the email address or register.",
          type: "error",
        });
        return;
      }

      setUserName(data.user?.name || "User");
      setStep(2);
      toast({
        title: "Account Verified",
        description: `Account found for ${trimmedEmail}. Set your new password below.`,
        type: "success",
      });
    } catch {
      setErrorMessage("Could not connect to the server. Please check your connection.");
      toast({
        title: "Connection Error",
        description: "Failed to verify account. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          email: email.trim(),
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to update password.");
        toast({
          title: "Reset Failed",
          description: data.error || "Could not update password. Try again.",
          type: "error",
        });
        return;
      }

      setStep(3);
      toast({
        title: "Password Updated",
        description: "Your password has been changed. You can now sign in.",
        type: "success",
      });
    } catch {
      setErrorMessage("Network error occurred while resetting password.");
      toast({
        title: "Error",
        description: "Network error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-foreground">ManaHumanizeAI</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {step === 3 ? "Password Reset Complete" : "Reset Your Password"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {step === 1 && "Enter your registered email address to find your account."}
            {step === 2 && `Enter a new secure password for ${email}.`}
            {step === 3 && "Your credentials have been updated successfully."}
          </p>
        </div>

        {/* Card Container */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xl space-y-5 transition-all">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleVerifyEmail} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-xs active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Account...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Continue to Reset</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              {/* Account verified tag */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span className="truncate font-medium">
                    Verified: <strong>{email}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage("");
                  }}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground underline shrink-0 ml-2"
                >
                  Change
                </button>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoFocus
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder="Re-type new password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-xs active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Save New Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Password Changed!</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Your password for <strong>{email}</strong> has been updated securely. You can now log in with your new credentials.
                </p>
              </div>

              <Link
                href="/login"
                prefetch={true}
                className="inline-flex w-full items-center justify-center py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all text-xs active:scale-[0.99]"
              >
                Sign In With New Password
              </Link>
            </div>
          )}

          {/* Footer Back to Login Link */}
          {step !== 3 && (
            <div className="pt-2 text-center border-t border-border">
              <Link
                href="/login"
                prefetch={true}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
