import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED", code: "NO_TOKEN" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabase = createServerSupabase();

  // Verify JWT and get user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "SESSION_EXPIRED", code: "INVALID_TOKEN" }, { status: 401 });
  }

  // Read profile (service role bypasses RLS)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({
      error: "NO_PROFILE",
      code: "PROFILE_MISSING",
      userId: user.id,
    }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email ?? "",
    role: profile.role,
    fullName: profile.full_name ?? "",
  });
}
