"use client";

import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import { isStaff } from "@/lib/auth/roles";
import { Loader2 } from "lucide-react";

interface StaffGuardProps {
  children: ReactNode;
}

export function StaffGuard({ children }: StaffGuardProps) {
  const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");

  useEffect(() => {
    if (!supabase) {
      setStatus("unauthorized");
      return;
    }

    let cancelled = false;

    async function checkAccess() {
      setStatus("loading");

      const { data: { session } } = await supabase!.auth.getSession();
      if (cancelled) return;

      if (!session) {
        setStatus("unauthorized");
        return;
      }

      // Use server-side API to read profile (bypasses RLS)
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (cancelled) return;

      if (!res.ok) {
        setStatus("unauthorized");
        return;
      }

      const data = await res.json();
      if (data.role && isStaff(data.role)) {
        setStatus("authorized");
      } else {
        setStatus("unauthorized");
      }
    }

    void checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      void checkAccess();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-dvh gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (status === "unauthorized") {
    if (typeof window !== "undefined") {
      window.location.href = "/unauthorized";
    }
    return null;
  }

  return <>{children}</>;
}
