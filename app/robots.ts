import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config/site";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/pricing",
        "/humanizer",
        "/ai-detector",
        "/ai-writer",
        "/paraphraser",
        "/grammar",
        "/summarizer",
        "/tone",
      ],
      disallow: ["/admin", "/api/", "/dashboard"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
