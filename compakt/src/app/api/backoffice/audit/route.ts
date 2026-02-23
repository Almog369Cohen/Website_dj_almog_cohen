import { NextResponse } from "next/server";
import { requireStaff } from "@/server/require-staff";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") ?? "25")));
  const action = url.searchParams.get("action") ?? "";
  const offset = (page - 1) * limit;

  const supabase = createServerSupabase();

  let builder = supabase
    .from("audit_logs")
    .select("*", { count: "exact" });

  if (action) {
    builder = builder.eq("action", action);
  }

  const { data: logs, count, error } = await builder
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    logs: logs ?? [],
    total: count ?? 0,
    page,
    limit,
  });
}
