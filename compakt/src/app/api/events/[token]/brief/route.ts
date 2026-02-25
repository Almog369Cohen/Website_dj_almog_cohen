import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** GET /api/events/[token]/brief — DJ-authenticated: load full brief data for an event */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: eventId } = await params;
  const authHeader = req.headers.get("authorization");
  const accessToken = authHeader?.replace("Bearer ", "");

  if (!accessToken) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const supabase = createServerSupabase();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  // Load event (verify ownership)
  const { data: event } = await supabase
    .from("dj_events")
    .select("id, user_id, event_type, couple_name_a, couple_name_b, event_date, venue, city, current_stage, status, created_at, contact_phone, contact_role")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!event) {
    return NextResponse.json({ error: "EVENT_NOT_FOUND" }, { status: 404 });
  }

  // Load contact info
  const { data: contact } = await supabase
    .from("event_contacts")
    .select("name, phone, email")
    .eq("event_id", eventId)
    .maybeSingle();

  // Load swipes with song details
  const { data: swipes } = await supabase
    .from("event_swipes")
    .select("id, song_id, action, reason_chips, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  // Load the songs that were swiped
  const songIds = Array.from(new Set((swipes ?? []).map((s) => s.song_id)));
  let songs: Record<string, { title: string; artist: string; category: string; cover_url: string }> = {};
  if (songIds.length > 0) {
    const { data: songRows } = await supabase
      .from("dj_songs")
      .select("id, title, artist, category, cover_url")
      .in("id", songIds);
    if (songRows) {
      for (const s of songRows) {
        songs[s.id] = { title: s.title, artist: s.artist, category: s.category, cover_url: s.cover_url };
      }
    }
  }

  // Load answers
  const { data: answers } = await supabase
    .from("event_answers")
    .select("id, question_id, value, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  // Load questions for context
  const questionIds = Array.from(new Set((answers ?? []).map((a) => a.question_id)));
  let questions: Record<string, { question_he: string; question_type: string }> = {};
  if (questionIds.length > 0) {
    const { data: qRows } = await supabase
      .from("dj_questions")
      .select("id, question_he, question_type")
      .in("id", questionIds);
    if (qRows) {
      for (const q of qRows) {
        questions[q.id] = { question_he: q.question_he, question_type: q.question_type };
      }
    }
  }

  // Load requests
  const { data: requests } = await supabase
    .from("event_requests")
    .select("id, request_type, text, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  // Compose enriched swipes
  const enrichedSwipes = (swipes ?? []).map((sw) => ({
    id: sw.id,
    action: sw.action,
    reasonChips: sw.reason_chips ?? [],
    song: songs[sw.song_id] ?? { title: "?", artist: "?", category: "?", cover_url: "" },
  }));

  // Compose enriched answers
  const enrichedAnswers = (answers ?? []).map((a) => ({
    id: a.id,
    value: a.value,
    question: questions[a.question_id] ?? { question_he: "?", question_type: "?" },
  }));

  return NextResponse.json({
    event: {
      id: event.id,
      eventType: event.event_type,
      coupleNameA: event.couple_name_a,
      coupleNameB: event.couple_name_b,
      eventDate: event.event_date,
      venue: event.venue,
      city: event.city,
      currentStage: event.current_stage,
      status: event.status,
      createdAt: event.created_at,
      contactPhone: event.contact_phone ?? contact?.phone,
      contactName: contact?.name,
    },
    swipes: enrichedSwipes,
    answers: enrichedAnswers,
    requests: requests ?? [],
  });
}
