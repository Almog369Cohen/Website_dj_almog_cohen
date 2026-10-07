import type { MetadataRoute } from "next";
import { brand } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${brand.url}/`, changeFrequency: "monthly", priority: 1 }];
}
