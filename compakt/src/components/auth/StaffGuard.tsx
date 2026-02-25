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

export function StaffGuard({ children }: StaffGuardProps) {
  const [status, setStatus] = useState<GuardStatus>({ state: "loading" });

  useEffect(() => {
    if (!supabase) {
      setStatus({ state: "error", message: "Supabase לא מוגדר — בדוק הגדרות סביבה" });
      return;
    }

    let cancelled = false;

    async function checkAccess() {
      setStatus({ state: "loading" });

      const { data: { session } } = await supabase!.auth.getSession();
      if (cancelled) return;

      if (!session) {
        setStatus({ state: "no_session" });
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase!
          .from("profiles")
          .select("role, full_name")
          .eq("id", session.user.id)
          .single();

        if (cancelled) return;

        if (profileError || !profile) {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        void checkAccess();
      } else {
        setStatus({ state: "no_session" });
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
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
