import type { MetadataRoute } from "next";
import { IS_PRODUCTION, brand } from "@/content/site";

export const dynamic = "force-static";

/** Closed while there is no real domain (a preview must not be indexed). Open, AI search bots included, once there is. */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "Bingbot"], allow: "/" },
    ],
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
