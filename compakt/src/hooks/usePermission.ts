"use client";

import { useViewer } from "@/components/auth/StaffGuard";
import { hasPermission, type PermissionScope, type Permission } from "@/lib/permissions";

/**
 * React hook to check if the current viewer has a specific permission.
 * Returns false if no viewer context is available.
 */
export function usePermission(permission: Permission, scope: PermissionScope = "admin"): boolean {
  const viewer = useViewer();
  if (!viewer) return false;
  return hasPermission(viewer.role, scope, permission);
}

/**
 * Check multiple permissions at once. Returns true if ALL are granted.
 */
export function usePermissions(permissions: Permission[], scope: PermissionScope = "admin"): boolean {
  const viewer = useViewer();
  if (!viewer) return false;
  return permissions.every((p) => hasPermission(viewer.role, scope, p));
}
