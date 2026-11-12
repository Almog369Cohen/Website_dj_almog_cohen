import { NextResponse } from "next/server";
import { Conflict, currentMember, Forbidden, portalLogin, portalPreview, portalTasksSave, portalView } from "@/lib/server/access";

export const dynamic = "force-dynamic";

const H = { "X-Robots-Tag": "noindex", "Cache-Control": "no-store" };
const NOT_ACTIVE = "הקישור לא פעיל";

/** תצוגה מקדימה לצוות (הקישור הסודי): קריאה בלבד */
export async function GET(req: Request) {
  try {
    const view = await portalPreview(new URL(req.url).searchParams.get("t") ?? "", await currentMember());
    if (!view) return NextResponse.json({ error: NOT_ACTIVE }, { status: 404, headers: H });
    return NextResponse.json(view, { headers: H });
  } catch {
    return NextResponse.json({ error: "שגיאה בטעינה" }, { status: 500, headers: H });
  }
}

/** הזוג: כניסה (טלפון + קוד), צפייה, ושמירת המשימות שלהם. אין שום כתיבה אחרת. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body?.action === "login") return NextResponse.json(await portalLogin(body.phone, body.code), { headers: H });
    if (body?.action === "view") {
      const view = await portalView(body.session);
      if (!view) return NextResponse.json({ error: NOT_ACTIVE, code: "auth" }, { status: 401, headers: H });
      return NextResponse.json(view, { headers: H });
    }
    if (body?.action === "tasks") return NextResponse.json(await portalTasksSave(body.session, { tasks: body.tasks, dismissed: body.dismissed, rev: body.rev }), { headers: H });
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400, headers: H });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (e instanceof Conflict) return NextResponse.json({ error: msg, code: "conflict" }, { status: 409, headers: H });
    if (e instanceof Forbidden) return NextResponse.json({ error: msg, code: msg.includes("כניסה") ? "auth" : "bad" }, { status: 403, headers: H });
    return NextResponse.json({ error: "שגיאה. נסו שוב" }, { status: 500, headers: H });
  }
}
