import prisma from "../db/client";

export const CREDIT_RATES = {
  WORDS_PER_CREDIT: 10,
  DETECTOR_FIXED_CREDITS: 2,
  MINIMUM_CHARGE: 1,
};

/**
 * Calculates genuine credit consumption based on tool type and processed volume.
 */
export function calculateRequiredCredits(tool: string, wordCount: number): number {
  const t = tool.toUpperCase();
  const words = Math.max(1, wordCount);

  switch (t) {
    case "HUMANIZER":
      // 1 credit per 10 words, minimum 1 credit
      return Math.max(1, Math.ceil(words / 10));

    case "WRITER":
      // 1 credit per 10 words generated, minimum 2 credits
      return Math.max(2, Math.ceil(words / 10));

    case "DETECTOR":
      // Fixed 2 credits per forensic scan
      return CREDIT_RATES.DETECTOR_FIXED_CREDITS;

    case "PARAPHRASER":
    case "TONE":
      // 1 credit per 15 words
      return Math.max(1, Math.ceil(words / 15));

    case "GRAMMAR":
    case "SUMMARIZER":
      // 1 credit per 20 words
      return Math.max(1, Math.ceil(words / 20));

    default:
      return Math.max(1, Math.ceil(words / 15));
  }
}

export interface CreditCheckResult {
  hasSufficientCredits: boolean;
  requiredCredits: number;
  availableCredits: number;
  balance?: {
    monthlyCredits: number;
    usedCredits: number;
    bonusCredits: number;
  };
}

/**
 * Atomic Server-Side Credit Check & Deduction inside a Database Transaction.
 * Protects against race conditions, concurrent requests, and negative credit balances.
 */
export async function checkAndDeductCredits(params: {
  userId: string;
  tool: string;
  wordCount: number;
  ipAddress?: string;
}): Promise<{
  success: boolean;
  requiredCredits: number;
  remainingCredits: number;
  error?: string;
}> {
  const { userId, tool, wordCount, ipAddress } = params;
  const requiredCredits = calculateRequiredCredits(tool, wordCount);

  if (!userId) {
    return {
      success: false,
      requiredCredits,
      remainingCredits: 0,
      error: "Authentication required to use AI tools.",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch or initialize the user's credit balance record
      let balance = await tx.creditBalance.findUnique({
        where: { userId },
      });

      if (!balance) {
        balance = await tx.creditBalance.create({
          data: {
            userId,
            monthlyCredits: 1000,
            usedCredits: 0,
            bonusCredits: 0,
          },
        });
      }

      // 2. Calculate remaining credits
      const availableCredits = balance.monthlyCredits + balance.bonusCredits - balance.usedCredits;

      if (availableCredits < requiredCredits) {
        return {
          insufficient: true,
          availableCredits: Math.max(0, availableCredits),
        };
      }

      // 3. Atomically increment used credits
      const updatedBalance = await tx.creditBalance.update({
        where: { userId },
        data: {
          usedCredits: { increment: requiredCredits },
        },
      });

      // 4. Log tool request audit record
      await tx.toolRequest.create({
        data: {
          userId,
          tool: tool.toUpperCase(),
          wordsProcessed: wordCount,
          inputTokens: Math.round(wordCount * 1.3),
          outputTokens: Math.round(wordCount * 1.3),
          status: "SUCCESS",
          ipAddress: ipAddress || null,
        },
      });

      // 5. Aggregate daily usage
      const today = new Date().toISOString().split("T")[0];
      await tx.usage.upsert({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        update: {
          wordsTotal: { increment: wordCount },
          checksCount: { increment: 1 },
        },
        create: {
          userId,
          date: today,
          wordsTotal: wordCount,
          checksCount: 1,
        },
      });

      const remaining =
        updatedBalance.monthlyCredits + updatedBalance.bonusCredits - updatedBalance.usedCredits;

      return {
        insufficient: false,
        remainingCredits: Math.max(0, remaining),
      };
    });

    if (result.insufficient) {
      return {
        success: false,
        requiredCredits,
        remainingCredits: result.availableCredits || 0,
        error: `Insufficient credits. This request requires ${requiredCredits} credits, but your balance is ${result.availableCredits}. Upgrade your plan or wait for your monthly refill.`,
      };
    }

    return {
      success: true,
      requiredCredits,
      remainingCredits: result.remainingCredits || 0,
    };
  } catch (err: any) {
    console.error("[Credit Transaction Error]:", err);
    return {
      success: false,
      requiredCredits,
      remainingCredits: 0,
      error: "Unable to verify credit balance. Please try again.",
    };
  }
}

/**
 * Retrieves the current balance and usage percentage for a user.
 */
export async function getUserCreditBalance(userId: string) {
  if (!userId) {
    return {
      total: 0,
      used: 0,
      available: 0,
      percentageUsed: 0,
    };
  }

  try {
    let balance = await prisma.creditBalance.findUnique({
      where: { userId },
    });

    if (!balance) {
      balance = await prisma.creditBalance.create({
        data: {
          userId,
          monthlyCredits: 1000,
          usedCredits: 0,
          bonusCredits: 0,
        },
      });
    }

    const total = balance.monthlyCredits + balance.bonusCredits;
    const available = total - balance.usedCredits;
    const percentage = total > 0 ? Math.min(100, Math.round((balance.usedCredits / total) * 100)) : 0;

    return {
      total,
      used: balance.usedCredits,
      available: Math.max(0, available),
      percentageUsed: percentage,
    };
  } catch (err) {
    console.error("[Get User Balance Error]:", err);
    return {
      total: 1000,
      used: 0,
      available: 1000,
      percentageUsed: 0,
    };
  }
}
