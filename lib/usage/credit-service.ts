import prisma from "../db/client";

export const CREDIT_RATES = {
  WORDS_PER_CREDIT: 10,
  DETECTOR_FIXED_CREDITS: 5,
  MINIMUM_CHARGE: 1,
};

export function calculateRequiredCredits(tool: string, wordCount: number): number {
  return 0; // 100% Free & Unlimited - No billing plans or credit limits
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

  // Humanizer and free tools are 100% unlimited
  if (requiredCredits === 0 || tool.toUpperCase() === "HUMANIZER") {
    return {
      success: true,
      requiredCredits: 0,
      remainingCredits: 999999,
    };
  }

  if (userId === "demo-guest-user" || userId.startsWith("demo-")) {
    return {
      success: true,
      requiredCredits,
      remainingCredits: 999999,
    };
  }

  try {
    // Check if user exists in database first
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: true,
        requiredCredits,
        remainingCredits: 950,
      };
    }

    // Fetch or create user credit balance
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

    const availableCredits = balance.monthlyCredits + balance.bonusCredits - balance.usedCredits;

    if (availableCredits < requiredCredits) {
      return {
        success: false,
        requiredCredits,
        remainingCredits: Math.max(0, availableCredits),
        error: `Insufficient credits. You need ${requiredCredits} credits, but currently have ${availableCredits}. Please upgrade your plan or wait for your monthly renewal.`,
      };
    }

    // Deduct credits and update usage record
    const updatedBalance = await prisma.creditBalance.update({
      where: { userId },
      data: {
        usedCredits: { increment: requiredCredits },
      },
    });

    // Record tool request
    await prisma.toolRequest.create({
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

    // Record daily usage aggregate
    const today = new Date().toISOString().split("T")[0];
    await prisma.usage.upsert({
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

    const newRemaining = updatedBalance.monthlyCredits + updatedBalance.bonusCredits - updatedBalance.usedCredits;

    return {
      success: true,
      requiredCredits,
      remainingCredits: newRemaining,
    };
  } catch (err: any) {
    console.error("Error checking or deducting credits:", err);
    // If DB is temporarily offline or in transition, allow execution with a warning log
    return {
      success: true,
      requiredCredits,
      remainingCredits: 950,
    };
  }
}

export async function getUserCreditBalance(userId: string) {
  if (!userId || userId === "demo-guest-user" || userId.startsWith("demo-")) {
    return {
      total: 999999,
      used: 0,
      available: 999999,
      percentageUsed: 0,
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        total: 999999,
        used: 0,
        available: 999999,
        percentageUsed: 0,
      };
    }

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

    const available = balance.monthlyCredits + balance.bonusCredits - balance.usedCredits;
    return {
      total: balance.monthlyCredits + balance.bonusCredits,
      used: balance.usedCredits,
      available: Math.max(0, available),
      percentageUsed: Math.min(100, Math.round((balance.usedCredits / Math.max(1, balance.monthlyCredits + balance.bonusCredits)) * 100)),
    };
  } catch (err) {
    return {
      total: 1000,
      used: 50,
      available: 950,
      percentageUsed: 5,
    };
  }
}
