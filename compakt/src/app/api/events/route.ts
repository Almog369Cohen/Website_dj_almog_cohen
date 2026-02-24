import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** GET /api/events — list authenticated DJ's events */
export async function GET(req: Request) {
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

  const { data, error } = await supabase
    .from("dj_events")
    .select("id, event_type, couple_name_a, couple_name_b, event_date, venue, city, contact_phone, contact_role, magic_token, current_stage, is_archived, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data ?? [] });
}

/** POST /api/events — create a new event for the authenticated DJ */
export async function POST(req: Request) {
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

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    // empty body is fine — defaults will be used
  }

  const { data, error } = await supabase
    .from("dj_events")
    .insert({
      user_id: user.id,
      event_type: (body.eventType as string) || "wedding",
      couple_name_a: (body.coupleNameA as string) || null,
      couple_name_b: (body.coupleNameB as string) || null,
      event_date: (body.eventDate as string) || null,
      venue: (body.venue as string) || null,
      city: (body.city as string) || null,
      contact_phone: (body.contactPhone as string) || null,
      contact_role: (body.contactRole as string) || null,
    })
    .select("id, magic_token, event_type, couple_name_a, couple_name_b, event_date, venue, city, contact_phone, contact_role, current_stage, is_archived, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ event: data }, { status: 201 });
}
