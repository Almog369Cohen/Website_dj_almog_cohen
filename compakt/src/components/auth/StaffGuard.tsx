"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import { isStaff } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/auth/roles";
import { Loader2 } from "lucide-react";

interface ViewerInfo {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
}

type GuardStatus =
  | { state: "loading" }
  | { state: "authorized"; viewer: ViewerInfo }
  | { state: "no_session" }
  | { state: "session_expired" }
  | { state: "no_profile" }
  | { state: "not_staff"; role: string }
  | { state: "error"; message: string };

const ViewerContext = createContext<ViewerInfo | null>(null);

export function useViewer(): ViewerInfo | null {
  return useContext(ViewerContext);
}

interface StaffGuardProps {
  children: ReactNode;
}

const STAFF_SESSION_KEY = "compakt-staff-session";
const CODE_SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

function getCodeSession(): ViewerInfo | null {
  try {
    const raw = localStorage.getItem(STAFF_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - (parsed.ts ?? 0) > CODE_SESSION_MAX_AGE) {
      localStorage.removeItem(STAFF_SESSION_KEY);
      return null;
    }
    return {
      id: parsed.id ?? "staff-code-access",
      email: parsed.email ?? "staff@compakt.app",
      role: (parsed.role ?? "owner") as UserRole,
      fullName: parsed.fullName ?? "Staff",
    };
  } catch {
    return null;
  }
}

export function StaffGuard({ children }: StaffGuardProps) {
  const [status, setStatus] = useState<GuardStatus>({ state: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      setStatus({ state: "loading" });

      // Check code-based session first (bypass)
      const codeViewer = getCodeSession();
      if (codeViewer) {
        if (!cancelled) setStatus({ state: "authorized", viewer: codeViewer });
        return;
      }

      if (!supabase) {
        setStatus({ state: "error", message: "Supabase לא מוגדר — בדוק הגדרות סביבה" });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!session) {
        setStatus({ state: "no_session" });
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", session.user.id)
          .single();

        if (cancelled) return;

        if (profileError || !profile) {
          console.error("[StaffGuard] Profile fetch failed:", {
            userId: session.user.id,
            email: session.user.email,
            errorCode: profileError?.code,
            errorMessage: profileError?.message,
            errorDetails: profileError?.details,
          });
          setStatus({ state: "no_profile" });
          return;
        }

        if (profile.role && isStaff(profile.role)) {
          setStatus({
            state: "authorized",
            viewer: {
              id: session.user.id,
              email: session.user.email ?? "",
              role: profile.role as UserRole,
              fullName: profile.full_name ?? "",
            },
          });
        } else {
          setStatus({ state: "not_staff", role: profile.role ?? "unknown" });
        }
      } catch {
        if (!cancelled) {
          setStatus({ state: "error", message: "שגיאת רשת — בדוק חיבור אינטרנט" });
        }
      }
    }

    void checkAccess();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          void checkAccess();
        } else if (!getCodeSession()) {
          setStatus({ state: "no_session" });
        }
      });

      return () => {
        cancelled = true;
        subscription.unsubscribe();
      };
    }

    return () => { cancelled = true; };
  }, []);

  if (status.state === "loading") {
    return (
      <div className="min-h-dvh gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto mb-3" />
          <p className="text-sm text-secondary">בודק הרשאות...</p>
        </div>
      </div>
    );
  }

  if (status.state === "authorized") {
    return (
      <ViewerContext.Provider value={status.viewer}>
        {children}
      </ViewerContext.Provider>
    );
  }

  // All other states → redirect to appropriate page
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    const reason = status.state;

    if (status.state === "no_session" || status.state === "session_expired") {
      // Redirect to staff login with return URL
      window.location.href = `/staff?redirect=${encodeURIComponent(currentPath)}`;
    } else {
      // Redirect to unauthorized with reason
      window.location.href = `/unauthorized?reason=${reason}&from=${encodeURIComponent(currentPath)}`;
    }
  }

  return null;
}
