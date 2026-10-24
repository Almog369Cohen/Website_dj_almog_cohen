/**
 * Media pipeline: turns original photos/videos into web-ready, high-quality files.
 *
 *   npm run media                  # processes public/images/*.jpg (placeholders or originals)
 *   npm run media -- <srcDir>      # imports originals from a folder (e.g. the client's zip), then processes
 *
 * Images: auto-rotated, EXIF stripped, a 2400px JPEG master plus WebP at the widths in WIDTHS.
 *         The custom next/image loader (src/lib/image-loader.ts) serves the matching WebP size.
 * Videos: H.264 MP4, 1080p and 720p, no audio, +faststart, plus a poster frame (needs ffmpeg).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import sharp from "sharp";

export const WIDTHS = [640, 1080, 1600, 2400];
const root = resolve(import.meta.dirname, "..");
const imgDir = join(root, "public/images");
const vidDir = join(root, "public/video");
const src = process.argv[2] ? resolve(process.argv[2]) : null;

const slug = (name) =>
  basename(name, extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9֐-׿]+/g, "-")
    .replace(/^-|-$/g, "");

async function processImage(input, name) {
  const master = join(imgDir, `${name}.jpg`);
  const img = sharp(input, { failOn: "none" }).rotate();
  if (input !== master) {
    await img.clone().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true, progressive: true }).toFile(master);
  }
  for (const w of WIDTHS) {
    await sharp(master).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(join(imgDir, `${name}-${w}.webp`));
  }
  console.log("image", name);
}

function processVideo(input, name) {
  mkdirSync(vidDir, { recursive: true });
  const common = ["-y", "-i", input, "-an", "-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
  execFileSync("ffmpeg", [...common, "-vf", "scale=-2:'min(1080,ih)'", "-crf", "23", "-maxrate", "6M", "-bufsize", "12M", join(vidDir, `${name}-1080.mp4`)], { stdio: "ignore" });
  execFileSync("ffmpeg", [...common, "-vf", "scale=-2:'min(720,ih)'", "-crf", "24", "-maxrate", "2.5M", "-bufsize", "5M", join(vidDir, `${name}-720.mp4`)], { stdio: "ignore" });
  execFileSync("ffmpeg", ["-y", "-ss", "1", "-i", input, "-frames:v", "1", "-vf", "scale=-2:'min(1080,ih)'", "-q:v", "3", join(imgDir, `${name}-poster.jpg`)], { stdio: "ignore" });
  console.log("video", name);
}

mkdirSync(imgDir, { recursive: true });
const IMG = /\.(jpe?g|png|heic|webp|tiff?)$/i;
const VID = /\.(mov|mp4|m4v)$/i;

if (src) {
  for (const f of readdirSync(src)) {
    const p = join(src, f);
    if (!statSync(p).isFile()) continue;
    if (IMG.test(f)) await processImage(p, slug(f));
    else if (VID.test(f)) processVideo(p, slug(f));
  }
} else {
  for (const f of readdirSync(imgDir)) {
    if (!/\.jpg$/i.test(f) || /-poster\.jpg$/i.test(f)) continue;
    await processImage(join(imgDir, f), basename(f, ".jpg"));
  }
}
if (!existsSync(imgDir)) process.exit(1);
