import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DJProfile, PlanTier, PlanLimits, Subscription } from "@/lib/types";
import { PLAN_LIMITS } from "@/lib/types";

interface DJStore {
  profile: DJProfile | null;
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;

  setProfile: (profile: DJProfile | null) => void;
  setSubscription: (sub: Subscription | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;

  // Computed helpers
  getPlan: () => PlanTier;
  getLimits: () => PlanLimits;
  isOnboarded: () => boolean;
}

export const useDJStore = create<DJStore>()(
  persist(
    (set, get) => ({
      profile: null,
      subscription: null,
      loading: false,
      error: null,

      setProfile: (profile) => set({ profile }),
      setSubscription: (sub) => set({ subscription: sub }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clear: () => set({ profile: null, subscription: null, loading: false, error: null }),

      getPlan: () => {
        const { profile, subscription } = get();
        if (subscription?.status === "active") return subscription.plan;
        return profile?.plan ?? "free";
      },

      getLimits: () => {
        const plan = get().getPlan();
        return PLAN_LIMITS[plan];
      },

      isOnboarded: () => {
        return get().profile?.onboardingComplete ?? false;
      },
    }),
    {
      name: "compakt-dj",
      partialize: (state) => ({
        profile: state.profile,
        subscription: state.subscription,
      }),
    }
  )
);
