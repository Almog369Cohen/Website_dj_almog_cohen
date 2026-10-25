import type { MetadataRoute } from "next";
import { brand } from "@/content/site";
import { indexableRoutes } from "@/lib/indexable-routes";

export const dynamic = "force-static";

/** Only pages that are ready for search, with trailing slashes to match the export. */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map((r) => ({ url: brand.url + r.path, lastModified: r.updated, priority: r.path === "/" ? 1 : 0.7 }));
}
