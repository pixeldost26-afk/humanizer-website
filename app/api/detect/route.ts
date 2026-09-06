import { NextRequest, NextResponse } from "next/server";
import { detectRequestSchema } from "@/lib/validation/schemas";
import { getAIEngine } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth/session";
import { checkAndDeductCredits } from "@/lib/usage/credit-service";
import { countWords } from "@/lib/utils";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = detectRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { text } = parseResult.data;
    const user = await getCurrentUser();
    const userId = user?.id || "demo-guest-user";
    const wordCount = countWords(text);

    const creditResult = await checkAndDeductCredits({
      userId,
      tool: "DETECTOR",
      wordCount,
      ipAddress: req.ip || req.headers.get("x-forwarded-for") || undefined,
    });

    if (!creditResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: creditResult.error || "Insufficient credits to perform AI detection scan.",
        },
        { status: 403 }
      );
    }

    const engine = getAIEngine();
    const result = await engine.detectAI(text);

    if (user?.id) {
      try {
        await prisma.generation.create({
          data: {
            userId: user.id,
            tool: "DETECTOR",
            inputSnippet: text.slice(0, 150),
            outputText: `Verdict: ${result.verdict} (AI: ${result.aiLikelihood}%, Human: ${result.humanLikelihood}%)`,
            wordCount,
            creditsCharged: creditResult.requiredCredits,
            metadata: JSON.stringify({
              aiLikelihood: result.aiLikelihood,
              humanLikelihood: result.humanLikelihood,
              verdict: result.verdict,
              confidence: result.confidence,
              indicators: result.indicators,
            }),
          },
        });
      } catch (dbErr) {
        console.warn("Could not save detector generation:", dbErr);
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
  } catch (error) {
    console.error("Error in /api/detect:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to complete AI detection analysis. Please try again.",
      },
      { status: 500 }
    );
  }
}
