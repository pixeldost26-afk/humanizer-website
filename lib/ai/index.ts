import { IAIEngine } from "./provider";
import { DemoMockProvider } from "./mock-provider";
import { OpenAICompatibleProvider } from "./openai";

let cachedEngine: IAIEngine | null = null;
let lastApiKey: string | undefined = undefined;
let lastBaseUrl: string | undefined = undefined;
let lastModel: string | undefined = undefined;

class UnconfiguredAIProvider implements IAIEngine {
  name = "Unconfigured AI Provider";
  isDemo = false;

  private getErrorMessage(): string {
    return "AI Provider is not configured. Please configure OPENAI_API_KEY in your production environment variables.";
  }

  async humanizeText(): Promise<any> {
    throw new Error(this.getErrorMessage());
  }
  async detectAI(): Promise<any> {
    throw new Error(this.getErrorMessage());
  }
  async generateContent(): Promise<any> {
    throw new Error(this.getErrorMessage());
  }
  async paraphraseText(): Promise<any> {
    throw new Error(this.getErrorMessage());
  }
  async checkGrammar(): Promise<any> {
    throw new Error(this.getErrorMessage());
  }
  async summarizeText(): Promise<any> {
    throw new Error(this.getErrorMessage());
  }
  async rewriteTone(): Promise<any> {
    throw new Error(this.getErrorMessage());
  }
}

export function getAIEngine(): IAIEngine {
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL;
  const model = process.env.OPENAI_MODEL;

  // Check if configuration changed
  if (
    cachedEngine &&
    apiKey === lastApiKey &&
    baseUrl === lastBaseUrl &&
    model === lastModel
  ) {
    return cachedEngine;
  }

  lastApiKey = apiKey;
  lastBaseUrl = baseUrl;
  lastModel = model;

  if (apiKey && apiKey.trim() !== "") {
    cachedEngine = new OpenAICompatibleProvider(apiKey, baseUrl, model);
  } else if (process.env.NODE_ENV === "production" || provider === "openai") {
    // In production, never silently generate fake output
    cachedEngine = new UnconfiguredAIProvider();
  } else {
    // Only in local development fallback to heuristic mock provider
    console.warn("[AI Provider] Running in local development demo mode.");
    cachedEngine = new DemoMockProvider();
  }

  return cachedEngine;
}

export function resetEngineCache(): void {
  cachedEngine = null;
}

export * from "./provider";
