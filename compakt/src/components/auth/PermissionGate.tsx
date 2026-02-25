"use client";

import type { ReactNode } from "react";
import { usePermission } from "@/hooks/usePermission";
import type { Permission, PermissionScope } from "@/lib/permissions";

interface PermissionGateProps {
  permission: Permission;
  scope?: PermissionScope;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally render children based on the current viewer's permissions.
 * If the viewer lacks the permission, renders fallback (or nothing).
 */
export function PermissionGate({
  permission,
  scope = "admin",
  children,
  fallback = null,
}: PermissionGateProps) {
  const allowed = usePermission(permission, scope);
  return allowed ? <>{children}</> : <>{fallback}</>;
}
