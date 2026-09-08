import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        subscription: true,
        creditBalance: true,
        preference: true,
        documents: {
          select: {
            id: true,
            title: true,
            content: true,
            toolType: true,
            wordCount: true,
            charCount: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        generations: {
          select: {
            id: true,
            tool: true,
            inputSnippet: true,
            outputText: true,
            wordCount: true,
            creditsCharged: true,
            createdAt: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });
    }

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      platform: "ManaHumanizeAI",
      account: userData,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="manahumanizeai-data-${user.id.slice(0, 8)}.json"`,
      },
    });
  } catch (err: any) {
    console.error("Export data error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to export account data." },
      { status: 500 }
    );
  }
}
