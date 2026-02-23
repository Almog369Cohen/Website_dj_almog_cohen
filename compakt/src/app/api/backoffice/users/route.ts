import { NextResponse } from "next/server";
import { requireStaff } from "@/server/require-staff";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20")));
  const offset = (page - 1) * limit;

  const supabase = createServerSupabase();

  let builder = supabase
    .from("profiles")
    .select("id, full_name, role, created_at", { count: "exact" });

  if (query) {
    builder = builder.or(`full_name.ilike.%${query}%`);
  }

  const { data: profiles, count, error } = await builder
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch auth user emails for the profile IDs
  const userIds = (profiles ?? []).map((p) => p.id);
  let emailMap: Record<string, { email: string; lastSignIn: string | null }> = {};

  if (userIds.length > 0) {
    const { data: authData } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authData?.users) {
      for (const u of authData.users) {
        if (userIds.includes(u.id)) {
          emailMap[u.id] = {
            email: u.email ?? "",
            lastSignIn: u.last_sign_in_at ?? null,
          };
        }
      }
    }
  }

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name ?? "",
    email: emailMap[p.id]?.email ?? "",
    role: p.role,
    lastSignIn: emailMap[p.id]?.lastSignIn ?? null,
    createdAt: p.created_at,
  }));

  return NextResponse.json({
    users,
    total: count ?? 0,
    page,
    limit,
  });
}
