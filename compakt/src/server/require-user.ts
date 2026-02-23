import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export async function requireUser(request: Request): Promise<
  { user: AuthenticatedUser } | { error: NextResponse }
> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const supabase = createServerSupabase();

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    user: {
      id: user.id,
      email: user.email ?? "",
      role: profile?.role ?? "dj",
    },
  };
}
