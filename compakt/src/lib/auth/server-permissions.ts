/**
 * Server-side permission checking for API routes.
 * Uses service role Supabase client to verify user role + permissions.
 */

import { createServerSupabase } from "@/lib/supabase/server";
import { hasPermission, type PermissionScope, type Permission } from "@/lib/permissions";

interface AuthResult {
  ok: true;
  userId: string;
  email: string;
  role: string;
}

interface AuthError {
  ok: false;
  error: string;
  status: number;
}

/**
 * Authenticate a request via Bearer token and return user info.
 */
export async function authenticateRequest(req: Request): Promise<AuthResult | AuthError> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, error: "NOT_AUTHENTICATED", status: 401 };
  }

  const supabase = createServerSupabase();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser(authHeader.slice(7));

  if (authErr || !user) {
    return { ok: false, error: "SESSION_EXPIRED", status: 401 };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    ok: true,
    userId: user.id,
    email: user.email ?? "",
    role: profile?.role ?? "dj",
  };
}

/**
 * Authenticate + check a specific permission. Returns AuthResult or AuthError.
 */
export async function checkPermission(
  req: Request,
  scope: PermissionScope,
  permission: Permission
): Promise<AuthResult | AuthError> {
  const auth = await authenticateRequest(req);
  if (!auth.ok) return auth;

  if (!hasPermission(auth.role, scope, permission)) {
    return { ok: false, error: "FORBIDDEN", status: 403 };
  }

  return auth;
}
