import { NextRequest, NextResponse } from "next/server";
import { writeRequestSchema } from "@/lib/validation/schemas";
import { getAIEngine } from "@/lib/ai";
import { requireAuth } from "@/lib/auth/session";
import { checkAndDeductCredits } from "@/lib/usage/credit-service";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
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
    const rateLimit = checkRateLimit(`writer:${user.id}`, { limit: 20, windowMs: 60_000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit reached. Please wait ${rateLimit.resetSeconds} seconds before generating again.`,
        },
        { status: 429 }
      );
    }

    // 3. Validate input
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

    // Approximate words based on requested length: short ~150, med ~350, long ~700
    const estimatedWords = length === "short" ? 150 : length === "medium" ? 350 : 700;

    // 4. Check & deduct credits
    const creditResult = await checkAndDeductCredits({
      userId: user.id,
      tool: "WRITER",
      wordCount: estimatedWords,
      ipAddress: clientIp,
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

    // 5. Execute generation
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

    // 6. Save document and generation record
    try {
      if (user.id !== "guest-user") {
        const docTitle = result.suggestedTitles?.[0] || `${contentType}: ${prompt.slice(0, 30)}`;
        const createdDoc = await prisma.document.create({
          data: {
            userId: user.id,
            title: docTitle,
            content: result.content,
            toolType: "WRITER",
            wordCount: result.wordCount,
            charCount: result.content.length,
          },
        });

        await prisma.generation.create({
          data: {
            userId: user.id,
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
      }
    } catch (dbErr) {
      console.warn("[Database Writer Save Error]:", dbErr);
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
