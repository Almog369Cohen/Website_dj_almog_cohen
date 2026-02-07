import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.compaktt.com";
  
  const routes = [
    // Main pages
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/weddings", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/academy", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/music", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },

    // Weddings sub-pages
    { path: "/weddings/after-party", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/weddings/fit-check", priority: 0.7, changeFrequency: "monthly" as const },

    // Academy sub-pages
    { path: "/academy/groom-dj", priority: 0.8, changeFrequency: "weekly" as const },

    // Events
    { path: "/events", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/events/weddings-dj", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/events/bar-mitzvah-dj", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/events/bat-mitzvah-dj", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/events/corporate-events", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/events/henna-dj", priority: 0.65, changeFrequency: "weekly" as const },
    { path: "/events/live-on-dj", priority: 0.7, changeFrequency: "weekly" as const },

    // Blog
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/blog/how-to-choose-wedding-dj", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/blog/dj-or-band-guide", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/blog/dj-course-5-mistakes", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/blog/pro-gear-behind-the-scenes", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog/wedding-dj-cost", priority: 0.9, changeFrequency: "monthly" as const },
  ];
  
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
