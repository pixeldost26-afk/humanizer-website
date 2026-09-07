import { NextRequest, NextResponse } from "next/server";
import { humanizeRequestSchema } from "@/lib/validation/schemas";
import { getAIEngine } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth/session";
import { checkAndDeductCredits } from "@/lib/usage/credit-service";
import { countWords } from "@/lib/utils";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
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

    const user = await getCurrentUser();
    const userId = user?.id || "demo-guest-user";
    const wordCount = countWords(text);

    // Credit enforcement (except guest users have a local quota)
    const creditResult = await checkAndDeductCredits({
      userId,
      tool: "HUMANIZER",
      wordCount,
      ipAddress: req.ip || req.headers.get("x-forwarded-for") || undefined,
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

    const engine = getAIEngine();
    const result = await engine.humanizeText(text, {
      mode,
      preserveMeaning,
      preserveFormatting,
      sentenceVariation,
      vocabularyVariation,
      tone,
    });

    const effectiveUserId = user?.id || (await prisma.user.findFirst({ where: { email: "user@humanizeai.com" } }))?.id;

    if (effectiveUserId) {
      try {
        const createdDoc = await prisma.document.create({
          data: {
            userId: effectiveUserId,
            title: `Humanized: ${text.slice(0, 30)}...`,
            content: result.humanizedText,
            toolType: "HUMANIZER",
            wordCount: result.humanizedWordCount,
            charCount: result.humanizedText.length,
          },
        });

        await prisma.generation.create({
          data: {
            userId: effectiveUserId,
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
        console.warn("Could not save generation record:", dbErr);
      }
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
        error: "An unexpected error occurred while humanizing your text. Please try again.",
      },
      { status: 500 }
    );
  }
}
