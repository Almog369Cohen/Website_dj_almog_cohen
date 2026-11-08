import { NextResponse } from "next/server";
import { adminDb, verifyGoogle } from "@/lib/server/db";

export const dynamic = "force-dynamic";

/** רשימת העובדים למסך בחירת העובד (שם ותפקיד בלבד). דורש חשבון גוגל מורשה. */
export async function GET(req: Request) {
  try {
    if (!(await verifyGoogle(req))) return NextResponse.json({ error: "החשבון הזה לא מורשה" }, { status: 403 });
    const { data, error } = await adminDb().from("members").select("id,name,title,role,pin_hash").eq("active", true).order("role").order("name");
    if (error) throw error;
    return NextResponse.json({
      staff: (data ?? []).map((m) => ({ id: m.id, name: m.name, title: m.title, role: m.role, has_pin: !!m.pin_hash })),
      setup: (data ?? []).length === 0,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

/** הגדרה ראשונה: כשאין אף עובד, יוצרים מנהל ראשון עם קוד מאסטר. */
export async function POST(req: Request) {
  try {
    if (!(await verifyGoogle(req))) return NextResponse.json({ error: "החשבון הזה לא מורשה" }, { status: 403 });
    const { name, pin } = await req.json();
    const { validPin, hashPin, makeSession, COOKIE, cookieOpts } = await import("@/lib/server/session");
    if (typeof name !== "string" || !name.trim() || !validPin(pin)) return NextResponse.json({ error: "שם וקוד של 4-8 ספרות" }, { status: 400 });
    const db = adminDb();
    const { count } = await db.from("members").select("id", { count: "exact", head: true });
    if (count) return NextResponse.json({ error: "המערכת כבר הוגדרה" }, { status: 409 });
    const id = crypto.randomUUID();
    const { error } = await db.from("members").insert({
      id, name: name.trim(), title: "בעלים", role: "admin", can_prices: true, can_finance: true, can_delete: true, can_templates: true, active: true, pin_hash: hashPin(pin),
    });
    if (error) throw error;
    const res = NextResponse.json({ ok: true, id });
    res.cookies.set(COOKIE, makeSession(id), cookieOpts);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
