import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** GET /api/questions — list authenticated DJ's questions */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { data: questions, error } = await supabase
    .from("dj_questions")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ questions: questions ?? [] });
}

/** POST /api/questions — add a new question */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();

  const { data: question, error } = await supabase
    .from("dj_questions")
    .insert({
      user_id: user.id,
      question_he: body.questionHe ?? body.question_he ?? "",
      question_type: body.questionType ?? body.question_type ?? "single_select",
      event_type: body.eventType ?? body.event_type ?? null,
      options: body.options ?? null,
      slider_min: body.sliderMin ?? body.slider_min ?? null,
      slider_max: body.sliderMax ?? body.slider_max ?? null,
      slider_labels: body.sliderLabels ?? body.slider_labels ?? null,
      sort_order: body.sortOrder ?? body.sort_order ?? 999,
      is_active: body.isActive ?? body.is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ question }, { status: 201 });
}
