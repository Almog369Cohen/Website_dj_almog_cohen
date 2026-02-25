import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** GET /api/portal/[token] — load event + DJ data for portal */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!token) {
    return NextResponse.json({ error: "MISSING_TOKEN" }, { status: 400 });
  }

  const supabase = createServerSupabase();

  // 1. Find portal token
  const { data: portalToken, error: tokenErr } = await supabase
    .from("portal_tokens")
    .select("id, event_id, contact_id, is_active, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (tokenErr || !portalToken) {
    return NextResponse.json({ error: "TOKEN_NOT_FOUND" }, { status: 404 });
  }

  if (!portalToken.is_active) {
    return NextResponse.json({ error: "TOKEN_INACTIVE" }, { status: 403 });
  }

  if (portalToken.expires_at && new Date(portalToken.expires_at) < new Date()) {
    return NextResponse.json({ error: "TOKEN_EXPIRED" }, { status: 403 });
  }

  // 2. Update access tracking
  await supabase
    .from("portal_tokens")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("id", portalToken.id);

  // 3. Load event
  const { data: event, error: eventErr } = await supabase
    .from("dj_events")
    .select("id, user_id, event_type, couple_name_a, couple_name_b, event_date, venue, city, magic_token, current_stage, theme, status, locked_at, portal_closed_at, created_at")
    .eq("id", portalToken.event_id)
    .single();

  if (eventErr || !event) {
    return NextResponse.json({ error: "EVENT_NOT_FOUND" }, { status: 404 });
  }

  // Check if portal is closed (post-event)
  if (event.portal_closed_at) {
    return NextResponse.json({
      error: "PORTAL_CLOSED",
      closedAt: event.portal_closed_at,
    }, { status: 403 });
  }

  // Check if event is archived
  if (event.status === "archived") {
    return NextResponse.json({ error: "EVENT_ARCHIVED" }, { status: 403 });
  }

  // 4. Load DJ's songs
  const { data: songs } = await supabase
    .from("dj_songs")
    .select("id, title, artist, cover_url, preview_url, clip_start_sec, clip_end_sec, external_link, category, tags, energy, decade, language, is_safe, sort_order, is_active")
    .eq("user_id", event.user_id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // 5. Load DJ's questions
  const { data: questions } = await supabase
    .from("dj_questions")
    .select("id, question_he, question_type, event_type, event_types, options, slider_min, slider_max, slider_labels, sort_order, is_active")
    .eq("user_id", event.user_id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // 6. Load DJ's upsells
  const { data: upsells } = await supabase
    .from("dj_upsells")
    .select("id, title_he, description_he, price_hint, cta_text_he, image_url, placement, sort_order, is_active")
    .eq("user_id", event.user_id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // 7. Load DJ profile for branding
  const { data: djProfile } = await supabase
    .from("profiles")
    .select("id, business_name, tagline, accent_color, logo_url, dj_slug, whatsapp_number")
    .eq("id", event.user_id)
    .single();

  // 8. Load contact info
  const { data: contact } = await supabase
    .from("event_contacts")
    .select("id, name, phone, email")
    .eq("id", portalToken.contact_id)
    .maybeSingle();

  // 9. Load existing answers/swipes/requests for this event
  const [answersRes, swipesRes, requestsRes] = await Promise.all([
    supabase.from("event_answers").select("*").eq("event_id", event.id),
    supabase.from("event_swipes").select("*").eq("event_id", event.id),
    supabase.from("event_requests").select("*").eq("event_id", event.id),
  ]);

  return NextResponse.json({
    event,
    contact: contact ?? null,
    dj: djProfile ?? null,
    songs: songs ?? [],
    questions: questions ?? [],
    upsells: upsells ?? [],
    answers: answersRes.data ?? [],
    swipes: swipesRes.data ?? [],
    requests: requestsRes.data ?? [],
    isLocked: Boolean(event.locked_at),
  });
}

/** PATCH /api/portal/[token] — save event data from portal */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!token) {
    return NextResponse.json({ error: "MISSING_TOKEN" }, { status: 400 });
  }

  const supabase = createServerSupabase();

  // 1. Validate token
  const { data: portalToken } = await supabase
    .from("portal_tokens")
    .select("id, event_id, contact_id, is_active")
    .eq("token", token)
    .maybeSingle();

  if (!portalToken || !portalToken.is_active) {
    return NextResponse.json({ error: "TOKEN_INVALID" }, { status: 403 });
  }

  // 2. Check event is editable
  const { data: event } = await supabase
    .from("dj_events")
    .select("id, locked_at, portal_closed_at, status")
    .eq("id", portalToken.event_id)
    .single();

  if (!event) {
    return NextResponse.json({ error: "EVENT_NOT_FOUND" }, { status: 404 });
  }

  if (event.locked_at) {
    return NextResponse.json({ error: "EVENT_LOCKED" }, { status: 403 });
  }

  if (event.portal_closed_at || event.status === "archived") {
    return NextResponse.json({ error: "PORTAL_CLOSED" }, { status: 403 });
  }

  // 3. Parse body
  let body: {
    currentStage?: number;
    answers?: { questionId: string; answerValue: unknown }[];
    swipes?: { songId: string; action: string; reasonChips?: string[] }[];
    requests?: { requestType: string; content: string; momentType?: string }[];
    contactUpdate?: { name?: string; phone?: string; email?: string };
    eventUpdate?: { coupleNameA?: string; coupleNameB?: string; eventDate?: string; venue?: string; city?: string; contactPhone?: string; contactRole?: string };
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  // 4. Update event stage if provided
  if (body.currentStage !== undefined) {
    const stageUpdate: Record<string, unknown> = {
      current_stage: body.currentStage,
      updated_at: new Date().toISOString(),
    };

    // Auto-promote intake → active when couple starts the journey
    if (body.currentStage >= 1 && event.status === "intake") {
      stageUpdate.status = "active";
    }

    // Mark event as completed when couple reaches the final stage (MusicBrief)
    if (body.currentStage >= 4) {
      stageUpdate.status = "completed";
      stageUpdate.completed_at = new Date().toISOString();
    }

    await supabase
      .from("dj_events")
      .update(stageUpdate)
      .eq("id", event.id);
  }

  // 5. Update event fields if provided
  if (body.eventUpdate) {
    const u = body.eventUpdate;
    await supabase
      .from("dj_events")
      .update({
        ...(u.coupleNameA !== undefined && { couple_name_a: u.coupleNameA }),
        ...(u.coupleNameB !== undefined && { couple_name_b: u.coupleNameB }),
        ...(u.eventDate !== undefined && { event_date: u.eventDate || null }),
        ...(u.venue !== undefined && { venue: u.venue || null }),
        ...(u.city !== undefined && { city: u.city || null }),
        ...(u.contactPhone !== undefined && { contact_phone: u.contactPhone || null }),
        ...(u.contactRole !== undefined && { contact_role: u.contactRole || null }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", event.id);
  }

  // 6. Update contact if provided
  if (body.contactUpdate && portalToken.contact_id) {
    const c = body.contactUpdate;
    await supabase
      .from("event_contacts")
      .update({
        ...(c.name !== undefined && { name: c.name }),
        ...(c.phone !== undefined && { phone: c.phone || null }),
        ...(c.email !== undefined && { email: c.email || null }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", portalToken.contact_id);
  }

  // 7. Upsert answers
  if (body.answers?.length) {
    for (const ans of body.answers) {
      await supabase
        .from("event_answers")
        .upsert(
          {
            event_id: event.id,
            question_id: ans.questionId,
            answer_value: ans.answerValue,
            answered_at: new Date().toISOString(),
          },
          { onConflict: "event_id,question_id", ignoreDuplicates: false }
        );
    }
  }

  // 8. Upsert swipes
  if (body.swipes?.length) {
    for (const sw of body.swipes) {
      await supabase
        .from("event_swipes")
        .upsert(
          {
            event_id: event.id,
            song_id: sw.songId,
            action: sw.action,
            reason_chips: sw.reasonChips ?? [],
            swiped_at: new Date().toISOString(),
          },
          { onConflict: "event_id,song_id", ignoreDuplicates: false }
        );
    }
  }

  // 9. Replace requests (delete existing + insert new to avoid duplicates on auto-save)
  if (body.requests !== undefined) {
    await supabase.from("event_requests").delete().eq("event_id", event.id);
    if (body.requests.length > 0) {
      await supabase.from("event_requests").insert(
        body.requests.map((r) => ({
          event_id: event.id,
          request_type: r.requestType,
          content: r.content,
          moment_type: r.momentType || null,
        }))
      );
    }
  }

  // 10. Log activity
  await supabase.from("activity_log").insert({
    entity_type: "event",
    entity_id: event.id,
    action: "updated",
    actor_type: "contact",
    actor_id: portalToken.contact_id,
    metadata: {
      fields: Object.keys(body).filter((k) => k !== "contactUpdate"),
    },
  });

  return NextResponse.json({ ok: true });
}
