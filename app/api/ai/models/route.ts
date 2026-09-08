import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  const rawBaseUrl = (process.env.OPENAI_BASE_URL || "").trim();
  const isGroq = apiKey.startsWith("gsk_") || rawBaseUrl.includes("groq");
  const baseUrl = isGroq ? "https://api.groq.com/openai/v1" : rawBaseUrl || "https://api.openai.com/v1";

  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 400 });
  }

  try {
    const res = await fetch(`${baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        error: `Provider returned status ${res.status}`,
        details: errText,
      }, { status: res.status });
    }

    const data = await res.json();
    const modelIds = (data.data || []).map((m: any) => m.id);

    return NextResponse.json({
      provider: isGroq ? "Groq" : "OpenAI",
      baseUrl,
      currentConfiguredModel: process.env.OPENAI_MODEL || "default",
      totalModels: modelIds.length,
      availableModelIds: modelIds,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
