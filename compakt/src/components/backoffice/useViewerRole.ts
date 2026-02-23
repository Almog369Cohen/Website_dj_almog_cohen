"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/auth/roles";

interface ViewerInfo {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
}

export function useViewerRole(): ViewerInfo | null {
  const [viewer, setViewer] = useState<ViewerInfo | null>(null);

  useEffect(() => {
    if (!supabase) return;

    async function load() {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) return;

      // Use server-side API to read profile (bypasses RLS)
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) return;
      const data = await res.json();

      setViewer({
        id: data.id,
        email: data.email,
        role: data.role as UserRole,
        fullName: data.fullName ?? "",
      });
    }

    void load();
  }, []);

  return viewer;
}
