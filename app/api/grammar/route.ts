import { NextRequest, NextResponse } from "next/server";
import { grammarRequestSchema } from "@/lib/validation/schemas";
import { getAIEngine } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth/session";
import { checkAndDeductCredits } from "@/lib/usage/credit-service";
import { countWords } from "@/lib/utils";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = grammarRequestSchema.safeParse(body);

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
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Please sign up or sign in to use the Grammar Checker.",
          requireAuth: true,
        },
        { status: 401 }
      );
    }
    const userId = user.id;
    const wordCount = countWords(text);

    const creditResult = await checkAndDeductCredits({
      userId,
      tool: "GRAMMAR",
      wordCount,
      ipAddress: req.ip || req.headers.get("x-forwarded-for") || undefined,
    });

    if (!creditResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: creditResult.error || "Insufficient credits.",
        },
        { status: 403 }
      );
    }

    const engine = getAIEngine();
    const result = await engine.checkGrammar(text);

    if (user?.id) {
      try {
        await prisma.generation.create({
          data: {
            userId: user.id,
            tool: "GRAMMAR",
            inputSnippet: text.slice(0, 150),
            outputText: result.correctedText,
            wordCount,
            creditsCharged: creditResult.requiredCredits,
            metadata: JSON.stringify({
              issuesCount: result.issuesCount,
              readabilityImprovement: result.readabilityImprovement,
            }),
          },
        });
      } catch (dbErr) {
        console.warn("Could not save grammar check log:", dbErr);
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
    console.error("Error in /api/grammar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to scan grammar. Please try again." },
      { status: 500 }
    );
  }
}
