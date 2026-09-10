import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config/site";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/admin",
        "/api/",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/settings",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
