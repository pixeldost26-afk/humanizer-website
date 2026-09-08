import { z } from "zod";

// ==========================================
// Auth Schemas
// ==========================================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(100),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(70),
  email: z.string().email("Please enter a valid email address").max(100),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

// ==========================================
// Tool Schemas (with production bounds)
// ==========================================

export const humanizeRequestSchema = z.object({
  text: z
    .string()
    .min(1, "Please enter text to humanize")
    .max(25000, "Text exceeds the 25,000 character processing limit per request"),
  mode: z
    .enum([
      "Standard",
      "Natural",
      "Professional",
      "Academic",
      "Casual",
      "Creative",
    ])
    .default("Natural"),
  preserveMeaning: z.number().min(1).max(5).default(4),
  preserveFormatting: z.boolean().default(true),
  sentenceVariation: z.number().min(1).max(5).default(4),
  vocabularyVariation: z.number().min(1).max(5).default(3),
  tone: z.string().default("Natural"),
});

export const detectRequestSchema = z.object({
  text: z
    .string()
    .min(5, "Please enter at least 5 characters for analysis")
    .max(30000, "Text exceeds the 30,000 character limit for detection scans"),
});

export const writeRequestSchema = z.object({
  prompt: z
    .string()
    .min(2, "Prompt is required")
    .max(5000, "Prompt cannot exceed 5,000 characters"),
  contentType: z
    .enum([
      "blog",
      "essay",
      "article",
      "email",
      "social",
      "product",
      "marketing",
      "story",
      "youtube",
      "seo",
    ])
    .default("article"),
  tone: z.string().default("Professional"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  language: z.string().default("English (US)"),
  audience: z.string().default("General Audience"),
  creativity: z.number().min(1).max(5).default(3),
});

export const paraphraseRequestSchema = z.object({
  text: z
    .string()
    .min(1, "Please enter text to paraphrase")
    .max(20000, "Text exceeds the 20,000 character paraphrasing limit"),
  mode: z
    .enum([
      "Standard",
      "Fluency",
      "Formal",
      "Simple",
      "Creative",
      "Academic",
    ])
    .default("Standard"),
});

export const grammarRequestSchema = z.object({
  text: z
    .string()
    .min(1, "Please enter text to check")
    .max(30000, "Text exceeds the 30,000 character limit"),
});

export const summarizeRequestSchema = z.object({
  text: z
    .string()
    .min(5, "Please enter text to summarize")
    .max(50000, "Text exceeds the 50,000 character summarization limit"),
  mode: z.enum(["short", "medium", "detailed", "bullets"]).default("medium"),
});

export const toneRequestSchema = z.object({
  text: z
    .string()
    .min(1, "Please enter text to rewrite")
    .max(20000, "Text exceeds the 20,000 character limit"),
  tone: z
    .enum([
      "Professional",
      "Friendly",
      "Casual",
      "Formal",
      "Persuasive",
      "Confident",
      "Academic",
      "Simple",
      "Creative",
    ])
    .default("Professional"),
});

// ==========================================
// Document & Generation Schemas
// ==========================================

export const saveDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  content: z.string().min(1, "Content cannot be empty").max(100000),
  toolType: z.string().default("HUMANIZER"),
  tags: z.string().max(255).optional(),
});

// ==========================================
// User Settings Schemas
// ==========================================

export const updateSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(70).optional(),
  preferredTone: z.string().max(50).optional(),
  preferredStyle: z.string().max(50).optional(),
  preferredLanguage: z.string().max(50).optional(),
  emailAlerts: z.boolean().optional(),
  productUpdates: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  timezone: z.string().max(100).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters").max(128),
});
