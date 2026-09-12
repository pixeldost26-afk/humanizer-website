export const dynamic = "force-dynamic";

interface SitemapEntry {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

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

    // Filter out localhost or decommissioned domains
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

const PUBLIC_ROUTES: SitemapEntry[] = [
  { path: "", changeFrequency: "daily", priority: "1.0" },
  { path: "/humanizer", changeFrequency: "daily", priority: "0.95" },
  { path: "/ai-detector", changeFrequency: "daily", priority: "0.95" },
  { path: "/paraphraser", changeFrequency: "weekly", priority: "0.9" },
  { path: "/ai-writer", changeFrequency: "weekly", priority: "0.9" },
  { path: "/grammar", changeFrequency: "weekly", priority: "0.9" },
  { path: "/summarizer", changeFrequency: "weekly", priority: "0.85" },
  { path: "/tone", changeFrequency: "weekly", priority: "0.85" },
  { path: "/pricing", changeFrequency: "weekly", priority: "0.8" },
  { path: "/contact", changeFrequency: "weekly", priority: "0.8" },
  { path: "/privacy", changeFrequency: "monthly", priority: "0.5" },
  { path: "/terms", changeFrequency: "monthly", priority: "0.5" },
];

function generateSitemapXml(baseUrl: string): string {
  const today = new Date().toISOString().split("T")[0];

  const urls = PUBLIC_ROUTES.map((route) => {
    // Ensure homepage has trailing slash (https://manahumanize-ai.onrender.com/)
    // and sub-routes are cleanly joined without trailing slash (https://manahumanize-ai.onrender.com/pricing)
    const loc = route.path === "" ? `${baseUrl}/` : `${baseUrl}${route.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function getHeaders(contentLength: number): HeadersInit {
  return {
    "Content-Type": "application/xml; charset=utf-8",
    "Content-Length": contentLength.toString(),
    "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    "X-Content-Type-Options": "nosniff",
  };
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const xml = generateSitemapXml(baseUrl);
  const buffer = Buffer.from(xml, "utf-8");

  return new Response(buffer, {
    status: 200,
    headers: getHeaders(buffer.length),
  });
}

export async function HEAD() {
  const baseUrl = getBaseUrl();
  const xml = generateSitemapXml(baseUrl);
  const buffer = Buffer.from(xml, "utf-8");

  return new Response(null, {
    status: 200,
    headers: getHeaders(buffer.length),
  });
}
