import { NextResponse } from "next/server";
import { requireUser, type AuthenticatedUser } from "./require-user";
import { isStaff } from "@/lib/auth/roles";
import { hasPermission, type Permission } from "@/lib/auth/permissions";

export async function requireStaff(request: Request): Promise<
  { user: AuthenticatedUser } | { error: NextResponse }
> {
  const result = await requireUser(request);
  if ("error" in result) return result;

  if (!isStaff(result.user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return result;
}

export async function requirePermission(request: Request, permission: Permission): Promise<
  { user: AuthenticatedUser } | { error: NextResponse }
> {
  const result = await requireUser(request);
  if ("error" in result) return result;

  if (!hasPermission(result.user.role, permission)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return result;
}
