import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const routes = [
    "",
    "/pricing",
    "/humanizer",
    "/ai-detector",
    "/ai-writer",
    "/paraphraser",
    "/grammar",
    "/summarizer",
    "/tone",
    "/privacy",
    "/terms",
    "/contact",
  ];

  return routes.map((route) => {
    // Ensure homepage has trailing slash (https://manahumanize-ai.onrender.com/)
    // and sub-routes are cleanly joined (https://manahumanize-ai.onrender.com/pricing)
    const url = route === "" ? `${baseUrl}/` : `${baseUrl}${route}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1.0 : 0.8,
    };
  });
}
