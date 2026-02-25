import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { defaultQuestions } from "@/data/questions";
import { defaultSongs } from "@/data/songs";

/**
 * POST /api/admin/seed-defaults
 * Seeds default questions and songs for the authenticated DJ.
 * Skips if data already exists. Safe to call multiple times.
 */
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

  const results = { questions: 0, songs: 0, skippedQuestions: false, skippedSongs: false };

  // 1. Check if DJ already has questions
  const { count: qCount } = await supabase
    .from("dj_questions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (qCount && qCount > 0) {
    results.skippedQuestions = true;
  } else {
    // Insert default questions
    const questionRows = defaultQuestions
      .filter((q) => q.isActive)
      .map((q) => ({
        user_id: user.id,
        question_he: q.questionHe,
        question_type: q.questionType,
        event_type: q.eventType,
        event_types: q.eventTypes ?? [q.eventType],
        options: q.options ?? null,
        slider_min: q.sliderMin ?? null,
        slider_max: q.sliderMax ?? null,
        slider_labels: q.sliderLabels
          ? { min: q.sliderLabels[0], max: q.sliderLabels[q.sliderLabels.length - 1] }
          : null,
        sort_order: q.sortOrder,
        is_active: true,
      }));

    if (questionRows.length > 0) {
      const { error: qErr } = await supabase.from("dj_questions").insert(questionRows);
      if (qErr) {
        console.error("[seed-defaults] questions insert error:", qErr.message);
        return NextResponse.json({ error: "QUESTIONS_INSERT_FAILED", detail: qErr.message }, { status: 500 });
      }
      results.questions = questionRows.length;
    }
  }

  // 2. Check if DJ already has songs
  const { count: sCount } = await supabase
    .from("dj_songs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (sCount && sCount > 0) {
    results.skippedSongs = true;
  } else {
    // Insert default songs
    const songRows = defaultSongs
      .filter((s) => s.isActive)
      .map((s) => ({
        user_id: user.id,
        title: s.title,
        artist: s.artist,
        cover_url: s.coverUrl,
        preview_url: s.previewUrl ?? "",
        clip_start_sec: null,
        clip_end_sec: null,
        external_link: s.externalLink ?? null,
        category: s.category,
        tags: s.tags,
        energy: s.energy,
        decade: s.decade ?? null,
        language: s.language,
        is_safe: s.isSafe,
        sort_order: s.sortOrder,
        is_active: true,
      }));

    if (songRows.length > 0) {
      const { error: sErr } = await supabase.from("dj_songs").insert(songRows);
      if (sErr) {
        console.error("[seed-defaults] songs insert error:", sErr.message);
        return NextResponse.json({ error: "SONGS_INSERT_FAILED", detail: sErr.message }, { status: 500 });
      }
      results.songs = songRows.length;
    }
  }

  return NextResponse.json({ ok: true, ...results });
}
