import { NextResponse } from "next/server";
import { requireStaff } from "@/server/require-staff";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireStaff(request);
  if ("error" in auth) return auth.error;

  const supabase = createServerSupabase();
  const userId = params.id;

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch auth user info
  const { data: authData } = await supabase.auth.admin.getUserById(userId);

  // Fetch events count
  const { count: eventsCount } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("dj_id", userId);

  // Fetch recent events
  const { data: recentEvents } = await supabase
    .from("events")
    .select("id, token, metadata, created_at")
    .eq("dj_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    id: profile.id,
    fullName: profile.full_name ?? "",
    email: authData?.user?.email ?? "",
    role: profile.role,
    lastSignIn: authData?.user?.last_sign_in_at ?? null,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    eventsCount: eventsCount ?? 0,
    recentEvents: recentEvents ?? [],
  });
}
