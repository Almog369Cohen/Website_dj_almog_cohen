import { Storage } from "@google-cloud/storage";
import { Readable } from "node:stream";
import { readFile, stat } from "node:fs/promises";
import nodePath from "node:path";

export const runtime = "nodejs";

const LOCAL_UPLOADS_DIR = nodePath.join(process.cwd(), ".local-uploads");

const MIME_MAP: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  aac: "audio/aac",
  m4a: "audio/mp4",
  webm: "audio/webm",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
};

function guessContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return MIME_MAP[ext] || "application/octet-stream";
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await ctx.params;

    const objectName = path.join("/");
    if (!objectName || objectName.includes("..")) {
      return new Response("Invalid path", { status: 400 });
    }

    const bucketName = process.env.GCS_BUCKET;

    if (bucketName) {
      const storage = new Storage();
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(objectName);

      const [meta] = await file.getMetadata();
      const contentType = (meta.contentType as string | undefined) || "application/octet-stream";

      const nodeStream = file.createReadStream();
      const webStream = Readable.toWeb(nodeStream) as ReadableStream;

      return new Response(webStream, {
        status: 200,
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    } else {
      const filePath = nodePath.join(LOCAL_UPLOADS_DIR, objectName);
      const resolved = nodePath.resolve(filePath);
      if (!resolved.startsWith(LOCAL_UPLOADS_DIR)) {
        return new Response("Invalid path", { status: 400 });
      }

      await stat(resolved);
      const buf = await readFile(resolved);
      const contentType = guessContentType(objectName);

      return new Response(buf, {
        status: 200,
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (e) {
    return new Response(e instanceof Error ? e.message : "Not found", { status: 404 });
  }
}
