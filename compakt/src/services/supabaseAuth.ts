import { supabase } from "@/lib/supabase/client";
import type { IAuthService } from "./types";
import { useAdminStore } from "@/stores/adminStore";

type SupabaseClient = NonNullable<typeof supabase>;

function ensureSupabase(): SupabaseClient {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export function useSupabaseAuthService(): IAuthService {
  const setAuthenticated = useAdminStore((s) => s.setAuthenticated);

  return {
    isAuthenticated: () => {
      return useAdminStore.getState().isAuthenticated;
    },

    login: async (email, password) => {
      try {
        const client = ensureSupabase();
        const { data: authData, error } = await client.auth.signInWithPassword({ email, password });
        if (error) return { ok: false, error: error.message };
        setAuthenticated(true);

        let role = "dj";
        if (authData.user) {
          const { data: profile } = await client
            .from("profiles")
            .select("role")
            .eq("id", authData.user.id)
            .single();
          if (profile?.role) role = profile.role;
        }

        return { ok: true, role };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
      }
    },

    sendPasswordReset: async (email) => {
      try {
        const client = ensureSupabase();
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const redirectTo = `${origin}/admin/reset-password`;
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) return { ok: false, error: error.message };
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
      }
    },

    updatePassword: async (newPassword) => {
      try {
        const client = ensureSupabase();
        const { error } = await client.auth.updateUser({ password: newPassword });
        if (error) return { ok: false, error: error.message };
        setAuthenticated(true);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
      }
    },

    logout: () => {
      if (!supabase) return;
      setAuthenticated(false);
      void supabase.auth.signOut();
    },
  };
}
