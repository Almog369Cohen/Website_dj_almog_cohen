import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new NextResponse("NOT_AUTHENTICATED", { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabase = createServerSupabase();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new NextResponse("SESSION_EXPIRED", { status: 401 });
  }

  await supabase.from("spotify_connections").delete().eq("user_id", user.id);

  const res = NextResponse.json({ success: true });
  res.cookies.delete("compakt_spotify");
  return res;
}
