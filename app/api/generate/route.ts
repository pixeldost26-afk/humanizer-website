import { NextRequest, NextResponse } from "next/server";
import { writeRequestSchema } from "@/lib/validation/schemas";
import { getAIEngine } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth/session";
import { checkAndDeductCredits } from "@/lib/usage/credit-service";
import prisma from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = writeRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { prompt, contentType, tone, length, language, audience, creativity } = parseResult.data;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Please sign up or sign in to use the AI Writer.",
          requireAuth: true,
        },
        { status: 401 }
      );
    }
    const userId = user.id;

    // Approximate words based on requested length: short ~150, med ~350, long ~700
    const estimatedWords = length === "short" ? 150 : length === "medium" ? 350 : 700;

    const creditResult = await checkAndDeductCredits({
      userId,
      tool: "WRITER",
      wordCount: estimatedWords,
      ipAddress: req.ip || req.headers.get("x-forwarded-for") || undefined,
    });

    if (!creditResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: creditResult.error || "Insufficient credits to generate content.",
        },
        { status: 403 }
      );
    }

    const engine = getAIEngine();
    const result = await engine.generateContent(prompt, {
      prompt,
      contentType,
      tone,
      length,
      language,
      audience,
      creativity,
    });

    const effectiveUserId = user?.id || (await prisma.user.findFirst({ where: { email: "user@humanizeai.com" } }))?.id;

    if (effectiveUserId) {
      try {
        const docTitle = result.suggestedTitles?.[0] || `${contentType}: ${prompt.slice(0, 30)}`;
        const createdDoc = await prisma.document.create({
          data: {
            userId: effectiveUserId,
            title: docTitle,
            content: result.content,
            toolType: "WRITER",
            wordCount: result.wordCount,
            charCount: result.content.length,
          },
        });

        await prisma.generation.create({
          data: {
            userId: effectiveUserId,
            documentId: createdDoc.id,
            tool: "WRITER",
            inputSnippet: prompt.slice(0, 150),
            outputText: result.content,
            wordCount: result.wordCount,
            creditsCharged: creditResult.requiredCredits,
            metadata: JSON.stringify({
              contentType,
              tone,
              suggestedTitles: result.suggestedTitles,
            }),
          },
        });
      } catch (dbErr) {
        console.warn("Could not save writer document/generation:", dbErr);
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
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to generate content. Please try again.",
      },
      { status: 500 }
    );
  }
}
