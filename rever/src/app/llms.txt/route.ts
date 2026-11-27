import { brand, founders } from "@/content/site";
import { indexableRoutes } from "@/lib/indexable-routes";

export const dynamic = "force-static";

/** A plain-text summary for AI assistants: verified facts only, and only pages that are ready for search. */
export function GET() {
  const lines = [
    `# ${brand.entity}`,
    "",
    `> הפקת חתונות ואירועים בליווי מלא: לוקיישן וספקים, תקציב וחוזים, עיצוב וניהול של יום האירוע. ${brand.years} שנים של הפקות.`,
    "",
    `- מייסדים: ${founders.map((f) => f.name).join(" ו")}`,
    `- אינסטגרם: ${brand.instagram}`,
    "",
    "## עמודים",
    ...indexableRoutes().map((r) => `- [${r.title}](${brand.url}${r.path}): ${r.description}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
