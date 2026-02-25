import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Use one client for login (this changes the client's auth context to the user)
    const authClient = createServerSupabase();
    const { data: authData, error: signInError } =
      await authClient.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 401 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Login failed" }, { status: 401 });
    }

    // Use a FRESH service-role client for profile read (bypasses RLS)
    const dbClient = createServerSupabase();
    const { data: profile, error: profileError } = await dbClient
      .from("profiles")
      .select("role, full_name")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const staffRoles = ["owner", "admin", "support", "accountant", "assistant"];
    if (!staffRoles.includes(profile.role)) {
      return NextResponse.json({ error: "NOT_STAFF" }, { status: 403 });
    }

    return NextResponse.json({
      role: profile.role,
      fullName: profile.full_name ?? "",
      session: authData.session,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    const envMissing = message.includes("[supabase/server] Missing") || message.includes("SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json(
      {
        error: envMissing ? "SERVER_ENV_MISSING" : message,
        code: envMissing ? "SERVER_ENV_MISSING" : "STAFF_LOGIN_INTERNAL",
      },
      { status: 500 }
    );
  }
}
