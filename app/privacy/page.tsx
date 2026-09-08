import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, Eye, Database, Server, RefreshCw } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ManaHumanizeAI",
  description: "Learn how ManaHumanizeAI collects, protects, and handles your data and writing content.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 8, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="space-y-3 border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold border border-indigo-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Transparency & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Last Updated: {lastUpdated} • ManaHumanizeAI ("we", "our", or "us")
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm space-y-6 leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              1. Information We Collect
            </h2>
            <p>
              When you use ManaHumanizeAI, we collect minimal information necessary to deliver and improve our writing assistant tools:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">Account Information:</strong> When you register, we collect your name and email address. Passwords are cryptographically hashed using standard bcrypt algorithms before being stored; we never store plain-text passwords.
              </li>
              <li>
                <strong className="text-foreground">User Content:</strong> Text and documents you submit to our AI Humanizer, Content Detector, Paraphraser, Summarizer, or Grammar Checker. We process text in real-time to generate your output.
              </li>
              <li>
                <strong className="text-foreground">Usage Analytics:</strong> Anonymized metrics such as word counts processed, tool request durations, and quota consumption to maintain platform performance and fair usage limits.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              2. How We Protect Your Data
            </h2>
            <p>
              We implement comprehensive security measures to safeguard your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All web traffic is transmitted via modern HTTPS with Transport Layer Security (TLS 1.3).</li>
              <li>User passwords are protected with salted bcrypt password hashing.</li>
              <li>Strict role-based authentication and document-level scoping ensure users can only access their own stored documents.</li>
              <li>We do not sell, rent, or monetize your submitted writing or personal contact information to any third parties or data brokers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" />
              3. AI Processing & Third-Party APIs
            </h2>
            <p>
              When you request content transformations, text prompts are transmitted securely via encrypted APIs to AI model endpoints (such as OpenAI or Groq) strictly for the purpose of executing the requested transformation. We do not use your private personal documents to train public foundation models without your express authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" />
              4. Data Portability & Deletion Rights (GDPR / CCPA)
            </h2>
            <p>
              You maintain full ownership of your data at all times:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">Export Data:</strong> You can download a complete archive of your profile, preferences, and saved documents in JSON format directly from your Settings dashboard at any time.
              </li>
              <li>
                <strong className="text-foreground">Delete Account:</strong> You have the right to permanently purge your account, all associated documents, and usage records via the Settings dashboard.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-500" />
              5. Contact Information
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact our privacy compliance team directly at:
            </p>
            <p className="p-4 rounded-xl bg-card border border-border text-foreground font-mono text-xs">
              Direct Contact: pixeldost26@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
