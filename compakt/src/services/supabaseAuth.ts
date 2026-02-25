import { useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import type { IAuthService } from "./types";
import { useAdminStore } from "@/stores/adminStore";
import { useDJStore } from "@/stores/djStore";
import type { DJProfile, PlanTier } from "@/lib/types";
import { getSafeOrigin } from "@/lib/utils";

type SupabaseClient = NonNullable<typeof supabase>;

function ensureSupabase(): SupabaseClient {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

async function fetchDJProfile(userId: string): Promise<DJProfile | null> {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    console.error("[auth] fetchDJProfile failed:", error);
    return null;
  }
  if (!data) return null;
  return {
    id: data.id,
    email: data.email ?? "",
    fullName: data.full_name ?? "",
    role: data.role ?? "dj",
    plan: (data.plan as PlanTier) ?? "free",
    djSlug: data.dj_slug ?? null,
    businessName: data.business_name ?? null,
    logoUrl: data.logo_url ?? null,
    coverUrl: data.cover_url ?? null,
    accentColor: data.accent_color ?? "#059cc0",
    tagline: data.tagline ?? null,
    bio: data.bio ?? null,
    instagramUrl: data.instagram_url ?? null,
    tiktokUrl: data.tiktok_url ?? null,
    websiteUrl: data.website_url ?? null,
    whatsappNumber: data.whatsapp_number ?? null,
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
    onboardingComplete: data.onboarding_complete ?? false,
  };
}

async function fetchDJProfileViaApi(bearer: string): Promise<DJProfile | null> {
  const res = await fetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${bearer}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("[auth] /api/auth/me failed:", res.status, body);
    return null;
  }

  const data = (await res.json()) as DJProfile;
  return data;
}

export function useSupabaseAuthService(): IAuthService {
  const setAuthenticated = useAdminStore((s) => s.setAuthenticated);
  const setProfile = useDJStore((s) => s.setProfile);

  return useMemo(() => ({
    isAuthenticated: () => {
      return useAdminStore.getState().isAuthenticated;
    },

    loginWithGoogle: async () => {
      try {
        const client = ensureSupabase();
        const { error } = await client.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${getSafeOrigin()}/admin`,
            queryParams: { access_type: "offline", prompt: "consent" },
          },
        });
        if (error) return { ok: false, error: error.message };
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
      }
    },

    fetchProfile: async () => {
      try {
        const client = ensureSupabase();
        const { data: session } = await client.auth.getSession();
        const bearer = session.session?.access_token;
        if (!bearer) return null;

        // Prefer server-backed fetch (service role) so missing profile rows don't break admin.
        const apiProfile = await fetchDJProfileViaApi(bearer);
        if (apiProfile) {
          setProfile(apiProfile);
          return apiProfile;
        }

        // Fallback: client-side fetch (RLS)
        const { data: { user } } = await client.auth.getUser();
        if (!user) return null;
        const profile = await fetchDJProfile(user.id);
        if (profile) setProfile(profile);
        return profile;
      } catch {
        return null;
      }
    },

    login: async (email, password) => {
      try {
        const client = ensureSupabase();
        const { data: authData, error } = await client.auth.signInWithPassword({ email, password });
        if (error) return { ok: false, error: error.message };
        setAuthenticated(true);

        let role = "dj";
        const bearer = authData.session?.access_token;
        if (bearer) {
          const apiProfile = await fetchDJProfileViaApi(bearer);
          if (apiProfile) {
            role = apiProfile.role;
            setProfile(apiProfile);
          }
        } else if (authData.user) {
          const profile = await fetchDJProfile(authData.user.id);
          if (profile) {
            role = profile.role;
            setProfile(profile);
          }
        }

        return { ok: true, role };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
      }
    },

    sendPasswordReset: async (email) => {
      try {
        const client = ensureSupabase();
        const origin = getSafeOrigin();
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
      useDJStore.getState().clear();
      void supabase.auth.signOut();
    },
  }), [setAuthenticated, setProfile]);
}
