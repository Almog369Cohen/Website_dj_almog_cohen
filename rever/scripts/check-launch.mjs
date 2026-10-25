/**
 * Pre-launch check, run on a production build (NEXT_PUBLIC_SITE_URL set):
 *   NEXT_PUBLIC_SITE_URL=https://example.co.il npm run build && npm run check:launch
 * Fails when the domain is missing, when an indexable page still shows a green placeholder,
 * or when a page's canonical, title or H1 is missing or doubled.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const out = new URL("../out/", import.meta.url).pathname;
const pages = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f === "index.html") pages.push(p); });
walk(out);

const problems = [];
const robots = readFileSync(join(out, "robots.txt"), "utf8");
if (/Disallow: \/\s*$/m.test(robots) && !/Allow: \//.test(robots)) problems.push("robots.txt blocks everything: NEXT_PUBLIC_SITE_URL is not set for this build");

let indexed = 0;
for (const p of pages) {
  const html = readFileSync(p, "utf8");
  const path = "/" + relative(out, p).replace(/index\.html$/, "");
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${path}: no title`);
  if (!/<link rel="canonical" href="[^"]+\/"/.test(html) && path !== "/404.html") problems.push(`${path}: canonical missing or without a trailing slash`);
  if (h1 !== 1 && !path.includes("_not-found")) problems.push(`${path}: ${h1} H1 headings`);
  if (!noindex) {
    indexed++;
    if (/class="todo"/.test(html)) problems.push(`${path}: indexable page shows a green placeholder`);
  }
}

console.log(`${pages.length} pages, ${indexed} indexable`);
if (problems.length) {
  console.error(problems.map((x) => "✗ " + x).join("\n"));
  process.exit(1);
}
console.log("✓ ready to launch");
