import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** GET /api/songs — list authenticated DJ's songs */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { data: songs, error } = await supabase
    .from("dj_songs")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ songs: songs ?? [] });
}

/** POST /api/songs — add a new song */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();

  const { data: song, error } = await supabase
    .from("dj_songs")
    .insert({
      user_id: user.id,
      title: body.title ?? "",
      artist: body.artist ?? "",
      cover_url: body.coverUrl ?? body.cover_url ?? "",
      preview_url: body.previewUrl ?? body.preview_url ?? "",
      clip_start_sec: body.clipStartSec ?? body.clip_start_sec ?? null,
      clip_end_sec: body.clipEndSec ?? body.clip_end_sec ?? null,
      external_link: body.externalLink ?? body.external_link ?? null,
      category: body.category ?? "dancing",
      tags: body.tags ?? [],
      energy: body.energy ?? null,
      decade: body.decade ?? null,
      language: body.language ?? null,
      is_safe: body.isSafe ?? body.is_safe ?? true,
      sort_order: body.sortOrder ?? body.sort_order ?? 999,
      is_active: body.isActive ?? body.is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ song }, { status: 201 });
}
