import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** GET /api/events/[token] — public: load event + DJ's songs & questions by magic_token */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!token) {
    return NextResponse.json({ error: "MISSING_TOKEN" }, { status: 400 });
  }

  const supabase = createServerSupabase();

  // 1. Find event by magic_token
  const { data: event, error: eventErr } = await supabase
    .from("dj_events")
    .select("id, user_id, event_type, couple_name_a, couple_name_b, event_date, venue, city, magic_token, current_stage, theme, created_at")
    .eq("magic_token", token)
    .eq("is_archived", false)
    .maybeSingle();

  if (eventErr) {
    return NextResponse.json({ error: eventErr.message }, { status: 500 });
  }

  if (!event) {
    return NextResponse.json({ error: "EVENT_NOT_FOUND" }, { status: 404 });
  }

  // 2. Load DJ's songs for this event
  const { data: songs } = await supabase
    .from("dj_songs")
    .select("id, title, artist, cover_url, preview_url, clip_start_sec, clip_end_sec, external_link, category, tags, energy, decade, language, is_safe, sort_order, is_active")
    .eq("user_id", event.user_id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // 3. Load DJ's questions for this event type
  const { data: questions } = await supabase
    .from("dj_questions")
    .select("id, question_he, question_type, event_type, event_types, options, slider_min, slider_max, slider_labels, sort_order, is_active")
    .eq("user_id", event.user_id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // 4. Load DJ's upsells
  const { data: upsells } = await supabase
    .from("dj_upsells")
    .select("id, title_he, description_he, price_hint, cta_text_he, image_url, placement, sort_order, is_active")
    .eq("user_id", event.user_id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // 5. Load DJ profile for branding
  const { data: djProfile } = await supabase
    .from("profiles")
    .select("id, business_name, tagline, accent_color, logo_url, dj_slug, whatsapp_number")
    .eq("id", event.user_id)
    .single();

  // 6. Load existing answers/swipes/requests for this event
  const [answersRes, swipesRes, requestsRes] = await Promise.all([
    supabase.from("event_answers").select("*").eq("event_id", event.id),
    supabase.from("event_swipes").select("*").eq("event_id", event.id),
    supabase.from("event_requests").select("*").eq("event_id", event.id),
  ]);

  return NextResponse.json({
    event,
    songs: songs ?? [],
    questions: questions ?? [],
    upsells: upsells ?? [],
    dj: djProfile ?? null,
    answers: answersRes.data ?? [],
    swipes: swipesRes.data ?? [],
    requests: requestsRes.data ?? [],
  });
}
