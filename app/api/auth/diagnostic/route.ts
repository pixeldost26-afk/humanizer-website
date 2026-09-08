import { NextResponse } from "next/server";
import { getLastOAuthError } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const googleClientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  const nextAuthUrl = (process.env.NEXTAUTH_URL || "").trim();
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").trim();
  const nextAuthSecret = (process.env.NEXTAUTH_SECRET || "").trim();
  const trustHost = process.env.NEXTAUTH_TRUST_HOST || process.env.AUTH_TRUST_HOST || "";

  return NextResponse.json({
    status: "ok",
    nextAuthUrl: nextAuthUrl || "NOT_SET",
    appUrl: appUrl || "NOT_SET",
    trustHostEnabled: Boolean(trustHost),
    googleClientIdConfigured: Boolean(googleClientId),
    googleClientSecretConfigured: Boolean(googleClientSecret),
    nextAuthSecretConfigured: Boolean(nextAuthSecret),
    lastOAuthError: getLastOAuthError(),
  });
}
