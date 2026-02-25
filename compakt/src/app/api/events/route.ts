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

  // Load events with contact + portal token info
  const { data, error } = await supabase
    .from("dj_events")
    .select(`
      id, event_type, couple_name_a, couple_name_b, event_date, venue, city,
      contact_phone, contact_role, magic_token, current_stage, is_archived,
      status, locked_at, portal_closed_at, completed_at, archived_at,
      contact_id, dj_notes, created_at, updated_at
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Load portal tokens for all events
  const eventIds = (data ?? []).map((e) => e.id);
  let portalTokenMap: Record<string, string> = {};
  if (eventIds.length) {
    const { data: tokens } = await supabase
      .from("portal_tokens")
      .select("event_id, token")
      .in("event_id", eventIds)
      .eq("is_active", true);

    if (tokens) {
      portalTokenMap = Object.fromEntries(tokens.map((t) => [t.event_id, t.token]));
    }
  }

  // Load contacts for all events
  const contactIds = (data ?? []).map((e) => e.contact_id).filter(Boolean);
  let contactMap: Record<string, { id: string; name: string; phone: string | null }> = {};
  if (contactIds.length) {
    const { data: contacts } = await supabase
      .from("event_contacts")
      .select("id, name, phone")
      .in("id", contactIds);

    if (contacts) {
      contactMap = Object.fromEntries(contacts.map((c) => [c.id, c]));
    }
  }

  const events = (data ?? []).map((e) => ({
    ...e,
    portal_token: portalTokenMap[e.id] ?? null,
    contact: e.contact_id ? (contactMap[e.contact_id] ?? null) : null,
  }));

  return NextResponse.json({ events });
}

/** POST /api/events — create a new event for the authenticated DJ (DJ-initiated → status 'active') */
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

  const coupleName = (body.coupleNameA as string)?.trim() || "";
  const phone = (body.contactPhone as string)?.trim() || null;

  // 1. Create event_contact
  const { data: contact, error: contactErr } = await supabase
    .from("event_contacts")
    .insert({
      dj_user_id: user.id,
      name: coupleName || "ללא שם",
      phone,
      source: "manual",
    })
    .select("id")
    .single();

  if (contactErr || !contact) {
    return NextResponse.json({ error: "CONTACT_CREATE_FAILED", detail: contactErr?.message }, { status: 500 });
  }

  // 2. Create event (DJ-initiated = status 'active')
  const { data: event, error: eventErr } = await supabase
    .from("dj_events")
    .insert({
      user_id: user.id,
      contact_id: contact.id,
      event_type: (body.eventType as string) || "wedding",
      couple_name_a: coupleName || null,
      couple_name_b: (body.coupleNameB as string) || null,
      event_date: (body.eventDate as string) || null,
      venue: (body.venue as string) || null,
      city: (body.city as string) || null,
      contact_phone: phone,
      contact_role: (body.contactRole as string) || null,
      status: "active",
    })
    .select("id, magic_token, event_type, couple_name_a, couple_name_b, event_date, venue, city, contact_phone, contact_role, current_stage, is_archived, status, created_at")
    .single();

  if (eventErr || !event) {
    return NextResponse.json({ error: eventErr?.message ?? "EVENT_CREATE_FAILED" }, { status: 500 });
  }

  // 3. Create portal_token
  const { data: portalToken, error: tokenErr } = await supabase
    .from("portal_tokens")
    .insert({
      event_id: event.id,
      contact_id: contact.id,
    })
    .select("token")
    .single();

  if (tokenErr) {
    console.error("[POST /api/events] portal_token creation failed:", tokenErr.message);
  }

  // 4. Log activity
  await supabase.from("activity_log").insert({
    entity_type: "event",
    entity_id: event.id,
    action: "created",
    actor_type: "dj",
    actor_id: user.id,
    metadata: { source: "dj_admin" },
  });

  return NextResponse.json({
    event: {
      ...event,
      portal_token: portalToken?.token ?? null,
      contact_id: contact.id,
    },
  }, { status: 201 });
}
