import { NextResponse } from "next/server";
import { requirePermission } from "@/server/require-staff";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await requirePermission(request, "team.manage");
  if ("error" in auth) return auth.error;

  const supabase = createServerSupabase();

  const { data: staffProfiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .in("role", ["owner", "admin", "support", "accountant", "assistant"])
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch emails
  const userIds = (staffProfiles ?? []).map((p) => p.id);
  let emailMap: Record<string, string> = {};

  if (userIds.length > 0) {
    const { data: authData } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authData?.users) {
      for (const u of authData.users) {
        if (userIds.includes(u.id)) {
          emailMap[u.id] = u.email ?? "";
        }
      }
    }
  }

  const team = (staffProfiles ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name ?? "",
    email: emailMap[p.id] ?? "",
    role: p.role,
    createdAt: p.created_at,
  }));

  return NextResponse.json({ team });
}
