import { NextRequest, NextResponse } from "next/server";
import { detectRequestSchema } from "@/lib/validation/schemas";
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
    const rateLimit = checkRateLimit(`detect:${user.id}`, { limit: 30, windowMs: 60_000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit reached. Please wait ${rateLimit.resetSeconds} seconds before scanning again.`,
        },
        { status: 429 }
      );
    }

    // 3. Validate input
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
    const wordCount = countWords(text);

    // 4. Check & deduct credits
    const creditResult = await checkAndDeductCredits({
      userId: user.id,
      tool: "DETECTOR",
      wordCount,
      ipAddress: clientIp,
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

    // 5. Execute Detection
    const engine = getAIEngine();
    const result = await engine.detectAI(text);

    // 6. Save generation record
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
      console.warn("[Database Detector Save Error]:", dbErr);
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
    console.error("Error in /api/detect:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to complete AI detection analysis. Please try again.",
      },
      { status: 500 }
    );
  }
}
