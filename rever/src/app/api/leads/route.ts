import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID, timingSafeEqual } from "crypto";

/**
 * קליטת ליד חיצוני (Make / Meta Lead Ads / ManyChat / טופס באתר).
 * דורש: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LEADS_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const secret = process.env.LEADS_WEBHOOK_SECRET;
  if (!url || !key || !secret) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const got = Buffer.from(req.headers.get("x-webhook-secret") ?? "");
  const want = Buffer.from(secret);
  if (got.length !== want.length || !timingSafeEqual(got, want)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const str = (k: string) => (typeof body[k] === "string" && (body[k] as string).trim()) || undefined;
  const name = str("name") ?? str("full_name");
  const phone = str("phone") ?? str("phone_number");
  if (!name || !phone) return NextResponse.json({ error: "name and phone are required" }, { status: 400 });

  const sb = createClient(url, key, { auth: { persistSession: false } });
  const now = new Date().toISOString();

  // אותו טלפון כבר קיים? לא יוצרים כפילות, רק מקפיצים פולואפ
  const digits = phone.replace(/\D/g, "").slice(-9);
  const { data: existing } = await sb.from("leads").select("id,phone").ilike("phone", `%${digits.slice(-7)}%`);
  const dup = existing?.find((l) => String(l.phone).replace(/\D/g, "").endsWith(digits));
  if (dup) {
    await sb.from("leads").update({ next_followup: now, followup_note: "השאירו פרטים שוב" }).eq("id", dup.id);
    await sb.from("activities").insert({ id: randomUUID(), lead_id: dup.id, kind: "created", text: `פנייה חוזרת (${str("source") ?? "חיצוני"})`, at: now });
    return NextResponse.json({ ok: true, id: dup.id, duplicate: true });
  }

  const id = randomUUID();
  const guests = Number(body.guests);
  const lead = {
    id,
    name,
    phone,
    email: str("email"),
    event_type: str("event_type") ?? "אחר",
    event_date: str("event_date"),
    guests: Number.isFinite(guests) && guests > 0 ? guests : null,
    venue: str("venue"),
    source: str("source") ?? "אחר",
    status: "new",
    notes: str("notes"),
    next_followup: now,
    followup_note: "ליד חדש: לשלוח הודעת היכרות",
    created_at: now,
  };
  const { error } = await sb.from("leads").insert(lead);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await sb.from("activities").insert({ id: randomUUID(), lead_id: id, kind: "created", text: `ליד חדש נכנס (${lead.source})`, at: now });
  return NextResponse.json({ ok: true, id });
}
