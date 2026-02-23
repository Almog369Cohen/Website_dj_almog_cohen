"use client";

import { LogOut, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface HeaderProps {
  email: string;
  role: string;
  onMenuToggle?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  owner: "בעלים",
  admin: "מנהל",
  support: "תמיכה",
  accountant: "רו״ח",
  assistant: "עוזר",
};

export function Header({ email, role, onMenuToggle }: HeaderProps) {
  const handleLogout = () => {
    if (!supabase) return;
    void supabase.auth.signOut().then(() => {
      window.location.href = "/admin";
    });
  };

  return (
    <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 border-b border-glass bg-[var(--bg-primary)]/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-muted hover:text-foreground transition-colors"
            aria-label="תפריט"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-left">
          <p className="text-xs text-muted truncate max-w-[180px]">{email}</p>
          <p className="text-[10px] text-brand-blue font-medium">
            {ROLE_LABELS[role] ?? role}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-muted hover:text-foreground transition-colors"
          aria-label="התנתקות"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
