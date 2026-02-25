/**
 * Internal permissions system.
 * MVP: defaults baked in code (no DB query needed).
 * Future: can be overridden per-user via role_permissions table.
 */

import type { UserRole } from "@/lib/auth/roles";

export type PermissionScope = "admin" | "backoffice";

// Admin scope permissions (DJ panel)
export type AdminPermission =
  | "events.read"
  | "events.create"
  | "events.edit"
  | "events.archive"
  | "events.lock"
  | "songs.manage"
  | "questions.manage"
  | "upsells.manage"
  | "settings.edit"
  | "contacts.read";

// Backoffice scope permissions (HQ panel)
export type BackofficePermission =
  | "dashboard.read"
  | "users.read"
  | "users.manage"
  | "team.read"
  | "team.manage"
  | "clients.read"
  | "clients.phone_full"
  | "audit.read"
  | "recovery.execute"
  | "analytics.read"
  | "billing.read";

export type Permission = AdminPermission | BackofficePermission;

// ── Default permission matrix ──

const ADMIN_PERMISSIONS: Record<string, AdminPermission[]> = {
  dj: [
    "events.read", "events.create", "events.edit", "events.archive",
    "events.lock", "songs.manage", "questions.manage", "upsells.manage",
    "settings.edit", "contacts.read",
  ],
  assistant: [
    "events.read", "events.edit", "contacts.read",
  ],
  owner: [
    "events.read", "events.create", "events.edit", "events.archive",
    "events.lock", "songs.manage", "questions.manage", "upsells.manage",
    "settings.edit", "contacts.read",
  ],
  admin: [
    "events.read", "events.create", "events.edit", "events.archive",
    "events.lock", "songs.manage", "questions.manage", "upsells.manage",
    "settings.edit", "contacts.read",
  ],
};

const BACKOFFICE_PERMISSIONS: Record<string, BackofficePermission[]> = {
  support: [
    "dashboard.read", "users.read", "team.read", "clients.read",
    "audit.read", "analytics.read",
  ],
  accountant: [
    "dashboard.read", "users.read", "audit.read", "analytics.read",
    "billing.read",
  ],
  admin: [
    "dashboard.read", "users.read", "users.manage", "team.read",
    "team.manage", "clients.read", "clients.phone_full", "audit.read",
    "recovery.execute", "analytics.read", "billing.read",
  ],
  owner: [
    "dashboard.read", "users.read", "users.manage", "team.read",
    "team.manage", "clients.read", "clients.phone_full", "audit.read",
    "recovery.execute", "analytics.read", "billing.read",
  ],
};

/**
 * Check if a role has a specific permission in a scope.
 */
export function hasPermission(
  role: UserRole | string | null | undefined,
  scope: PermissionScope,
  permission: Permission
): boolean {
  if (!role) return false;

  const matrix = scope === "admin" ? ADMIN_PERMISSIONS : BACKOFFICE_PERMISSIONS;
  const perms = matrix[role];
  if (!perms) return false;

  return (perms as string[]).includes(permission);
}

/**
 * Get all permissions for a role in a scope.
 */
export function getPermissions(
  role: UserRole | string | null | undefined,
  scope: PermissionScope
): Permission[] {
  if (!role) return [];
  const matrix = scope === "admin" ? ADMIN_PERMISSIONS : BACKOFFICE_PERMISSIONS;
  return (matrix[role] ?? []) as Permission[];
}
