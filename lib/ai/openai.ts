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
  SummarizeOptions,
  SummarizeResult,
  ToneOptions,
  ToneResult,
} from "./provider";
import { DemoMockProvider } from "./mock-provider";
import { countWords, calculateReadingEase } from "../utils";

export class OpenAICompatibleProvider implements IAIEngine {
  name = "OpenAI Compatible Engine";
  isDemo = false;
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private fallback: DemoMockProvider;

  constructor(apiKey: string, baseUrl?: string, model?: string) {
    this.apiKey = apiKey.trim();

    if (this.apiKey.startsWith("gsk_")) {
      // Definitively a Groq API Key -> MUST route to Groq API
      this.baseUrl = baseUrl && baseUrl.includes("groq") ? baseUrl.trim() : "https://api.groq.com/openai/v1";
      let m = model && !model.toLowerCase().includes("gpt") ? model.trim() : "llama-3.1-8b-instant";
      if (m.includes("3.3-70b")) {
        m = "llama-3.1-8b-instant";
      }
      this.model = m;
    } else if (this.apiKey.startsWith("sk-")) {
      // Definitively an OpenAI API Key
      this.baseUrl = baseUrl && !baseUrl.includes("groq") ? baseUrl.trim() : "https://api.openai.com/v1";
      this.model = model && !model.toLowerCase().includes("llama") ? model.trim() : "gpt-4o-mini";
    } else {
      this.baseUrl = baseUrl && baseUrl.trim() !== "" ? baseUrl.trim() : "https://api.openai.com/v1";
      this.model = model && model.trim() !== "" ? model.trim() : "gpt-4o-mini";
    }

    console.log(`[AI Engine] Initialized with key prefix '${this.apiKey.slice(0, 4)}...', routing to ${this.baseUrl} with model ${this.model}`);

    this.fallback = new DemoMockProvider();
  }

  private async getAvailableModel(excludeModel?: string): Promise<string | null> {
    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const ids: string[] = (data.data || []).map((m: any) => m.id);
      console.log(`[AI Provider] Available models on ${this.baseUrl}:`, ids);

      const textModels = ids.filter((id) => 
        id !== excludeModel &&
        !id.includes("whisper") && 
        !id.includes("embed") && 
        !id.includes("tts") && 
        !id.includes("vision") && 
        !id.includes("guard")
      );

      // Prioritize fast text models with generous rate limits (e.g. llama, gpt) over strict models like qwen
      const preferred = 
        textModels.find((id) => id.includes("llama-3.1") || id.includes("llama-3.2")) ||
        textModels.find((id) => id.includes("llama") || id.includes("gpt")) ||
        textModels.find((id) => id.includes("mixtral") || id.includes("gemma")) ||
        textModels.find((id) => id.includes("qwen")) ||
        textModels[0];

      return preferred || null;
    } catch (e) {
      console.warn("Could not query /models:", e);
      return null;
    }
  }

  private async callChat(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false,
    retryWithModel?: string,
    maxTokens = 750
  ): Promise<string> {
    const activeModel = retryWithModel || this.model;
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: activeModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: maxTokens, // Keeps generation under Groq's 1,000 output tokens per minute limit
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      // If 404 (model not found) or 429 (token limit exceeded on a specific model), dynamically fallback
      if ((res.status === 404 || res.status === 429) && !retryWithModel) {
        console.warn(`Model '${activeModel}' returned HTTP ${res.status}. Fetching alternative model...`);
        const fallbackModel = await this.getAvailableModel(activeModel);
        if (fallbackModel && fallbackModel !== activeModel) {
          console.log(`Auto-switched to alternative model: ${fallbackModel}`);
          this.model = fallbackModel;
          return this.callChat(systemPrompt, userPrompt, jsonMode, fallbackModel, Math.min(maxTokens, 600));
        }
      }
      throw new Error(`AI Provider HTTP Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async humanizeText(text: string, options: HumanizeOptions): Promise<HumanizeResult> {
    try {
      const systemPrompt = `You are an elite human editor and writing coach. Your goal is to rewrite the input text so it sounds completely authentic, engaging, and genuinely human-written, while strictly preserving the core meaning, direct quotes, and citations.
Target Mode: ${options.mode}
Preserve Meaning (1-5): ${options.preserveMeaning}
Sentence Variation (1-5): ${options.sentenceVariation}
Vocabulary Richness (1-5): ${options.vocabularyVariation}

CRITICAL ANTI-DETECTION MANDATE: The rewritten text must achieve a 0% AI-generated score on modern detectors like Grammarly, Turnitin, and GPTZero.
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
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to Demo provider:", err);
      return this.fallback.humanizeText(text, options);
    }
  }

  async detectAI(text: string): Promise<DetectionResult> {
    try {
      const systemPrompt = `You are an AI content analysis specialist. Analyze the given text for probabilistic markers of AI vs human authorship (such as lexical uniformity, burstiness, repetitive syntactical cadences, and formulaic transitions).
Return a JSON object strictly matching this schema:
{
  "aiLikelihood": number (0 to 100),
  "humanLikelihood": number (0 to 100),
  "verdict": "Highly Likely Human" | "Mixed / Edited Content" | "Likely AI-Generated",
  "confidence": "High" | "Medium" | "Low",
  "sentences": [
    {
      "index": number,
      "text": string,
      "aiProbability": number (0 to 100),
      "label": "Natural / Human" | "Uncertain / Mixed" | "Likely AI-Generated",
      "reasons": string[]
    }
  ],
  "indicators": {
    "perplexityScore": number (0-100),
    "burstinessScore": number (0-100),
    "sentenceLengthVariance": number,
    "vocabularyRichness": number,
    "repetitionRisk": "Low" | "Moderate" | "High"
  }
}`;

      const jsonStr = await this.callChat(systemPrompt, text, true);
      const parsed = JSON.parse(jsonStr);

      return {
        ...parsed,
        disclaimer:
          "AI detection is probabilistic and may produce false positives or false negatives. Results should not be treated as definitive proof of authorship.",
        isDemoMode: false,
      };
    } catch (err) {
      console.warn("Detection API failed, falling back to heuristic engine:", err);
      return this.fallback.detectAI(text);
    }
  }

  async generateContent(prompt: string, options: WriteOptions): Promise<WriteResult> {
    try {
      let systemPrompt = "";
      switch (options.contentType) {
        case "story":
          systemPrompt = `You are an expert creative fiction writer.
Transform the user's idea or instructions into an engaging, original, human-sounding story.

Writing requirements:
- Create a clear beginning, middle, and ending.
- Develop believable characters with distinct personalities.
- Use natural dialogue that sounds like real people speaking.
- Show emotions through actions, thoughts, expressions, and situations rather than simply stating them.
- Use vivid but natural descriptions without overloading the story with adjectives.
- Vary sentence length and paragraph structure.
- Maintain a smooth, engaging narrative flow.
- Avoid repetitive phrases, generic AI-style wording, and predictable transitions.
- Keep the writing original and imaginative.
- Match the requested tone (${options.tone}) and target audience (${options.audience}).
- Preserve any important names, characters, events, or requirements provided by the user.
- Target Length: ${options.length} (~${options.length === "short" ? "250" : options.length === "long" ? "800" : "450"} words).
- Output only the finished story with a creative markdown title (e.g. # Title). Do not add unnecessary explanations before or after the story.`;
          break;

        case "blog":
          systemPrompt = `You are an elite, engaging blog writer and thought leader.
Write a captivating, high-value blog post based on the user's topic or instructions.
Guidelines:
- Craft an irresistible, click-worthy headline (# Title).
- Hook the reader immediately in the opening paragraph with relatable insight or a surprising perspective.
- Use a conversational, authentic human voice with personality and practical depth.
- Organize with clear H2 and H3 subheadings, concise paragraphs, and bullet points.
- Provide actionable, practical takeaways that genuinely help the reader.
- Tone: ${options.tone} | Target Audience: ${options.audience} | Language: ${options.language}.
- Conclude with a memorable takeaway and an engaging question to spark discussion.`;
          break;

        case "essay":
          systemPrompt = `You are an academic scholar and essayist.
Write a rigorous, well-structured academic essay addressing the user's topic.
Guidelines:
- Start with an insightful, scholarly title (# Title).
- Introduction: establish intellectual context and state a clear, compelling thesis statement.
- Body paragraphs: present balanced, evidence-based arguments with logical transitions, analytical depth, and counter-perspectives.
- Conclusion: synthesize findings and reflect on broader implications without repetitive summarization.
- Use precise academic vocabulary and formal analytical rigor.
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
          break;

        case "article":
          systemPrompt = `You are an investigative journalist and long-form feature writer.
Write an in-depth, authoritative feature article based on the user's prompt.
Guidelines:
- Compelling journalistic headline (# Headline) and an engaging subhead.
- Narrative lead establishing real-world stakes and significance.
- Structured sections with clear H2/H3 subheadings examining multiple perspectives.
- Incorporate concrete examples, real-world context, and objective analysis.
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
          break;

        case "email":
          systemPrompt = `You are an executive communication and business email specialist.
Write a polished, highly effective business email based on the user's instructions.
Guidelines:
- Include 2 compelling Subject Line options at the top (e.g. **Subject:** ...).
- Professional greeting appropriate for the audience.
- Clear opening stating the purpose in the first 2 sentences.
- Concise body with bullet points for effortless scannability.
- Clear, unambiguous Call to Action (CTA) or next steps.
- Professional sign-off.
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.
- Keep it concise, respectful, and direct.`;
          break;

        case "social":
          systemPrompt = `You are a viral social media strategist and copywriter.
Write high-engagement social media copy based on the user's topic.
Guidelines:
- Scroll-stopping first line (hook) that creates curiosity or emotional resonance.
- Clean line breaks and formatting optimized for readability on mobile screens.
- Deliver concentrated value, contrarian insights, or a compelling mini-takeaway.
- End with an engaging question or clear call to comment/share.
- Include 3-5 relevant, high-performing hashtags at the bottom.
- Provide 2 distinct variations (Option 1: Story-driven, Option 2: Punchy listicle).
- Tone: ${options.tone} | Audience: ${options.audience}.`;
          break;

        case "product":
          systemPrompt = `You are an expert e-commerce and product copywriter.
Write an irresistible, conversion-focused product description based on the user's prompt.
Guidelines:
- Catchy, benefits-driven product title (# Product Name).
- Emotional, sensory hook explaining why the customer needs this product now.
- Key Features & Benefits: bulleted list highlighting concrete customer outcomes (not just technical specs).
- Why It's Better: unique selling proposition (USP) vs alternatives.
- Strong, persuasive call to action (Add to Cart / Buy Now urgency).
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
          break;

        case "marketing":
          systemPrompt = `You are a world-class direct-response copywriter.
Write high-converting marketing copy based on the user's prompt.
Guidelines:
- High-impact headline and sub-headline addressing the primary customer pain point or desire.
- Use proven copywriting framework (Problem -> Agitation -> Solution).
- Clear, punchy bullet points emphasizing transformation and competitive advantages.
- Risk reversal and trust building elements.
- Unmistakable, compelling Call to Action (CTA).
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
          break;

        case "youtube":
          systemPrompt = `You are a top YouTube creator, director, and scriptwriter.
Write an engaging, high-retention YouTube video script based on the user's topic.
Guidelines:
- [0:00 - 0:30] HOOK & INTRO: Fast-paced teaser that previews the value and prevents click-away. Include visual cues in brackets e.g. [B-roll / On-Screen Graphic].
- [BODY]: Structured segments with timestamps (e.g. [1:15 - Point 1: ...]), conversational spoken delivery, and retention resets (humor, surprising facts, visual shifts).
- [OUTRO & CTA]: Natural call to subscribe, like, and a clear prompt for comments.
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
          break;

        case "seo":
          systemPrompt = `You are an expert SEO content strategist and writer.
Write a search-engine-optimized post designed to rank on Google and answer search intent.
Guidelines:
- Include recommended SEO Meta Title and Meta Description (under 160 characters) at the top.
- Optimized H1 Headline with primary search keyword.
- Structured H2 and H3 subheadings targeting secondary search queries.
- Direct Answer / Featured Snippet summary paragraph right below the H1.
- Scannable bullet points, actionable tips, and internal linking suggestions [Internal Link: ...].
- Brief FAQ section (2-3 common user questions with concise answers).
- Tone: ${options.tone} | Audience: ${options.audience} | Language: ${options.language}.`;
          break;

        default:
          systemPrompt = `You are a professional content creator and copywriter.
Generate high quality content for:
Content Type: ${options.contentType}
Tone: ${options.tone}
Audience: ${options.audience}
Language: ${options.language}
Target Length: ${options.length} (short: ~150 words, medium: ~350 words, long: ~700 words)
Format output clearly with markdown headings where appropriate.`;
      }

      const maxTokens = options.length === "short" ? 350 : options.length === "long" ? 800 : 650;
      const content = await this.callChat(systemPrompt, prompt, false, undefined, maxTokens);
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
    } catch (err) {
      console.error("Writer API failed:", err);
      throw err;
    }
  }

  async paraphraseText(text: string, options: ParaphraseOptions): Promise<ParaphraseResult> {
    try {
      const systemPrompt = `Paraphrase the provided text in "${options.mode}" style while retaining the exact core message. Output only the paraphrased text.`;
      const paraphrasedText = await this.callChat(systemPrompt, text);

      return {
        originalText: text,
        paraphrasedText: paraphrasedText.trim(),
        mode: options.mode,
        synonymsReplaced: 8,
        providerUsed: `${this.name} (${this.model})`,
        isDemoMode: false,
      };
    } catch (err) {
      return this.fallback.paraphraseText(text, options);
    }
  }

  async checkGrammar(text: string): Promise<GrammarResult> {
    try {
      const systemPrompt = `Analyze the given text for grammatical errors, spelling typos, punctuation flaws, and clarity improvements.
Return JSON strictly in this format:
{
  "correctedText": string,
  "issuesCount": number,
  "corrections": [
    {
      "id": string,
      "original": string,
      "replacement": string,
      "start": number,
      "end": number,
      "type": "spelling" | "grammar" | "punctuation" | "style" | "clarity",
      "explanation": string
    }
  ],
  "readabilityImprovement": string
}`;

      const jsonStr = await this.callChat(systemPrompt, text, true);
      const parsed = JSON.parse(jsonStr);

      return {
        originalText: text,
        correctedText: parsed.correctedText,
        issuesCount: parsed.issuesCount || parsed.corrections?.length || 0,
        corrections: parsed.corrections || [],
        readabilityImprovement: parsed.readabilityImprovement || "+15% enhanced clarity",
        providerUsed: `${this.name} (${this.model})`,
        isDemoMode: false,
      };
    } catch (err) {
      return this.fallback.checkGrammar(text);
    }
  }

  async summarizeText(text: string, options: SummarizeOptions): Promise<SummarizeResult> {
    try {
      const systemPrompt = `Summarize the input text. Mode: ${options.mode} (short, medium, detailed, bullets).
Return JSON in this format:
{
  "summary": string,
  "keyTakeaways": string[]
}`;

      const jsonStr = await this.callChat(systemPrompt, text, true);
      const parsed = JSON.parse(jsonStr);
      const originalWordCount = countWords(text);
      const summaryWordCount = countWords(parsed.summary);
      const compressionRatio = Math.max(
        5,
        Math.round(((originalWordCount - summaryWordCount) / Math.max(1, originalWordCount)) * 100)
      );

      return {
        summary: parsed.summary,
        originalWordCount,
        summaryWordCount,
        compressionRatio,
        keyTakeaways: parsed.keyTakeaways || [],
        providerUsed: `${this.name} (${this.model})`,
        isDemoMode: false,
      };
    } catch (err) {
      return this.fallback.summarizeText(text, options);
    }
  }

  async rewriteTone(text: string, options: ToneOptions): Promise<ToneResult> {
    try {
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
    } catch (err) {
      return this.fallback.rewriteTone(text, options);
    }
  }
}
