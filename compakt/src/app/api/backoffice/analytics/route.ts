import { NextResponse } from "next/server";
import { requirePermission } from "@/server/require-staff";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await requirePermission(request, "analytics.read");
  if ("error" in auth) return auth.error;

  const supabase = createServerSupabase();
  const now = new Date();

  // Parallel queries for KPIs
  const [
    totalUsersRes,
    totalEventsRes,
    usersLast7dRes,
    usersLast30dRes,
    eventsLast7dRes,
    eventsLast30dRes,
    roleDistRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(now.getTime() - 7 * 86400000).toISOString()),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(now.getTime() - 30 * 86400000).toISOString()),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(now.getTime() - 7 * 86400000).toISOString()),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(now.getTime() - 30 * 86400000).toISOString()),
    supabase.from("profiles").select("role"),
  ]);

  // Role distribution
  const roleCounts: Record<string, number> = {};
  if (roleDistRes.data) {
    for (const p of roleDistRes.data) {
      roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1;
    }
  }

  // Daily signups last 14 days
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000).toISOString();
  const { data: recentProfiles } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", fourteenDaysAgo)
    .order("created_at", { ascending: true });

  const dailySignups: { date: string; count: number }[] = [];
  const dayMap = new Map<string, number>();
  for (const p of recentProfiles ?? []) {
    const day = new Date(p.created_at).toISOString().slice(0, 10);
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    dailySignups.push({ date: key, count: dayMap.get(key) ?? 0 });
  }

  return NextResponse.json({
    totalUsers: totalUsersRes.count ?? 0,
    totalEvents: totalEventsRes.count ?? 0,
    usersLast7d: usersLast7dRes.count ?? 0,
    usersLast30d: usersLast30dRes.count ?? 0,
    eventsLast7d: eventsLast7dRes.count ?? 0,
    eventsLast30d: eventsLast30dRes.count ?? 0,
    roleCounts,
    dailySignups,
  });
}
