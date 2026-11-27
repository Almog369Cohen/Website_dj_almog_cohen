/**
 * Phone crops for the opening journey. On a portrait phone a landscape photo shows only about a third of
 * its width, so the phone gets just that part (full height): the same sharpness at a fraction of the bytes.
 *
 *   node scripts/journey-crops.mjs   -> public/images/<photo>-m-<w>.webp
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const crops = JSON.parse(readFileSync(join(root, "src/content/journey-crops.json"), "utf8"));
for (const [name, [x0, x1]] of Object.entries(crops)) {
  const master = join(root, "public/images", `${name}.jpg`);
  const { width, height } = await sharp(master).metadata();
  const left = Math.round(width * x0), w = Math.round(width * (x1 - x0));
  for (const out of [640, 960]) {
    const img = sharp(master).extract({ left, top: 0, width: w, height }).resize({ width: Math.min(out, w) });
    await img.webp({ quality: out <= 640 ? 64 : 68, effort: 5 }).toFile(join(root, "public/images", `${name}-m-${out}.webp`));
  }
  console.log(name, `${w}x${height}`);
}
