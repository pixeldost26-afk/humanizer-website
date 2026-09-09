/**
 * Central site configuration and canonical base URL resolution.
 * Prioritizes environment variables (SITE_URL, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_APP_URL)
 * while safely filtering out deprecated legacy preview domains.
 */

export const PRODUCTION_SITE_URL = "https://manahumanize-ai.onrender.com";

export function getSiteUrl(): string {
  const candidates = [
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXTAUTH_URL,
  ];

  for (const raw of candidates) {
    if (!raw || typeof raw !== "string") continue;
    const trimmed = raw.trim().replace(/\/+$/, "");
    if (!trimmed) continue;

    // Filter out obsolete/decommissioned Render domains
    if (
      trimmed.includes("humanize-ai-q8cr.onrender.com") ||
      trimmed.includes("humanize-ai-q8cr")
    ) {
      continue;
    }

    // Must be an absolute HTTP/HTTPS URL
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
  }

  // If in production or when no valid URL is found, default to official deployed domain
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  return "http://localhost:3000";
}
