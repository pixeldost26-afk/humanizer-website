export const dynamic = "force-dynamic";

const PRODUCTION_SITE_URL = "https://manahumanize-ai.onrender.com";

function getBaseUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ];

  for (const raw of candidates) {
    if (!raw || typeof raw !== "string") continue;
    const trimmed = raw.trim().replace(/\/+$/, "");
    if (!trimmed) continue;

    if (
      trimmed.includes("localhost") ||
      trimmed.includes("127.0.0.1") ||
      trimmed.includes("humanize-ai-q8cr")
    ) {
      continue;
    }

    if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
      return trimmed;
    }
  }

  return PRODUCTION_SITE_URL;
}

function generateRobotsTxt(baseUrl: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "# Disallow private application routes",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Disallow: /api/",
    "Disallow: /settings",
    "Disallow: /billing",
    "Disallow: /history",
    "",
    `Sitemap: ${baseUrl}/sitemap.xml`,
    "",
  ].join("\n");
}

function getHeaders(contentLength: number): HeadersInit {
  return {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": contentLength.toString(),
    "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    "X-Content-Type-Options": "nosniff",
  };
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const text = generateRobotsTxt(baseUrl);
  const buffer = Buffer.from(text, "utf-8");

  return new Response(buffer, {
    status: 200,
    headers: getHeaders(buffer.length),
  });
}

export async function HEAD() {
  const baseUrl = getBaseUrl();
  const text = generateRobotsTxt(baseUrl);
  const buffer = Buffer.from(text, "utf-8");

  return new Response(null, {
    status: 200,
    headers: getHeaders(buffer.length),
  });
}
