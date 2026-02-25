import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** GET /api/upsells — list authenticated DJ's upsells */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { data: upsells, error } = await supabase
    .from("dj_upsells")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ upsells: upsells ?? [] });
}

/** POST /api/upsells — add a new upsell */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();

  const { data: upsell, error } = await supabase
    .from("dj_upsells")
    .insert({
      user_id: user.id,
      title_he: body.titleHe ?? body.title_he ?? "",
      description_he: body.descriptionHe ?? body.description_he ?? "",
      price_hint: body.priceHint ?? body.price_hint ?? null,
      cta_text_he: body.ctaTextHe ?? body.cta_text_he ?? "",
      image_url: body.imageUrl ?? body.image_url ?? null,
      placement: body.placement ?? "post_brief",
      sort_order: body.sortOrder ?? body.sort_order ?? 999,
      is_active: body.isActive ?? body.is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ upsell }, { status: 201 });
}
