/**
 * next/image loader for the static export. `npm run media` pre-renders every
 * /images/<name>.jpg as <name>-<width>.webp; this picks the closest size.
 * Other sources (svg, external, posters) are returned unchanged.
 */
const WIDTHS = [640, 1080, 1280, 1600, 2400];

export default function imageLoader({ src, width }: { src: string; width: number }) {
  const m = src.match(/^(.*images\/)([^/]+)\.jpg$/);
  if (!m || src.endsWith("-poster.jpg")) return src;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${m[1]}${m[2]}-${w}.webp`;
}
