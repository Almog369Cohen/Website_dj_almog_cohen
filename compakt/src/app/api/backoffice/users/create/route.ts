import { NextResponse } from "next/server";
import { requirePermission } from "@/server/require-staff";
import { createServerSupabase } from "@/lib/supabase/server";
import { logAudit } from "@/server/audit";
import type { UserRole } from "@/lib/auth/roles";

const VALID_ROLES: UserRole[] = ["owner", "admin", "support", "accountant", "assistant", "dj"];

export async function POST(request: Request) {
  const auth = await requirePermission(request, "users.update");
  if ("error" in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password, fullName, role } = body as {
    email?: string;
    password?: string;
    fullName?: string;
    role?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const userRole = (role && VALID_ROLES.includes(role as UserRole) ? role : "dj") as UserRole;

  // Prevent non-owner from creating owner/admin
  if (["owner", "admin"].includes(userRole) && auth.user.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can create owner/admin users" },
      { status: 403 }
    );
  }

  const supabase = createServerSupabase();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName ?? "" },
  });

  if (authError) {
    // Supabase returns "User already registered" for duplicates
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user.id;

  // Update profile with role and full_name (trigger should have created the row)
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: userRole, full_name: fullName ?? null })
    .eq("id", userId);

  if (profileError) {
    console.error("[create-user] Profile update failed:", profileError.message);
  }

  await logAudit(auth.user.id, "user.create", userId, {
    email,
    role: userRole,
    fullName: fullName ?? "",
  });

  return NextResponse.json({
    id: userId,
    email,
    role: userRole,
    fullName: fullName ?? "",
  });
}
