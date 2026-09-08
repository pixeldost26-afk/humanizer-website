import { NextRequest, NextResponse } from "next/server";
import { paraphraseRequestSchema } from "@/lib/validation/schemas";
import { getAIEngine } from "@/lib/ai";
import { requireAuth } from "@/lib/auth/session";
import { checkAndDeductCredits } from "@/lib/usage/credit-service";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
import { countWords } from "@/lib/utils";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);

    const { user, response: authResponse } = await requireAuth();
    if (authResponse || !user) {
      return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const rateLimit = checkRateLimit(`paraphrase:${user.id}`, { limit: 30, windowMs: 60_000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: `Rate limit reached. Please wait ${rateLimit.resetSeconds}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = paraphraseRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const { text, mode } = parseResult.data;
    const wordCount = countWords(text);

    const creditResult = await checkAndDeductCredits({
      userId: user.id,
      tool: "PARAPHRASER",
      wordCount,
      ipAddress: clientIp,
    });

    if (!creditResult.success) {
      return NextResponse.json(
        { success: false, error: creditResult.error || "Insufficient credits." },
        { status: 403 }
      );
    }

    const engine = getAIEngine();
    const result = await engine.paraphraseText(text, { mode });

    try {
      await prisma.generation.create({
        data: {
          userId: user.id,
          tool: "PARAPHRASER",
          inputSnippet: text.slice(0, 150),
          outputText: result.paraphrasedText,
          wordCount: countWords(result.paraphrasedText),
          creditsCharged: creditResult.requiredCredits,
          metadata: JSON.stringify({ mode }),
        },
      });
    } catch (dbErr) {
      console.warn("[Database Paraphrase Save Error]:", dbErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        creditsCharged: creditResult.requiredCredits,
        remainingCredits: creditResult.remainingCredits,
      },
      error: null,
    });
  } catch (error: any) {
    console.error("Error in /api/paraphrase:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to paraphrase text. Please try again." },
      { status: 500 }
    );
  }
}
