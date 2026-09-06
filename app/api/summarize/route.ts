import { NextRequest, NextResponse } from "next/server";
import { summarizeRequestSchema } from "@/lib/validation/schemas";
import { getAIEngine } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth/session";
import { checkAndDeductCredits } from "@/lib/usage/credit-service";
import { countWords } from "@/lib/utils";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = summarizeRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { text, mode } = parseResult.data;
    const user = await getCurrentUser();
    const userId = user?.id || "demo-guest-user";
    const wordCount = countWords(text);

    const creditResult = await checkAndDeductCredits({
      userId,
      tool: "SUMMARIZER",
      wordCount,
      ipAddress: req.ip || req.headers.get("x-forwarded-for") || undefined,
    });

    if (!creditResult.success) {
      return NextResponse.json(
        { success: false, error: creditResult.error || "Insufficient credits." },
        { status: 403 }
      );
    }

    const engine = getAIEngine();
    const result = await engine.summarizeText(text, { mode });

    if (user?.id) {
      try {
        await prisma.generation.create({
          data: {
            userId: user.id,
            tool: "SUMMARIZER",
            inputSnippet: text.slice(0, 150),
            outputText: result.summary,
            wordCount: result.summaryWordCount,
            creditsCharged: creditResult.requiredCredits,
            metadata: JSON.stringify({
              mode,
              compressionRatio: result.compressionRatio,
              keyTakeaways: result.keyTakeaways,
            }),
          },
        });
      } catch (dbErr) {
        console.warn("Could not save summary log:", dbErr);
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
    console.error("Error in /api/summarize:", error);
    return NextResponse.json(
      { success: false, error: "Failed to summarize text. Please try again." },
      { status: 500 }
    );
  }
}
