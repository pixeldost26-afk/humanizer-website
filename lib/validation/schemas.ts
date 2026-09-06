import { z } from "zod";

// ==========================================
// Auth Schemas
// ==========================================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ==========================================
// Tool Schemas
// ==========================================

export const humanizeRequestSchema = z.object({
  text: z.string().min(1, "Please enter text to humanize"),
  mode: z.enum([
    "Standard",
    "Natural",
    "Professional",
    "Academic",
    "Casual",
    "Creative",
  ]).default("Natural"),
  preserveMeaning: z.number().min(1).max(5).default(4),
  preserveFormatting: z.boolean().default(true),
  sentenceVariation: z.number().min(1).max(5).default(4),
  vocabularyVariation: z.number().min(1).max(5).default(3),
  tone: z.string().default("Natural"),
});

export const detectRequestSchema = z.object({
  text: z.string().min(5, "Please enter text for analysis"),
});

export const writeRequestSchema = z.object({
  prompt: z.string().min(2, "Prompt is required"),
  contentType: z.enum([
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
  ]).default("article"),
  tone: z.string().default("Professional"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  language: z.string().default("English (US)"),
  audience: z.string().default("General Audience"),
  creativity: z.number().min(1).max(5).default(3),
});

export const paraphraseRequestSchema = z.object({
  text: z.string().min(1, "Please enter text to paraphrase"),
  mode: z.enum([
    "Standard",
    "Fluency",
    "Formal",
    "Simple",
    "Creative",
    "Academic",
  ]).default("Standard"),
});

export const grammarRequestSchema = z.object({
  text: z.string().min(1, "Please enter text to check"),
});

export const summarizeRequestSchema = z.object({
  text: z.string().min(5, "Please enter text to summarize"),
  mode: z.enum(["short", "medium", "detailed", "bullets"]).default("medium"),
});

export const toneRequestSchema = z.object({
  text: z.string().min(1, "Please enter text to rewrite"),
  tone: z.enum([
    "Professional",
    "Friendly",
    "Casual",
    "Formal",
    "Persuasive",
    "Confident",
    "Academic",
    "Simple",
    "Creative",
  ]).default("Professional"),
});

// ==========================================
// Document & Generation Schemas
// ==========================================

export const saveDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  content: z.string().min(1, "Content cannot be empty"),
  toolType: z.string().default("HUMANIZER"),
  tags: z.string().optional(),
});
