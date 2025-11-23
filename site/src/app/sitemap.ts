import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.compaktt.com";
  
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/courses", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/chogeg-menagen", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/services/weddings", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/services/corporate", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/services/private", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/music", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
  ];
  
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
