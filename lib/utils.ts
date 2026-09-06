import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(text: string): number {
  if (!text || text.trim() === "") return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function countCharacters(text: string): number {
  return text ? text.length : 0;
}

export function countSentences(text: string): number {
  if (!text || text.trim() === "") return 0;
  const matches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  return matches ? matches.length : 1;
}

/**
 * Calculates Flesch-Kincaid Reading Ease score:
 * 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
 * 90-100: Very Easy (5th grade)
 * 60-70: Standard (8th-9th grade)
 * 0-30: Very Difficult (College graduate)
 */
export function calculateReadingEase(text: string): {
  score: number;
  label: string;
  gradeLevel: string;
} {
  const words = countWords(text);
  const sentences = countSentences(text);
  if (words < 3) {
    return { score: 75, label: "Easy to Read", gradeLevel: "Grade 7-8" };
  }

  // Syllable approximation
  const syllables = text
    .toLowerCase()
    .split(/\s+/)
    .reduce((acc, word) => {
      const cleaned = word.replace(/[^a-z]/g, "");
      if (cleaned.length <= 3) return acc + 1;
      const count = (cleaned.match(/[aeiouy]{1,2}/g) || []).length;
      return acc + Math.max(1, count);
    }, 0);

  const wordsPerSentence = words / Math.max(1, sentences);
  const syllablesPerWord = syllables / Math.max(1, words);

  const rawScore = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let label = "Standard";
  let gradeLevel = "Grade 8-9";

  if (score >= 90) {
    label = "Very Easy";
    gradeLevel = "Grade 5";
  } else if (score >= 80) {
    label = "Easy";
    gradeLevel = "Grade 6";
  } else if (score >= 70) {
    label = "Fairly Easy";
    gradeLevel = "Grade 7";
  } else if (score >= 60) {
    label = "Standard";
    gradeLevel = "Grade 8-9";
  } else if (score >= 50) {
    label = "Fairly Difficult";
    gradeLevel = "Grade 10-12";
  } else if (score >= 30) {
    label = "Difficult";
    gradeLevel = "College";
  } else {
    label = "Very Confusing";
    gradeLevel = "Graduate";
  }

  return { score, label, gradeLevel };
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}
