import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** PATCH /api/events/[token]/notes — update DJ notes for an event */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: eventId } = await params;
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }

  const supabase = createServerSupabase();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser(authHeader.slice(7));

  if (authErr || !user) {
    return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });
  }

  const body = await req.json();
  const notes = typeof body.notes === "string" ? body.notes : "";

  const { error: updateErr } = await supabase
    .from("dj_events")
    .update({ dj_notes: notes || null, updated_at: new Date().toISOString() })
    .eq("id", eventId)
    .eq("user_id", user.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
