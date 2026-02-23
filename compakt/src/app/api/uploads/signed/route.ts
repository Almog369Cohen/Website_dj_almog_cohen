import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

export const runtime = "nodejs";

function sanitizeExt(filename: string): string {
  const parts = filename.split(".");
  const ext = parts.length > 1 ? parts[parts.length - 1] : "";
  return ext.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const bucketName = process.env.GCS_BUCKET;

    if (!bucketName) {
      return NextResponse.json({ fallback: true });
    }

    const body = (await req.json().catch(() => null)) as
      | {
        kind?: string;
        filename?: string;
        contentType?: string;
      }
      | null;

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const kind = String(body.kind || "file");
    const safeKind = kind.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20) || "file";

    const filename = String(body.filename || "file");
    const ext = sanitizeExt(filename);

    const contentType = String(body.contentType || "application/octet-stream");
    if (!contentType.trim()) {
      return NextResponse.json({ error: "Missing contentType" }, { status: 400 });
    }

    const objectName = `uploads/${safeKind}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(objectName);

    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });

    return NextResponse.json({
      uploadUrl,
      objectName,
      url: `/api/uploads/${objectName}`,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to sign upload";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
