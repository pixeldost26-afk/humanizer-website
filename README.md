# HumanizeAI — All-in-One AI Writing, Detection & Humanization Platform

**Make AI writing sound naturally yours.**

HumanizeAI is a full-stack, production-quality SaaS web application engineered to transform robotic AI text into clear, natural, engaging writing while preserving 100% of the original meaning.

---

## Key Features

1. **AI Humanizer (`/humanizer`)**:
   - 6 Nuanced Writing Modes: *Standard, Natural, Professional, Academic, Casual, Creative*.
   - Fine-tuning sliders: *Preserve Meaning, Sentence Variation, Vocabulary Diversity*.
   - Live Flesch-Kincaid Reading Ease score and word count delta.
   - Dual-screen editor with paste, clear, document upload, and export.

2. **Probabilistic AI Detector (`/ai-detector`)**:
   - Circular visual gauge with AI Likelihood % and Human Likelihood %.
   - Sentence-by-sentence color-coded highlights with interactive reason inspector.
   - Lexical Perplexity and Sentence Burstiness indicators.
   - Transparent ethical disclaimer badge.

3. **Structured AI Writer (`/ai-writer`)**:
   - 10 Content Formats: *Blog post, Academic Essay, In-depth Article, Business Email, Social Post, Product Description, Marketing Copy, Creative Story, YouTube Script, SEO Content*.
   - Controls for tone, audience, length, and creativity.

4. **Intelligent Paraphraser (`/paraphraser`)**:
   - 6 Paraphrase styles: *Standard, Fluency, Formal, Simple, Creative, Academic*.
   - Side-by-side comparison with real-time synonym swaps.

5. **Grammar & Clarity Checker (`/grammar`)**:
   - Inline underlines for spelling, subject-verb agreements, punctuation, and clarity.
   - One-click *Accept All Fixes* and individual suggestion inspector.

6. **Executive Summarizer (`/summarizer`)**:
   - Condense long documents into *Key Bullet Points, Short Summary, Balanced, or Detailed*.
   - Compression ratio percentage calculator.

7. **Tone Rewriter (`/tone`)**:
   - Adapt draft content across 9 voices: *Professional, Friendly, Casual, Formal, Persuasive, Confident, Academic, Simple, Creative*.

8. **Document Uploads & History (`/history`)**:
   - Support for `.txt`, `.docx`, `.pdf`, and `.md` documents.
   - Searchable, filterable document vault with duplicate, rename, preview modal, and delete.

9. **Billing & Usage Quotas (`/billing` & `/pricing`)**:
   - 3 Configurable Tiers: Free Starter (1,000 words), Pro (50,000 words), Business (250,000 words).
   - Dual payment architecture: Stripe Subscriptions & Customer Portal + Razorpay order architecture for India.

10. **Admin Super Console (`/admin`)**:
    - System KPIs: Users, estimated MRR, token volume, error rate.
    - Recharts bar graphs and execution logs.
    - User directory with plan modification and credit top-ups.

---

## Technology Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS, CSS variables for theming (Light / Dark / System), Lucide React
- **Database & ORM**: Prisma ORM with SQLite (local zero-config) and PostgreSQL (production ready)
- **Authentication**: NextAuth.js JWT session architecture with credential provider and OAuth readiness
- **AI Abstraction**: Multi-engine provider (`OpenAICompatibleProvider` & `DemoMockProvider`)
- **Payments**: Stripe Checkout & Portal + Razorpay integration
- **Charts**: Recharts

---

## Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Sync & Seed
```bash
npx prisma db push
node scripts/seed.mjs
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Pre-Seeded Test Credentials

| Role | Email | Password | Pre-loaded Plan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@humanizeai.com` | `AdminPass123!` | Business Plan (250,000 credits) |
| **User** | `user@humanizeai.com` | `UserPass123!` | Pro Plan (50,000 credits) |

*You can also click the quick-login buttons on the `/login` page for instant access.*

---

## Switching to Live AI Providers

In `.env.local`:
```env
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
# Or use Groq, Together AI, Ollama, DeepSeek by changing OPENAI_BASE_URL:
# OPENAI_BASE_URL="https://api.groq.com/openai/v1"
```

When `OPENAI_API_KEY` is not provided, HumanizeAI automatically runs in high-fidelity **Demo Mode** using deterministic linguistic heuristics.
