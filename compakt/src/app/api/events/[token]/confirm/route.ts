import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** POST /api/events/[token]/confirm — DJ confirms an intake → active (token = eventId) */
export async function POST(
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

  // Verify ownership
  const { data: event } = await supabase
    .from("dj_events")
    .select("id, status, user_id")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .single();

  if (!event) {
    return NextResponse.json({ error: "EVENT_NOT_FOUND" }, { status: 404 });
  }

  if (event.status !== "intake") {
    return NextResponse.json({ error: "NOT_INTAKE", currentStatus: event.status }, { status: 400 });
  }

  // Update status
  const { error: updateErr } = await supabase
    .from("dj_events")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", eventId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // Log activity
  await supabase.from("activity_log").insert({
    entity_type: "event",
    entity_id: eventId,
    action: "confirmed",
    actor_type: "dj",
    actor_id: user.id,
  });

  return NextResponse.json({ ok: true, status: "active" });
}
