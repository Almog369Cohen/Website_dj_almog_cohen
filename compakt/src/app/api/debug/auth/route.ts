import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerSupabase();
    
    // Test auth user list
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers();
    
    // Test profiles list
    const { data: profiles, error: profErr } = await supabase.from("profiles").select("*");
    
    return NextResponse.json({ 
      authUsers: authData?.users?.length,
      profiles: profiles,
      authErr,
      profErr
    });
  } catch(e: any) {
    return NextResponse.json({ error: e.message });
  }
}
