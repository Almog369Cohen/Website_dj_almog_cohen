import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerSupabase();
  const { data: policies, error } = await supabase.rpc('get_policies'); // won't work without function
  
  const { data: pg_policies, error: e2 } = await supabase.from('pg_policies').select('*'); // no direct access
  return NextResponse.json({ ok: true });
}
