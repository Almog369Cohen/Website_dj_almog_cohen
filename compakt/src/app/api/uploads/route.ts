import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const LOCAL_UPLOADS_DIR = path.join(process.cwd(), ".local-uploads");

function sanitizeExt(filename: string): string {
  const parts = filename.split(".");
  const ext = parts.length > 1 ? parts[parts.length - 1] : "";
  return ext.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const file = form.get("file");
    if (!(file instanceof File)) {
      return new NextResponse("Missing file", { status: 400 });
    }

    const kind = String(form.get("kind") || "file");
    const safeKind = kind.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20) || "file";

    const ext = sanitizeExt(file.name);
    const objectName = `uploads/${safeKind}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

    const buf = Buffer.from(await file.arrayBuffer());

    const bucketName = process.env.GCS_BUCKET;

    if (bucketName) {
      const storage = new Storage();
      const bucket = storage.bucket(bucketName);
      await bucket.file(objectName).save(buf, {
        contentType: file.type || "application/octet-stream",
        resumable: false,
        metadata: { cacheControl: "public, max-age=31536000, immutable" },
      });
    } else {
      const filePath = path.join(LOCAL_UPLOADS_DIR, objectName);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, buf);
    }

    return NextResponse.json({ url: `/api/uploads/${objectName}` });
  } catch (e) {
    return new NextResponse(e instanceof Error ? e.message : "Upload failed", { status: 500 });
  }
}
