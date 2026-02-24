"use client";

import { usePlan } from "@/hooks/usePlan";
import { motion } from "framer-motion";
import { Lock, Crown } from "lucide-react";
import Link from "next/link";
import type { PlanTier } from "@/lib/types";

interface FeatureGateProps {
  requiredPlan: PlanTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PLAN_ORDER: Record<PlanTier, number> = { free: 0, basic: 1, pro: 2 };
const PLAN_LABELS: Record<PlanTier, string> = { free: "חינם", basic: "Basic", pro: "Pro" };

export function FeatureGate({ requiredPlan, children, fallback }: FeatureGateProps) {
  const { plan } = usePlan();

  if (PLAN_ORDER[plan] >= PLAN_ORDER[requiredPlan]) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-6 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-full bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-5 h-5 text-brand-blue" />
        </div>
        <h3 className="font-display font-bold text-sm mb-1">
          זמין בחבילת {PLAN_LABELS[requiredPlan]} ומעלה
        </h3>
        <p className="text-xs text-muted mb-4">
          שדרגו כדי לפתוח את הפיצ׳ר הזה
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 btn-primary text-sm py-2 px-5"
        >
          <Crown className="w-4 h-4" />
          צפו בחבילות
        </Link>
      </div>
    </motion.div>
  );
}
