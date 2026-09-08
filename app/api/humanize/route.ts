import { NextRequest, NextResponse } from "next/server";
import { humanizeRequestSchema } from "@/lib/validation/schemas";
import { getAIEngine } from "@/lib/ai";
import { requireAuth } from "@/lib/auth/session";
import { checkAndDeductCredits } from "@/lib/usage/credit-service";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
import { countWords } from "@/lib/utils";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);

    // 1. Authenticate user
    const { user, response: authResponse } = await requireAuth();
    if (authResponse || !user) {
      return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    // 2. Enforce rate limiting
    const rateLimit = checkRateLimit(`humanize:${user.id}`, { limit: 25, windowMs: 60_000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit reached. Please wait ${rateLimit.resetSeconds} seconds before sending another request.`,
        },
        { status: 429 }
      );
    }

    // 3. Validate input
    const body = await req.json();
    const parseResult = humanizeRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { text, mode, preserveMeaning, preserveFormatting, sentenceVariation, vocabularyVariation, tone } =
      parseResult.data;

    const wordCount = countWords(text);

    // 4. Check & atomically deduct credits
    const creditResult = await checkAndDeductCredits({
      userId: user.id,
      tool: "HUMANIZER",
      wordCount,
      ipAddress: clientIp,
    });

    if (!creditResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: creditResult.error || "Insufficient credits to process this text.",
        },
        { status: 403 }
      );
    }

    // 5. Execute AI Humanization
    const engine = getAIEngine();
    const result = await engine.humanizeText(text, {
      mode,
      preserveMeaning,
      preserveFormatting,
      sentenceVariation,
      vocabularyVariation,
      tone,
    });

    // 6. Record document and generation history in database
    try {
      const createdDoc = await prisma.document.create({
        data: {
          userId: user.id,
          title: `Humanized: ${text.slice(0, 35).trim()}...`,
          content: result.humanizedText,
          toolType: "HUMANIZER",
          wordCount: result.humanizedWordCount,
          charCount: result.humanizedText.length,
        },
      });

      await prisma.generation.create({
        data: {
          userId: user.id,
          documentId: createdDoc.id,
          tool: "HUMANIZER",
          inputSnippet: text.slice(0, 150),
          outputText: result.humanizedText,
          wordCount: result.humanizedWordCount,
          creditsCharged: creditResult.requiredCredits,
          metadata: JSON.stringify({
            mode,
            readingEase: result.readingEase,
            metrics: result.metrics,
          }),
        },
      });
    } catch (dbErr) {
      console.warn("[Database Save Error]:", dbErr);
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
    console.error("Error in /api/humanize:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while humanizing your text. Please try again.",
      },
      { status: 500 }
    );
  }
}
