import type { UserRole } from "./roles";

export type Permission =
  | "users.read"
  | "users.update"
  | "support.reset_password"
  | "analytics.read"
  | "team.manage"
  | "events.read"
  | "own_events.*"
  | "*";

const PERMISSION_MATRIX: Record<UserRole, Permission[]> = {
  owner: ["*"],
  admin: ["users.read", "users.update", "support.reset_password", "analytics.read", "team.manage", "events.read"],
  support: ["users.read", "support.reset_password", "events.read"],
  accountant: ["analytics.read"],
  assistant: ["users.read"],
  dj: ["own_events.*"],
};

export function hasPermission(role: UserRole | string | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const perms = PERMISSION_MATRIX[role as UserRole];
  if (!perms) return false;
  return perms.includes("*") || perms.includes(permission);
}

export function getPermissions(role: UserRole | string | null | undefined): Permission[] {
  if (!role) return [];
  return PERMISSION_MATRIX[role as UserRole] ?? [];
}
