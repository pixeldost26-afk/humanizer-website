import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config/site";

export const dynamic = "force-dynamic";

interface SitemapEntry {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  // Only include publicly accessible, indexable pages.
  // Private tool routes (which require authentication and redirect to /login)
  // as well as API endpoints and auth flows are strictly excluded.
  const publicRoutes: SitemapEntry[] = [
    {
      path: "",
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      path: "/pricing",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/contact",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      path: "/privacy",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      path: "/terms",
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return publicRoutes.map((route) => {
    // Ensure homepage has trailing slash (https://manahumanize-ai.onrender.com/)
    // and sub-routes are cleanly joined without trailing slash (https://manahumanize-ai.onrender.com/pricing)
    const url = route.path === "" ? `${baseUrl}/` : `${baseUrl}${route.path}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
  });
}

