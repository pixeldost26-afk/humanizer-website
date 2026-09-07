import { IAIEngine } from "./provider";
import { DemoMockProvider } from "./mock-provider";
import { OpenAICompatibleProvider } from "./openai";

let cachedEngine: IAIEngine | null = null;
let lastApiKey: string | undefined = undefined;
let lastBaseUrl: string | undefined = undefined;
let lastModel: string | undefined = undefined;

export function getAIEngine(): IAIEngine {
  const provider = process.env.AI_PROVIDER || "demo";
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

  if ((provider === "openai" || Boolean(apiKey)) && apiKey && apiKey.trim() !== "") {
    cachedEngine = new OpenAICompatibleProvider(apiKey, baseUrl, model);
  } else {
    // Default to upgraded high-fidelity heuristic provider
    cachedEngine = new DemoMockProvider();
  }

  return cachedEngine;
}

export function resetEngineCache(): void {
  cachedEngine = null;
}

export * from "./provider";
