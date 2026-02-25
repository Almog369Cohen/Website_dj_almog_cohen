import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** GET /api/events/dashboard — returns aggregated stats for the authenticated DJ */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const supabase = createServerSupabase();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const userId = user.id;

  // Fetch all events for this DJ
  const { data: events } = await supabase
    .from("dj_events")
    .select("id, event_type, current_stage, status, is_archived, created_at, event_date, couple_name_a, couple_name_b, venue")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const allEvents = events ?? [];
  const active = allEvents.filter((e) => !e.is_archived && e.status !== "archived");
  const completed = allEvents.filter((e) => e.current_stage >= 4);
  const intake = allEvents.filter((e) => e.status === "intake");

  // Count songs & questions
  const { count: songCount } = await supabase
    .from("dj_songs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: questionCount } = await supabase
    .from("dj_questions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  // Count total swipes across all events
  const eventIds = allEvents.map((e) => e.id);
  let totalSwipes = 0;
  let totalLikes = 0;
  let totalAnswers = 0;
  let totalRequests = 0;

  if (eventIds.length > 0) {
    const { count: swipeCount } = await supabase
      .from("event_swipes")
      .select("id", { count: "exact", head: true })
      .in("event_id", eventIds);
    totalSwipes = swipeCount ?? 0;

    const { count: likeCount } = await supabase
      .from("event_swipes")
      .select("id", { count: "exact", head: true })
      .in("event_id", eventIds)
      .in("action", ["like", "super_like"]);
    totalLikes = likeCount ?? 0;

    const { count: answerCount } = await supabase
      .from("event_answers")
      .select("id", { count: "exact", head: true })
      .in("event_id", eventIds);
    totalAnswers = answerCount ?? 0;

    const { count: requestCount } = await supabase
      .from("event_requests")
      .select("id", { count: "exact", head: true })
      .in("event_id", eventIds);
    totalRequests = requestCount ?? 0;
  }

  // Recent events (last 5 active)
  const recentEvents = active.slice(0, 5).map((e) => ({
    id: e.id,
    eventType: e.event_type,
    names: [e.couple_name_a, e.couple_name_b].filter(Boolean).join(" & ") || "ללא שם",
    venue: e.venue,
    eventDate: e.event_date,
    stage: e.current_stage,
    status: e.status,
    createdAt: e.created_at,
  }));

  return NextResponse.json({
    kpis: {
      totalEvents: allEvents.length,
      activeEvents: active.length,
      completedBriefs: completed.length,
      intakeEvents: intake.length,
      totalSongs: songCount ?? 0,
      totalQuestions: questionCount ?? 0,
      totalSwipes,
      totalLikes,
      totalAnswers,
      totalRequests,
      likeRate: totalSwipes > 0 ? Math.round((totalLikes / totalSwipes) * 100) : 0,
    },
    recentEvents,
  });
}
