"use client";

import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export function AuthGuard({ children, fallbackUrl = "/admin" }: AuthGuardProps) {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    if (!supabase) {
      setStatus("unauthenticated");
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "authenticated" : "unauthenticated");
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "authenticated" : "unauthenticated");
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-dvh gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = fallbackUrl;
    }
    return null;
  }

  return <>{children}</>;
}
