import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, Scale, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ManaHumanizeAI",
  description: "Terms and conditions governing the use of ManaHumanizeAI writing and detection tools.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsOfServicePage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Effective Date: {lastUpdated} • ManaHumanizeAI Platform
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm space-y-6 leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or accessing the ManaHumanizeAI web platform, you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-500" />
              2. Permitted and Ethical Use
            </h2>
            <p>
              ManaHumanizeAI provides natural writing assistance, stylistic paraphrasing, grammar enhancement, and statistical linguistic analysis. You agree to use the service ethically:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You may use ManaHumanizeAI to improve the clarity, cadence, and human appeal of your writing.</li>
              <li>You agree not to use the service to generate harmful, defamatory, illegal, or harassing material.</li>
              <li>You remain responsible for reviewing and verifying all AI-generated suggestions before publishing, submitting, or relying on them in academic, legal, or commercial contexts.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-indigo-500" />
              3. AI Detection & Output Disclaimer
            </h2>
            <p>
              AI detection algorithms and linguistic scanners operate probabilistically based on statistical perplexity, burstiness, and syntax templates. ManaHumanizeAI does not guarantee that rewritten text will receive any specific score across third-party algorithmic detectors, as detector algorithms evolve continuously and produce both false positives and false negatives.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              4. User Accounts & Security
            </h2>
            <p>
              You are responsible for safeguarding your account credentials. You agree to notify us immediately of any unauthorized access to your account. We reserve the right to suspend or terminate accounts that engage in automated abuse, credential stuffing, or denial-of-service attempts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">5. Contact and Inquiries</h2>
            <p>
              For legal notices, terms inquiries, or support requests, please contact:
            </p>
            <p className="p-4 rounded-xl bg-card border border-border text-foreground font-mono text-xs">
              Email: pixeldost26@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
