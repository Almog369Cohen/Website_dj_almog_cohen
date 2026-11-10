import { NextResponse } from "next/server";
import { portalView } from "@/lib/server/access";

export const dynamic = "force-dynamic";

/** הקישור ללקוח (מצב Supabase): קריאה בלבד */
export async function GET(req: Request) {
  const u = new URL(req.url);
  try {
    const view = await portalView(u.searchParams.get("t") ?? "", u.searchParams.get("preview") === "1");
    if (!view) return NextResponse.json({ error: "הקישור לא פעיל" }, { status: 404, headers: { "X-Robots-Tag": "noindex" } });
    return NextResponse.json(view, { headers: { "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "שגיאה בטעינה" }, { status: 500 });
  }
}
