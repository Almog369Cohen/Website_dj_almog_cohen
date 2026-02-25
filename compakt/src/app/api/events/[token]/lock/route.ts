import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** POST /api/events/[token]/lock — toggle lock on an event */
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

  const { data: event } = await supabase
    .from("dj_events")
    .select("id, user_id, locked_at")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .single();

  if (!event) {
    return NextResponse.json({ error: "EVENT_NOT_FOUND" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const isCurrentlyLocked = !!event.locked_at;

  const { error: updateErr } = await supabase
    .from("dj_events")
    .update({
      locked_at: isCurrentlyLocked ? null : now,
      updated_at: now,
    })
    .eq("id", eventId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  await supabase.from("activity_log").insert({
    entity_type: "event",
    entity_id: eventId,
    action: isCurrentlyLocked ? "unlocked" : "locked",
    actor_type: "dj",
    actor_id: user.id,
  });

  return NextResponse.json({
    ok: true,
    locked: !isCurrentlyLocked,
    locked_at: isCurrentlyLocked ? null : now,
  });
}
