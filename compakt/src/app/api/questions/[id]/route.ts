import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** PATCH /api/questions/[id] — update a question */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();

  const update: Record<string, unknown> = {};
  if (body.questionHe !== undefined || body.question_he !== undefined) update.question_he = body.questionHe ?? body.question_he;
  if (body.questionType !== undefined || body.question_type !== undefined) update.question_type = body.questionType ?? body.question_type;
  if (body.eventType !== undefined || body.event_type !== undefined) update.event_type = body.eventType ?? body.event_type;
  if (body.eventTypes !== undefined || body.event_types !== undefined) update.event_types = body.eventTypes ?? body.event_types;
  if (body.options !== undefined) update.options = body.options;
  if (body.sliderMin !== undefined || body.slider_min !== undefined) update.slider_min = body.sliderMin ?? body.slider_min;
  if (body.sliderMax !== undefined || body.slider_max !== undefined) update.slider_max = body.sliderMax ?? body.slider_max;
  if (body.sliderLabels !== undefined || body.slider_labels !== undefined) update.slider_labels = body.sliderLabels ?? body.slider_labels;
  if (body.sortOrder !== undefined || body.sort_order !== undefined) update.sort_order = body.sortOrder ?? body.sort_order;
  if (body.isActive !== undefined || body.is_active !== undefined) update.is_active = body.isActive ?? body.is_active;

  const { data: question, error } = await supabase
    .from("dj_questions")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ question });
}

/** DELETE /api/questions/[id] — delete a question */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { error } = await supabase
    .from("dj_questions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
