import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** POST /api/questions/reorder — batch update sort_order for questions */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();
  const ids: string[] = body.ids;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "INVALID_IDS" }, { status: 400 });
  }

  const updates = ids.map((id, i) =>
    supabase
      .from("dj_questions")
      .update({ sort_order: i + 1 })
      .eq("id", id)
      .eq("user_id", user.id)
  );

  await Promise.all(updates);

  return NextResponse.json({ ok: true });
}
