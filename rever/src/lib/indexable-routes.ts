import { events } from "@/content/events";
import { guides } from "@/content/guides";
import { pages } from "@/content/routes";
import { indexable } from "./seo";

/** Every route with its search status and last update: the sitemap, robots and llms.txt all read this. */
export function allRoutes() {
  return [
    ...Object.values(pages).map((p) => ({ path: p.path, title: p.title, status: p.status, updated: p.updated, description: p.description })),
    ...events.map((e) => ({ path: `/events/${e.slug}/`, title: e.title, status: e.status, updated: "2026-10-25", description: e.text })),
    ...guides.map((g) => ({ path: `/guides/${g.slug}/`, title: g.title, status: g.status, updated: g.updated, description: g.description })),
  ];
}

export const indexableRoutes = () => allRoutes().filter((r) => r.status === "verified");
export const liveIndexable = () => allRoutes().filter((r) => indexable(r.status));
