import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** PATCH /api/upsells/[id] — update an upsell */
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
  if (body.titleHe !== undefined || body.title_he !== undefined) update.title_he = body.titleHe ?? body.title_he;
  if (body.descriptionHe !== undefined || body.description_he !== undefined) update.description_he = body.descriptionHe ?? body.description_he;
  if (body.priceHint !== undefined || body.price_hint !== undefined) update.price_hint = body.priceHint ?? body.price_hint;
  if (body.ctaTextHe !== undefined || body.cta_text_he !== undefined) update.cta_text_he = body.ctaTextHe ?? body.cta_text_he;
  if (body.imageUrl !== undefined || body.image_url !== undefined) update.image_url = body.imageUrl ?? body.image_url;
  if (body.placement !== undefined) update.placement = body.placement;
  if (body.sortOrder !== undefined || body.sort_order !== undefined) update.sort_order = body.sortOrder ?? body.sort_order;
  if (body.isActive !== undefined || body.is_active !== undefined) update.is_active = body.isActive ?? body.is_active;

  const { data: upsell, error } = await supabase
    .from("dj_upsells")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ upsell });
}

/** DELETE /api/upsells/[id] — delete an upsell */
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
    .from("dj_upsells")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
