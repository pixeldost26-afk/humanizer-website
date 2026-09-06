export interface HumanizeOptions {
  mode: "Standard" | "Natural" | "Professional" | "Academic" | "Casual" | "Creative";
  preserveMeaning: number; // 1-5
  preserveFormatting: boolean;
  sentenceVariation: number; // 1-5
  vocabularyVariation: number; // 1-5
  tone: string;
}

export interface HumanizeResult {
  originalText: string;
  humanizedText: string;
  originalWordCount: number;
  humanizedWordCount: number;
  readingEase: {
    score: number;
    label: string;
    gradeLevel: string;
  };
  metrics: {
    perplexityEstimate: number;
    burstinessEstimate: number;
    naturalnessScore: number;
  };
  providerUsed: string;
  isDemoMode: boolean;
}

export interface SentenceAnalysis {
  index: number;
  text: string;
  aiProbability: number; // 0 to 100
  label: "Natural / Human" | "Uncertain / Mixed" | "Likely AI-Generated";
  reasons: string[];
}

export interface DetectionResult {
  aiLikelihood: number; // 0 to 100
  humanLikelihood: number; // 0 to 100
  verdict: "Highly Likely Human" | "Mixed / Edited Content" | "Likely AI-Generated";
  confidence: "High" | "Medium" | "Low";
  sentences: SentenceAnalysis[];
  indicators: {
    perplexityScore: number; // 0 to 100
    burstinessScore: number; // 0 to 100
    sentenceLengthVariance: number;
    vocabularyRichness: number;
    repetitionRisk: "Low" | "Moderate" | "High";
  };
  disclaimer: string;
  isDemoMode: boolean;
}

export interface WriteOptions {
  prompt: string;
  contentType: string;
  tone: string;
  length: "short" | "medium" | "long";
  language: string;
  audience: string;
  creativity: number;
}

export interface WriteResult {
  content: string;
  wordCount: number;
  contentType: string;
  suggestedTitles: string[];
  readingTimeMinutes: number;
  providerUsed: string;
  isDemoMode: boolean;
}

export interface ParaphraseOptions {
  mode: "Standard" | "Fluency" | "Formal" | "Simple" | "Creative" | "Academic";
}

export interface ParaphraseResult {
  originalText: string;
  paraphrasedText: string;
  mode: string;
  synonymsReplaced: number;
  providerUsed: string;
  isDemoMode: boolean;
}

export interface GrammarCorrection {
  id: string;
  original: string;
  replacement: string;
  start: number;
  end: number;
  type: "spelling" | "grammar" | "punctuation" | "style" | "clarity";
  explanation: string;
}

export interface GrammarResult {
  originalText: string;
  correctedText: string;
  issuesCount: number;
  corrections: GrammarCorrection[];
  readabilityImprovement: string;
  providerUsed: string;
  isDemoMode: boolean;
}

export interface SummarizeOptions {
  mode: "short" | "medium" | "detailed" | "bullets";
}

export interface SummarizeResult {
  summary: string;
  originalWordCount: number;
  summaryWordCount: number;
  compressionRatio: number; // e.g. 65 means reduced by 65%
  keyTakeaways: string[];
  providerUsed: string;
  isDemoMode: boolean;
}

export interface ToneOptions {
  tone: string;
}

export interface ToneResult {
  originalText: string;
  rewrittenText: string;
  toneApplied: string;
  wordCount: number;
  providerUsed: string;
  isDemoMode: boolean;
}

export interface IAIEngine {
  name: string;
  isDemo: boolean;
  humanizeText(text: string, options: HumanizeOptions): Promise<HumanizeResult>;
  detectAI(text: string): Promise<DetectionResult>;
  generateContent(prompt: string, options: WriteOptions): Promise<WriteResult>;
  paraphraseText(text: string, options: ParaphraseOptions): Promise<ParaphraseResult>;
  checkGrammar(text: string): Promise<GrammarResult>;
  summarizeText(text: string, options: SummarizeOptions): Promise<SummarizeResult>;
  rewriteTone(text: string, options: ToneOptions): Promise<ToneResult>;
}
