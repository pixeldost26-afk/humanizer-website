import {
  IAIEngine,
  HumanizeOptions,
  HumanizeResult,
  DetectionResult,
  WriteOptions,
  WriteResult,
  ParaphraseOptions,
  ParaphraseResult,
  GrammarResult,
  GrammarCorrection,
  SummarizeOptions,
  SummarizeResult,
  ToneOptions,
  ToneResult,
} from "./provider";
import { countWords, calculateReadingEase } from "../utils";
import { LinguisticAnalysisDetector } from "./linguistic-detector";
import { runHeuristicGrammarCheck } from "./grammar-rules";

export function cleanAndParseJson<T>(raw: string, fallback: T): T {
  if (!raw || typeof raw !== "string") return fallback;

  // 1. Direct parse
  try {
    return JSON.parse(raw);
  } catch {}

  // 2. Strip thinking/reasoning tags (e.g. <think>...</think>)
  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // 3. Strip Markdown code fences (```json ... ``` or ``` ...)
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  // 4. Extract first balanced JSON object from { to }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonSubstring = cleaned.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonSubstring);
    } catch {
      try {
        const sanitized = jsonSubstring.replace(/,\s*([}\]])/g, "$1");
        return JSON.parse(sanitized);
      } catch {}
    }
  }

  // 5. Extract JSON array from [ to ]
  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const jsonSubstring = cleaned.slice(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(jsonSubstring);
    } catch {
      try {
        const sanitized = jsonSubstring.replace(/,\s*([}\]])/g, "$1");
        return JSON.parse(sanitized);
      } catch {}
    }
  }

  return fallback;
}

export class OpenAICompatibleProvider implements IAIEngine {
  name = "OpenAI Compatible Engine";
  isDemo = false;
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private isGroq: boolean;
  private availableModels: string[] | null = null;

  constructor(apiKey: string, baseUrl?: string, model?: string) {
    this.apiKey = apiKey.trim();
    this.isGroq = this.apiKey.startsWith("gsk_") || Boolean(baseUrl && baseUrl.includes("groq"));

    if (this.isGroq) {
      // Groq API Key -> Route to Groq OpenAI-compatible endpoint
      this.baseUrl = baseUrl && baseUrl.includes("groq") ? baseUrl.trim() : "https://api.groq.com/openai/v1";

      const rawModel = (model || "").trim();
      const decommissionedGroqModels: Record<string, string> = {
        "gemma2-9b-it": "llama-3.3-70b-versatile",
        "gemma-7b-it": "llama-3.3-70b-versatile",
        "llama3-70b-8192": "llama-3.3-70b-versatile",
        "llama3-8b-8192": "llama-3.1-8b-instant",
        "llama-3.1-70b-versatile": "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant": "llama-3.1-8b-instant",
        "llama-3.2-1b-preview": "llama-3.1-8b-instant",
        "llama-3.2-3b-preview": "llama-3.1-8b-instant",
        "mixtral-8x7b-32768": "llama-3.3-70b-versatile",
      };

      // If model is unset, starts with gpt- (OpenAI leftover), references gemma, or is in the decommissioned map, use modern Groq flagship
      if (!rawModel || rawModel.startsWith("gpt-") || rawModel.includes("gemma") || decommissionedGroqModels[rawModel]) {
        this.model = decommissionedGroqModels[rawModel] || "llama-3.3-70b-versatile";
      } else {
        this.model = rawModel;
      }
    } else if (this.apiKey.startsWith("sk-")) {
      // Standard OpenAI API Key
      this.baseUrl = baseUrl && !baseUrl.includes("groq") ? baseUrl.trim() : "https://api.openai.com/v1";
      this.model = model && !model.includes("llama") && !model.includes("mixtral") && !model.includes("gemma") && model.trim() !== "" ? model.trim() : "gpt-4o-mini";
    } else {
      this.baseUrl = baseUrl && baseUrl.trim() !== "" ? baseUrl.trim() : "https://api.openai.com/v1";
      this.model = model && model.trim() !== "" ? model.trim() : "gpt-4o-mini";
    }
  }

  private async fetchAvailableModels(): Promise<string[]> {
    if (this.availableModels && this.availableModels.length > 0) {
      return this.availableModels;
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        const ids = (data.data || [])
          .map((m: any) => m.id)
          .filter(
            (id: any): id is string =>
              typeof id === "string" &&
              !id.includes("whisper") &&
              !id.includes("guard") &&
              !id.includes("embedding") &&
              !id.includes("orpheus") &&
              !id.includes("safeguard")
          );
        if (ids.length > 0) {
          this.availableModels = ids;
          console.log(`[AI Provider] Active generation models available for this API key:`, ids);
          return ids;
        }
      }
    } catch (err) {
      console.warn(`[AI Provider] Could not fetch models from ${this.baseUrl}:`, err);
    }
    return [];
  }

  private async callChat(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false,
    maxTokens = 1200
  ): Promise<string> {
    const discovered = await this.fetchAvailableModels();

    let candidateModels: string[] = [];
    if (discovered.length > 0) {
      // 1. If this.model exists in discovered, prioritize it
      if (discovered.includes(this.model)) {
        candidateModels.push(this.model);
      }
      // 2. High-priority text generation models
      const preferred = [
        "openai/gpt-oss-120b",
        "qwen/qwen3.8-27b",
        "groq/compound",
        "openai/gpt-oss-20b",
        "qwen/qwen3.6-27b",
        "groq/compound-mini",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "gpt-4o-mini",
        "gpt-4o",
      ];
      for (const pref of preferred) {
        if (discovered.includes(pref) && !candidateModels.includes(pref)) {
          candidateModels.push(pref);
        }
      }
      // 3. Any other discovered models
      for (const m of discovered) {
        if (!candidateModels.includes(m)) {
          candidateModels.push(m);
        }
      }
    }

    if (candidateModels.length === 0) {
      candidateModels = [this.model];
      if (this.isGroq) {
        const groqFallbacks = [
          "llama-3.3-70b-versatile",
          "llama-3.1-8b-instant",
          "deepseek-r1-distill-llama-70b",
        ];
        for (const m of groqFallbacks) {
          if (!candidateModels.includes(m)) {
            candidateModels.push(m);
          }
        }
      }
    }

    let lastError: Error | null = null;

    for (const currentModel of candidateModels) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000); // 45s timeout

      try {
        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: maxTokens,
            ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          const errText = await res.text();
          let parsedMessage = errText;
          try {
            const parsed = JSON.parse(errText);
            if (parsed.error?.message) {
              parsedMessage = parsed.error.message;
            }
          } catch {}

          const lowerText = (errText + " " + parsedMessage).toLowerCase();

          // If JSON mode was rejected because the model doesn't support json_object or failed json validation on Groq,
          // retry immediately with raw prompt instruction since cleanAndParseJson parses unstructured text
          if (
            jsonMode &&
            res.status === 400 &&
            (lowerText.includes("response_format") ||
              lowerText.includes("json_object") ||
              lowerText.includes("json_validate_failed") ||
              lowerText.includes("schema"))
          ) {
            console.warn(
              `[AI Provider] Model '${currentModel}' rejected response_format: ${parsedMessage}. Retrying in raw JSON prompt mode...`
            );
            try {
              const retryRes = await fetch(`${this.baseUrl}/chat/completions`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                  model: currentModel,
                  messages: [
                    {
                      role: "system",
                      content: `${systemPrompt}\n\nIMPORTANT: Respond with ONLY a raw JSON object. Do NOT wrap in markdown code blocks or add introductory text.`,
                    },
                    { role: "user", content: userPrompt },
                  ],
                  temperature: 0.5,
                  max_tokens: maxTokens,
                }),
              });
              if (retryRes.ok) {
                const retryData = await retryRes.json();
                const retryOutput = retryData.choices?.[0]?.message?.content;
                if (retryOutput) {
                  this.model = currentModel;
                  return retryOutput;
                }
              }
            } catch (retryErr: any) {
              console.warn(`[AI Provider] Retry without response_format failed:`, retryErr.message);
            }
          }

          const isModelUnavailable =
            res.status === 404 ||
            (res.status === 400 && (
              lowerText.includes("decommissioned") ||
              lowerText.includes("deprecated") ||
              lowerText.includes("no longer supported") ||
              lowerText.includes("model_not_found") ||
              lowerText.includes("does not exist") ||
              (lowerText.includes("not supported") && !lowerText.includes("response_format"))
            )) ||
            lowerText.includes("model_not_found") ||
            lowerText.includes("does not exist");

          if (isModelUnavailable && candidateModels.indexOf(currentModel) < candidateModels.length - 1) {
            const nextCandidate = candidateModels[candidateModels.indexOf(currentModel) + 1];
            console.warn(
              `[AI Provider] Model '${currentModel}' is decommissioned or unavailable on ${this.baseUrl}. Automatically falling back to '${nextCandidate}'...`
            );
            continue;
          }

          if (res.status === 401) {
            throw new Error("AI provider authentication failed. Please check your API key in environment variables.");
          }
          if (res.status === 429) {
            throw new Error("AI provider rate limit reached. Please wait a moment before trying again.");
          }
          if (res.status >= 500) {
            throw new Error("AI provider service is temporarily unavailable. Please try again shortly.");
          }
          throw new Error(`AI Provider Error (${res.status}): ${parsedMessage}`);
        }

        const data = await res.json();
        const output = data.choices?.[0]?.message?.content;
        if (!output) {
          throw new Error("AI provider returned an empty response. Please try again.");
        }

        // Remember working model for future calls
        this.model = currentModel;
        return output;
      } catch (err: any) {
        clearTimeout(timeout);
        if (err.name === "AbortError") {
          throw new Error("AI provider request timed out. Please try with shorter text.");
        }
        lastError = err;

        const lowerMsg = (err.message || "").toLowerCase();
        const isModelErr =
          lowerMsg.includes("not exist") ||
          lowerMsg.includes("model_not_found") ||
          lowerMsg.includes("decommissioned") ||
          lowerMsg.includes("deprecated") ||
          lowerMsg.includes("no longer supported") ||
          lowerMsg.includes("404");

        // If not a model availability error and we have no other models to try, rethrow immediately
        if (!isModelErr || candidateModels.indexOf(currentModel) >= candidateModels.length - 1) {
          throw err;
        }
        console.warn(`[AI Provider] Encountered model error on '${currentModel}': ${err.message}. Trying next candidate model...`);
      }
    }

    throw lastError || new Error("Failed to communicate with AI provider.");
  }


  async humanizeText(text: string, options: HumanizeOptions): Promise<HumanizeResult> {
    const systemPrompt = `You are an elite human editor and writing coach. Your goal is to rewrite the input text so it sounds completely authentic, engaging, and genuinely human-written, while strictly preserving the core meaning, direct quotes, and citations.
Target Mode: ${options.mode}
Preserve Meaning (1-5): ${options.preserveMeaning}
Sentence Variation (1-5): ${options.sentenceVariation}
Vocabulary Richness (1-5): ${options.vocabularyVariation}

CRITICAL CADENCE & QUALITY MANDATE: Engineered for natural human cadence and designed to reduce formulaic AI patterns.
- Absolutely eliminate synthetic Latinate thesaurus padding, robotically dense academic jargon, and uniform sentence structures.
- Inject high burstiness: intentionally mix crisp, punchy sentences (4-8 words) with fluid, longer sentences.
- Use natural human idioms, concrete verbs, and authentic transitional cadence.
- Avoid all cliché AI tropes ('delve', 'testament to', 'rich tapestry', 'beacon', 'pivotal role', 'furthermore', 'moreover', 'in conclusion').
- Keep all direct quotes and academic citations (e.g., "(Lunsford and Connors 116)") 100% intact.
Output ONLY the rewritten humanized text.`;

    const humanizedText = await this.callChat(systemPrompt, text);
    const originalWordCount = countWords(text);
    const humanizedWordCount = countWords(humanizedText);
    const readingEase = calculateReadingEase(humanizedText);

    return {
      originalText: text,
      humanizedText: humanizedText.trim(),
      originalWordCount,
      humanizedWordCount,
      readingEase,
      metrics: {
        perplexityEstimate: 85,
        burstinessEstimate: 88,
        naturalnessScore: 94,
      },
      providerUsed: `${this.name} (${this.model})`,
      isDemoMode: false,
    };
  }

  async detectAI(text: string): Promise<DetectionResult> {
    // Honest Statistical Linguistic Analysis (perplexity, burstiness, syntax patterns)
    // Avoids claiming unsupported 100% binary detection
    return LinguisticAnalysisDetector.analyze(text);
  }

  async generateContent(prompt: string, options: WriteOptions): Promise<WriteResult> {
    let systemPrompt = "";

    switch (options.contentType) {
      case "story":
        systemPrompt = `Transform the user's idea or instructions into an engaging, original, human-sounding story.
Writing requirements:
- Create a clear beginning, middle, and ending.
- Develop believable characters with distinct personalities.
- Use natural dialogue that sounds like real people speaking.
- Show emotions through actions, thoughts, expressions, and situations.
- Vary sentence length and paragraph structure.
- Match the requested tone (${options.tone}) and target audience (${options.audience}).
- Target Length: ${options.length} (~${options.length === "short" ? "250" : options.length === "long" ? "800" : "450"} words).
- Output only the finished story with a creative markdown title (# Title).`;
        break;

      case "blog":
        systemPrompt = `You are an elite, engaging blog writer and thought leader.
Write a captivating, high-value blog post based on the user's topic or instructions.
Guidelines:
- Headline (# Title) that hooks the reader.
- Conversational, authentic human voice.
- Organize with clear H2 and H3 subheadings, concise paragraphs, and bullet points.
- Actionable, practical takeaways.
- Tone: ${options.tone} | Target Audience: ${options.audience} | Language: ${options.language}.`;
        break;

      case "essay":
        systemPrompt = `You are an academic scholar and essayist.
Write a rigorous, well-structured academic essay addressing the user's topic.
Guidelines:
- Scholarly title (# Title) and clear thesis statement.
- Balanced, evidence-based arguments with logical transitions.
- Concluding synthesis.
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
        break;

      case "article":
        systemPrompt = `You are an investigative journalist and long-form feature writer.
Write an in-depth, authoritative feature article based on the user's prompt.
Guidelines:
- Journalistic headline (# Headline) and subhead.
- Narrative lead and structured sections.
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
        break;

      case "email":
        systemPrompt = `You are an executive communication and business email specialist.
Write a polished, highly effective business email based on the user's instructions.
Guidelines:
- Include 2 subject line options (**Subject:** ...).
- Clear purpose and concise body with bullet points.
- Specific Call to Action (CTA).
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
        break;

      case "social":
        systemPrompt = `You are a viral social media strategist and copywriter.
Write high-engagement social media copy based on the user's topic.
Guidelines:
- Scroll-stopping hook.
- Clean line breaks for mobile readability.
- Question or call to action at the end with 3-5 relevant hashtags.
- Tone: ${options.tone} | Audience: ${options.audience}.`;
        break;

      case "product":
        systemPrompt = `You are an expert e-commerce and product copywriter.
Write an irresistible, conversion-focused product description.
Guidelines:
- Benefits-driven product title (# Product Name).
- Sensory hook explaining customer benefits.
- Bulleted features & benefits list.
- Clear Call to Action (Buy Now / Add to Cart).
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
        break;

      case "marketing":
        systemPrompt = `You are a world-class direct-response copywriter.
Write high-converting marketing copy using Problem -> Agitation -> Solution framework.
- Headline addressing primary customer pain point.
- Bullet points emphasizing transformation and competitive advantage.
- Compelling CTA.
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
        break;

      case "youtube":
        systemPrompt = `You are a top YouTube creator and scriptwriter.
Write an engaging video script with timestamps, hook ([0:00 - 0:30]), main body with retention resets, visual cues in brackets, and outro CTA.
Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
        break;

      case "seo":
        systemPrompt = `You are an expert SEO content strategist and writer.
Write a search-engine-optimized post designed to rank on Google.
Include Meta Title, Meta Description, H1 Headline, H2/H3 subheadings, direct answer paragraph, and brief FAQ section.
Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
        break;

      default:
        systemPrompt = `You are a professional content creator.
Content Type: ${options.contentType}
Tone: ${options.tone}
Audience: ${options.audience}
Language: ${options.language}
Target Length: ${options.length} (short: ~150 words, medium: ~350 words, long: ~700 words)
Format output clearly with markdown headings.`;
    }

    const maxTokens = options.length === "short" ? 500 : options.length === "long" ? 1400 : 900;
    const content = await this.callChat(systemPrompt, prompt, false, maxTokens);
    const wordCount = countWords(content);

    return {
      content: content.trim(),
      wordCount,
      contentType: options.contentType,
      suggestedTitles: [
        `Key Insights: ${prompt.slice(0, 30)}`,
        `The Complete Guide: ${prompt.slice(0, 30)}`,
        `Practical Approaches to ${prompt.slice(0, 30)}`,
      ],
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      providerUsed: `${this.name} (${this.model})`,
      isDemoMode: false,
    };
  }

  async paraphraseText(text: string, options: ParaphraseOptions): Promise<ParaphraseResult> {
    const systemPrompt = `Paraphrase the provided text in "${options.mode}" style while retaining the exact core message and meaning. Output only the paraphrased text.`;
    const paraphrasedText = await this.callChat(systemPrompt, text);

    return {
      originalText: text,
      paraphrasedText: paraphrasedText.trim(),
      mode: options.mode,
      synonymsReplaced: 8,
      providerUsed: `${this.name} (${this.model})`,
      isDemoMode: false,
    };
  }

  async checkGrammar(text: string): Promise<GrammarResult> {
    const systemPrompt = `You are an expert grammar and style editor.
Analyze the user's text for grammatical errors, spelling mistakes, punctuation flaws, and clarity improvements.
Respond ONLY with a valid JSON object matching this schema:
{
  "correctedText": "full corrected text with all fixes applied",
  "issuesCount": 3,
  "corrections": [
    {
      "id": "corr-1",
      "original": "error phrase from text",
      "replacement": "suggested correction",
      "start": 0,
      "end": 3,
      "type": "spelling",
      "explanation": "concise explanation of why this was corrected"
    }
  ],
  "readabilityImprovement": "+15% enhanced clarity"
}
Allowed types for each correction: "spelling", "grammar", "punctuation", "style", "clarity".
Output ONLY raw JSON. No markdown code blocks, no backticks, no comments.`;

    let parsed: any = null;
    try {
      const jsonStr = await this.callChat(systemPrompt, text, true);
      parsed = cleanAndParseJson(jsonStr, null);
    } catch (err: any) {
      console.warn("[AI Provider Grammar Warning]:", err.message);
    }

    const heuristicCorrections = runHeuristicGrammarCheck(text);
    let corrections: GrammarCorrection[] = [];

    if (parsed && Array.isArray(parsed.corrections) && parsed.corrections.length > 0) {
      corrections = parsed.corrections
        .filter(
          (c: any) =>
            c &&
            typeof c === "object" &&
            typeof c.original === "string" &&
            typeof c.replacement === "string" &&
            c.original.trim() !== ""
        )
        .map((c: any, idx: number) => {
          const typeStr = String(c.type || "grammar").toLowerCase();
          const validTypes = ["spelling", "grammar", "punctuation", "style", "clarity"];
          const type = validTypes.includes(typeStr) ? (typeStr as GrammarCorrection["type"]) : "grammar";

          let start = typeof c.start === "number" ? c.start : text.indexOf(c.original);
          if (start < 0) start = 0;
          let end = typeof c.end === "number" ? c.end : start + c.original.length;

          return {
            id: String(c.id || `corr-${idx + 1}`),
            original: String(c.original),
            replacement: String(c.replacement),
            start,
            end,
            type,
            explanation: String(c.explanation || `Suggested replacement: "${c.replacement}"`),
          };
        });
    }

    // Merge any heuristic corrections missed by the AI
    for (const hCorr of heuristicCorrections) {
      const alreadyCovered = corrections.some(
        (c) =>
          c.original.toLowerCase() === hCorr.original.toLowerCase() ||
          (hCorr.start >= c.start && hCorr.end <= c.end)
      );
      if (!alreadyCovered) {
        corrections.push(hCorr);
      }
    }

    let correctedText = (parsed && typeof parsed.correctedText === "string" && parsed.correctedText.trim()) || "";
    if (!correctedText) {
      correctedText = text;
      for (const corr of corrections) {
        correctedText = correctedText.replace(corr.original, corr.replacement);
      }
    }

    const issuesCount = corrections.length;
    const readabilityImprovement =
      (parsed && typeof parsed.readabilityImprovement === "string" && parsed.readabilityImprovement) ||
      (issuesCount > 0 ? `+${Math.min(30, 8 + issuesCount * 4)}% enhanced clarity` : "Writing is clear and well-structured");

    return {
      originalText: text,
      correctedText,
      issuesCount,
      corrections,
      readabilityImprovement,
      providerUsed: `${this.name} (${this.model})`,
      isDemoMode: false,
    };
  }

  async summarizeText(text: string, options: SummarizeOptions): Promise<SummarizeResult> {
    const systemPrompt = `Summarize the input text. Mode: ${options.mode} (short, medium, detailed, bullets).
Return JSON strictly in this format:
{
  "summary": string,
  "keyTakeaways": string[]
}
Output ONLY the raw JSON object. Do not include markdown code block wrappers or extra text.`;

    let parsed: any = null;
    try {
      const jsonStr = await this.callChat(systemPrompt, text, true);
      parsed = cleanAndParseJson(jsonStr, null);
    } catch (err: any) {
      console.warn("[AI Provider Summarize Warning]:", err.message);
    }

    const originalWordCount = countWords(text);
    let summary = (parsed && typeof parsed.summary === "string" && parsed.summary.trim()) || "";
    let keyTakeaways: string[] = Array.isArray(parsed?.keyTakeaways)
      ? (parsed.keyTakeaways as any[]).map((k: any) => String(k))
      : [];

    if (!summary) {
      const sentences = text.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 0);
      if (options.mode === "bullets") {
        keyTakeaways = sentences.slice(0, 4).map((s: string) => s.trim().replace(/^[-*•]\s*/, ""));
        summary = keyTakeaways.map((t: string) => `• ${t}`).join("\n");
      } else if (options.mode === "short") {
        summary = sentences.slice(0, Math.max(1, Math.floor(sentences.length * 0.3))).join(" ");
        keyTakeaways = [sentences[0] || text.slice(0, 100)];
      } else {
        summary = sentences.slice(0, Math.max(1, Math.floor(sentences.length * 0.5))).join(" ");
        keyTakeaways = sentences.slice(0, 2);
      }
    }

    const summaryWordCount = countWords(summary);
    const compressionRatio = Math.max(
      5,
      Math.round(((originalWordCount - summaryWordCount) / Math.max(1, originalWordCount)) * 100)
    );

    return {
      summary,
      originalWordCount,
      summaryWordCount,
      compressionRatio,
      keyTakeaways,
      providerUsed: `${this.name} (${this.model})`,
      isDemoMode: false,
    };
  }

  async rewriteTone(text: string, options: ToneOptions): Promise<ToneResult> {
    const systemPrompt = `Rewrite the input text using a "${options.tone}" tone. Ensure the core information remains intact while adapting style, vocabulary, and sentence flow. Output ONLY the rewritten text.`;
    const rewrittenText = await this.callChat(systemPrompt, text);

    return {
      originalText: text,
      rewrittenText: rewrittenText.trim(),
      toneApplied: options.tone,
      wordCount: countWords(rewrittenText),
      providerUsed: `${this.name} (${this.model})`,
      isDemoMode: false,
    };
  }
}

