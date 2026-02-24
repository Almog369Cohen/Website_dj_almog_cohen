import { useDJStore } from "@/stores/djStore";
import { PLAN_LIMITS } from "@/lib/types";
import type { PlanTier, PlanLimits } from "@/lib/types";

export function usePlan() {
  const profile = useDJStore((s) => s.profile);
  const subscription = useDJStore((s) => s.subscription);

  const plan: PlanTier = subscription?.status === "active"
    ? subscription.plan
    : profile?.plan ?? "free";

  const limits: PlanLimits = PLAN_LIMITS[plan];

  const canUseFeature = (feature: keyof PlanLimits): boolean => {
    const value = limits[feature];
    if (typeof value === "boolean") return value;
    return true; // numeric limits are checked separately
  };

  const isAtLimit = (feature: "eventsPerMonth" | "maxQuestions" | "maxUpsells", currentCount: number): boolean => {
    const limit = limits[feature];
    return currentCount >= limit;
  };

  const isPaid = plan !== "free";
  const isPro = plan === "pro";

  return {
    plan,
    limits,
    canUseFeature,
    isAtLimit,
    isPaid,
    isPro,
    profile,
  };
}
