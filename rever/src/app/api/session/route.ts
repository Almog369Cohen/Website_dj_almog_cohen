import { NextResponse } from "next/server";
import { adminDb, verifyGoogle } from "@/lib/server/db";
import { checkPin, cookieOpts, COOKIE, makeSession, validPin } from "@/lib/server/session";
import { currentMember } from "@/lib/server/access";

export const dynamic = "force-dynamic";
const MAX_TRIES = 5;
const LOCK_MIN = 10;

/** מי מחובר עכשיו */
export async function GET() {
  try {
    const me = await currentMember();
    return me ? NextResponse.json({ me }) : NextResponse.json({ me: null }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

/** כניסת עובד: חשבון גוגל מורשה + בחירת עובד + קוד אישי */
export async function POST(req: Request) {
  try {
    if (!(await verifyGoogle(req))) return NextResponse.json({ error: "החשבון הזה לא מורשה" }, { status: 403 });
    const { staff_id, pin } = await req.json();
    if (typeof staff_id !== "string" || !validPin(pin)) return NextResponse.json({ error: "קוד לא תקין" }, { status: 400 });
    const db = adminDb();
    const { data: m } = await db.from("members").select("id,active,pin_hash,failed_attempts,locked_until").eq("id", staff_id).maybeSingle();
    if (!m || !m.active) return NextResponse.json({ error: "העובד לא נמצא" }, { status: 404 });
    if (m.locked_until && new Date(m.locked_until) > new Date()) {
      return NextResponse.json({ error: `יותר מדי ניסיונות. נסו שוב בעוד ${LOCK_MIN} דקות` }, { status: 429 });
    }
    if (!checkPin(pin, m.pin_hash)) {
      const tries = (m.failed_attempts ?? 0) + 1;
      await db
        .from("members")
        .update(tries >= MAX_TRIES ? { failed_attempts: 0, locked_until: new Date(Date.now() + LOCK_MIN * 60_000).toISOString() } : { failed_attempts: tries })
        .eq("id", m.id);
      return NextResponse.json({ error: tries >= MAX_TRIES ? `הקוד ננעל ל-${LOCK_MIN} דקות` : "קוד שגוי" }, { status: 401 });
    }
    await db.from("members").update({ failed_attempts: 0, locked_until: null, last_login: new Date().toISOString() }).eq("id", m.id);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, makeSession(m.id), cookieOpts);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

/** החלפת עובד / יציאה */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { ...cookieOpts, maxAge: 0 });
  return res;
}
