export type UserRole = "owner" | "admin" | "support" | "accountant" | "assistant" | "dj";

const STAFF_ROLES: UserRole[] = ["owner", "admin", "support", "accountant", "assistant"];

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "בעלים",
  admin: "מנהל",
  support: "תמיכה",
  accountant: "רו״ח",
  assistant: "עוזר",
  dj: "DJ",
};

export function isStaff(role: UserRole | string | null | undefined): boolean {
  return STAFF_ROLES.includes(role as UserRole);
}

export function canAccessBackoffice(role: UserRole | string | null | undefined): boolean {
  return isStaff(role);
}

export function canAccessAdmin(role: UserRole | string | null | undefined): boolean {
  if (!role) return false;
  return role === "dj" || role === "owner" || role === "admin";
}

export function getPostLoginRedirect(role: UserRole | string | null | undefined): string {
  if (isStaff(role)) return "/backoffice";
  return "/admin";
}
