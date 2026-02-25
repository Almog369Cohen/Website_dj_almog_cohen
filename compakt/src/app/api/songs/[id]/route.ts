import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** PATCH /api/songs/[id] — update a song */
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

  // Build update object, only include fields that are present
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.artist !== undefined) update.artist = body.artist;
  if (body.coverUrl !== undefined || body.cover_url !== undefined) update.cover_url = body.coverUrl ?? body.cover_url;
  if (body.previewUrl !== undefined || body.preview_url !== undefined) update.preview_url = body.previewUrl ?? body.preview_url;
  if (body.clipStartSec !== undefined || body.clip_start_sec !== undefined) update.clip_start_sec = body.clipStartSec ?? body.clip_start_sec;
  if (body.clipEndSec !== undefined || body.clip_end_sec !== undefined) update.clip_end_sec = body.clipEndSec ?? body.clip_end_sec;
  if (body.externalLink !== undefined || body.external_link !== undefined) update.external_link = body.externalLink ?? body.external_link;
  if (body.category !== undefined) update.category = body.category;
  if (body.tags !== undefined) update.tags = body.tags;
  if (body.energy !== undefined) update.energy = body.energy;
  if (body.decade !== undefined) update.decade = body.decade;
  if (body.language !== undefined) update.language = body.language;
  if (body.isSafe !== undefined || body.is_safe !== undefined) update.is_safe = body.isSafe ?? body.is_safe;
  if (body.sortOrder !== undefined || body.sort_order !== undefined) update.sort_order = body.sortOrder ?? body.sort_order;
  if (body.isActive !== undefined || body.is_active !== undefined) update.is_active = body.isActive ?? body.is_active;

  const { data: song, error } = await supabase
    .from("dj_songs")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ song });
}

/** DELETE /api/songs/[id] — delete a song */
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
    .from("dj_songs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
