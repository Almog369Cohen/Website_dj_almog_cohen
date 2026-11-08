import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/db";
import { currentMember } from "@/lib/server/access";
import { hashPin, validPin } from "@/lib/server/session";

export const dynamic = "force-dynamic";

/** קביעת / איפוס קוד לעובד. מנהלים בלבד (או עובד לעצמו). */
export async function POST(req: Request) {
  try {
    const me = await currentMember();
    if (!me) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    const { staff_id, pin } = await req.json();
    if (typeof staff_id !== "string" || !validPin(pin)) return NextResponse.json({ error: "קוד של 4-8 ספרות" }, { status: 400 });
    if (me.role !== "admin" && staff_id !== me.id) return NextResponse.json({ error: "רק מנהלים" }, { status: 403 });
    const { error } = await adminDb().from("members").update({ pin_hash: hashPin(pin), failed_attempts: 0, locked_until: null }).eq("id", staff_id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
