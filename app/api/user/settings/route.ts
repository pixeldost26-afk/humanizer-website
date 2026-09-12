import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { updateSettingsSchema } from "@/lib/validation/schemas";
import prisma from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  if (user.id === "guest-user") {
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: "guest-user",
          name: "Guest",
          email: "guest@manahumanize.com",
          image: null,
          role: "USER",
          createdAt: new Date().toISOString(),
        },
        subscription: {
          planId: "FREE",
          status: "ACTIVE",
        },
        creditBalance: {
          monthlyCredits: 10000,
          usedCredits: 0,
          bonusCredits: 0,
        },
        preference: {
          theme: "system",
          preferredTone: "Natural",
          preferredStyle: "Standard",
          preferredLanguage: "en",
          emailAlerts: true,
          productUpdates: true,
          securityAlerts: true,
          timezone: "UTC",
        },
      },
      error: null,
    });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        subscription: true,
        creditBalance: true,
        preference: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User record not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: dbUser.id,
          name: dbUser.name || "User",
          email: dbUser.email,
          image: dbUser.image,
          role: dbUser.role,
          createdAt: dbUser.createdAt,
        },
        subscription: dbUser.subscription,
        creditBalance: dbUser.creditBalance,
        preference: dbUser.preference || {
          theme: "system",
          preferredTone: "Natural",
          preferredStyle: "Standard",
          preferredLanguage: "en",
          emailAlerts: true,
          productUpdates: true,
          securityAlerts: true,
          timezone: "UTC",
        },
      },
      error: null,
    });
  } catch (err: any) {
    console.error("Error fetching user settings:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load user settings." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parseResult = updateSettingsSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const {
      name,
      preferredTone,
      preferredStyle,
      preferredLanguage,
      emailAlerts,
      productUpdates,
      securityAlerts,
      timezone,
    } = parseResult.data;

    if (user.id === "guest-user") {
      return NextResponse.json({
        success: true,
        message: "Preferences updated.",
        data: {
          preferredTone: preferredTone || "Natural",
          preferredStyle: preferredStyle || "Standard",
          preferredLanguage: preferredLanguage || "en",
          emailAlerts: emailAlerts ?? true,
          productUpdates: productUpdates ?? true,
          securityAlerts: securityAlerts ?? true,
          timezone: timezone || "UTC",
        },
      });
    }

    // 1. Update user profile name if provided
    if (name && name.trim()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: name.trim() },
      });
    }

    // 2. Upsert user preferences
    const updatedPref = await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: {
        ...(preferredTone ? { preferredTone } : {}),
        ...(preferredStyle ? { preferredStyle } : {}),
        ...(preferredLanguage ? { preferredLanguage } : {}),
        ...(typeof emailAlerts === "boolean" ? { emailAlerts } : {}),
        ...(typeof productUpdates === "boolean" ? { productUpdates } : {}),
        ...(typeof securityAlerts === "boolean" ? { securityAlerts } : {}),
        ...(timezone ? { timezone } : {}),
      },
      create: {
        userId: user.id,
        preferredTone: preferredTone || "Natural",
        preferredStyle: preferredStyle || "Standard",
        preferredLanguage: preferredLanguage || "en",
        emailAlerts: emailAlerts ?? true,
        productUpdates: productUpdates ?? true,
        securityAlerts: securityAlerts ?? true,
        timezone: timezone || "UTC",
      },
    });

    return NextResponse.json({
      success: true,
      data: { preference: updatedPref },
      message: "Preferences updated successfully.",
      error: null,
    });
  } catch (err: any) {
    console.error("Error updating user settings:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update preferences." },
      { status: 500 }
    );
  }
}
