"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Mail,
  User,
  MessageSquare,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Anti-bot honeypot
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to submit inquiry. Please try again.");
        return;
      }

      setIsSubmitted(true);
      toast({
        title: "Message Dispatched",
        description: "Your inquiry has been received by ManaHumanizeAI support.",
        type: "success",
      });
    } catch {
      setErrorMessage("Network error occurred. Please reach out to pixeldost26@gmail.com directly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-indigo-500/20">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ManaHumanizeAI Support & Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Contact Our Team
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Have questions regarding our AI Humanizer, linguistic detection heuristics, privacy practices,
              or enterprise inquiries? We are here to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Direct Channels Column */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Official Inquiries
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For privacy notices, security disclosures, academic licensing, or support:
                </p>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 font-mono text-xs text-foreground select-all break-all">
                  pixeldost26@gmail.com
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Response Window
                </div>
                <p className="text-xs text-muted-foreground">
                  Our compliance and engineering teams typically review and respond to inquiries within 24 business hours.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  Privacy & Data Safety
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Messages submitted through this channel are encrypted in transit and handled strictly in accordance with our{" "}
                  <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-2">
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-xl space-y-6">
                {isSubmitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Message Dispatched</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out to <strong>ManaHumanizeAI</strong>. Your message has been safely delivered to our support desk. We will review your submission and reply to <strong>{email}</strong> shortly.
                    </p>
                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setSubject("");
                          setMessage("");
                        }}
                        className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-all"
                      >
                        Send Another Inquiry
                      </button>
                      <Link
                        href="/"
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
                      >
                        Return to Platform
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                        {errorMessage}
                      </div>
                    )}

                    {/* Anti-spam honeypot hidden field */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="contact-hp">Leave empty</label>
                      <input
                        id="contact-hp"
                        type="text"
                        name="honeypot"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="contact-name" className="text-muted-foreground font-medium">
                          Your Full Name <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Alex Johnson"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="contact-email" className="text-muted-foreground font-medium">
                          Email Address <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@company.com"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-subject" className="text-muted-foreground font-medium">
                        Subject <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <HelpCircle className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                        <input
                          id="contact-subject"
                          name="subject"
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="How can ManaHumanizeAI help you?"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-message" className="text-muted-foreground font-medium">
                        Message <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Provide details regarding your inquiry, platform feedback, or support request..."
                          className="w-full p-3 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500 resize-y"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message to ManaHumanizeAI</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-muted-foreground pt-1">
                      By submitting, you agree to our{" "}
                      <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        Privacy Policy
                      </Link>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
