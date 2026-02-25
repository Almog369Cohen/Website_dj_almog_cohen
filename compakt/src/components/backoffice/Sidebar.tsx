"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BarChart3, Shield, ScrollText, UserCog, LayoutDashboard, X } from "lucide-react";
import { hasPermission, type BackofficePermission } from "@/lib/permissions";
import type { UserRole } from "@/lib/auth/roles";

interface SidebarProps {
  role: UserRole;
  onClose?: () => void;
}

const NAV_ITEMS: { href: string; label: string; icon: typeof LayoutDashboard; permission: BackofficePermission | null }[] = [
  { href: "/backoffice", label: "דשבורד", icon: LayoutDashboard, permission: "dashboard.read" },
  { href: "/backoffice/users", label: "משתמשים", icon: Users, permission: "users.read" },
  { href: "/backoffice/analytics", label: "אנליטיקות", icon: BarChart3, permission: "analytics.read" },
  { href: "/backoffice/team", label: "צוות", icon: UserCog, permission: "team.read" },
  { href: "/backoffice/audit", label: "יומן פעולות", icon: ScrollText, permission: "audit.read" },
];

export function Sidebar({ role, onClose }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(role, "backoffice", item.permission)
  );

  return (
    <aside className="w-64 h-full flex flex-col border-l border-glass bg-[var(--bg-primary)]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-glass">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-blue" />
          <span className="font-bold text-sm">Backoffice</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-muted hover:text-foreground transition-colors"
            aria-label="סגור תפריט"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "text-secondary hover:text-foreground hover:bg-[var(--bg-surface-hover)]"
                }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-3 border-t border-glass">
        <Link
          href="/admin"
          className="text-xs text-muted hover:text-secondary transition-colors"
        >
          חזרה לאדמין DJ →
        </Link>
      </div>
    </aside>
  );
}
