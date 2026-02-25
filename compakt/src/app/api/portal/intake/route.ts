import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

interface IntakeBody {
  djSlug: string;
  name: string;
  phone?: string;
  eventType?: string;
  eventDate?: string;
}

/** POST /api/portal/intake — couple submits intake from DJ's public page */
export async function POST(req: Request) {
  let body: IntakeBody;
  try {
    body = (await req.json()) as IntakeBody;
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  if (!body.djSlug || !body.name?.trim()) {
    return NextResponse.json({ error: "MISSING_FIELDS", detail: "djSlug and name are required" }, { status: 400 });
  }

  const supabase = createServerSupabase();

  // 1. Find DJ by slug
  const { data: dj, error: djErr } = await supabase
    .from("profiles")
    .select("id, business_name, accent_color, logo_url, dj_slug")
    .eq("dj_slug", body.djSlug)
    .single();

  if (djErr || !dj) {
    return NextResponse.json({ error: "DJ_NOT_FOUND" }, { status: 404 });
  }

  // 2. Duplicate detection: check if phone exists for this DJ
  let existingContact = null;
  if (body.phone?.trim()) {
    const { data: existing } = await supabase
      .from("event_contacts")
      .select("id, name, phone")
      .eq("dj_user_id", dj.id)
      .eq("phone", body.phone.trim())
      .limit(1)
      .maybeSingle();

    if (existing) {
      existingContact = existing;
      // Check if there's an active/intake event for this contact
      const { data: existingEvent } = await supabase
        .from("dj_events")
        .select("id, status, magic_token")
        .eq("contact_id", existing.id)
        .in("status", ["intake", "active"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingEvent) {
        // Find portal token for existing event
        const { data: existingToken } = await supabase
          .from("portal_tokens")
          .select("token")
          .eq("event_id", existingEvent.id)
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

        return NextResponse.json({
          duplicate: true,
          existingContactId: existing.id,
          existingEventId: existingEvent.id,
          existingToken: existingToken?.token ?? null,
          existingStatus: existingEvent.status,
        }, { status: 200 });
      }
    }
  }

  // 3. Create event_contact (or reuse existing contact)
  let contactId: string;
  if (existingContact) {
    contactId = existingContact.id;
  } else {
    const { data: contact, error: contactErr } = await supabase
      .from("event_contacts")
      .insert({
        dj_user_id: dj.id,
        name: body.name.trim(),
        phone: body.phone?.trim() || null,
        source: "dj_link",
      })
      .select("id")
      .single();

    if (contactErr || !contact) {
      return NextResponse.json({ error: "CONTACT_CREATE_FAILED", detail: contactErr?.message }, { status: 500 });
    }
    contactId = contact.id;
  }

  // 4. Create dj_event (status = 'intake')
  const { data: event, error: eventErr } = await supabase
    .from("dj_events")
    .insert({
      user_id: dj.id,
      contact_id: contactId,
      event_type: body.eventType || "wedding",
      event_date: body.eventDate || null,
      couple_name_a: body.name.trim(),
      status: "intake",
    })
    .select("id, magic_token")
    .single();

  if (eventErr || !event) {
    return NextResponse.json({ error: "EVENT_CREATE_FAILED", detail: eventErr?.message }, { status: 500 });
  }

  // 5. Create portal_token
  const { data: portalToken, error: tokenErr } = await supabase
    .from("portal_tokens")
    .insert({
      event_id: event.id,
      contact_id: contactId,
    })
    .select("token")
    .single();

  if (tokenErr || !portalToken) {
    return NextResponse.json({ error: "TOKEN_CREATE_FAILED", detail: tokenErr?.message }, { status: 500 });
  }

  // 6. Log activity
  await supabase.from("activity_log").insert({
    entity_type: "event",
    entity_id: event.id,
    action: "created",
    actor_type: "contact",
    actor_id: contactId,
    metadata: { source: "dj_link", dj_slug: body.djSlug },
  });

  return NextResponse.json({
    duplicate: false,
    token: portalToken.token,
    eventId: event.id,
    contactId,
  }, { status: 201 });
}
