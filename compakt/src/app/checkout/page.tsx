"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Check, Loader2, ArrowLeft, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useDJStore } from "@/stores/djStore";
import type { PlanTier } from "@/lib/types";

const planInfo: Record<string, { name: string; price: number; color: string }> = {
  basic: { name: "Basic — בסיס", price: 8, color: "#059cc0" },
  pro: { name: "Pro — פרו", price: 20, color: "#03b28c" },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedPlan = (searchParams.get("plan") as PlanTier) || "basic";
  const plan = planInfo[selectedPlan];

  const [coupon, setCoupon] = useState("");
  const [validating, setValidating] = useState(false);
  const [activating, setActivating] = useState(false);
  const [couponValid, setCouponValid] = useState<boolean | null>(null);
  const [couponPlan, setCouponPlan] = useState<string | null>(null);
  const [couponDays, setCouponDays] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const setProfile = useDJStore((s) => s.setProfile);
  const profile = useDJStore((s) => s.profile);

  useEffect(() => {
    if (!plan) router.replace("/pricing");
  }, [plan, router]);

  const handleValidateCoupon = async () => {
    if (!coupon.trim()) return;
    setValidating(true);
    setError(null);
    setCouponValid(null);

    try {
      const resp = await fetch("/api/billing/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.trim() }),
      });

      const data = await resp.json();
      if (resp.ok && data.valid) {
        setCouponValid(true);
        setCouponPlan(data.plan);
        setCouponDays(data.durationDays);
        if (data.plan !== selectedPlan) {
          setError(`הקופון מתאים לחבילת ${data.plan === "pro" ? "Pro" : "Basic"} בלבד`);
          setCouponValid(false);
        }
      } else {
        setCouponValid(false);
        setError(data.message || "קופון לא תקין");
      }
    } catch {
      setError("שגיאה בבדיקת הקופון");
      setCouponValid(false);
    }
    setValidating(false);
  };

  const handleActivate = async () => {
    if (!couponValid || !supabase) return;
    setActivating(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("יש להתחבר קודם");
        setActivating(false);
        return;
      }

      const resp = await fetch("/api/billing/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plan: selectedPlan,
          couponCode: coupon.trim(),
        }),
      });

      const data = await resp.json();
      if (resp.ok && data.success) {
        setSuccess(true);
        if (profile) {
          setProfile({ ...profile, plan: data.plan as PlanTier });
        }
        setTimeout(() => router.push("/admin"), 2000);
      } else {
        setError(data.message || "שגיאה בהפעלת החבילה");
      }
    } catch {
      setError("שגיאה בהפעלת החבילה");
    }
    setActivating(false);
  };

  if (!plan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 w-full max-w-md"
    >
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        חזרה לחבילות
      </Link>

      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
          style={{ background: `${plan.color}20`, border: `1.5px solid ${plan.color}40` }}
        >
          <Sparkles className="w-6 h-6" style={{ color: plan.color }} />
        </div>
        <h1 className="font-display text-2xl font-black mb-1">{plan.name}</h1>
        <p className="text-secondary text-sm">
          <span className="font-display text-3xl font-black text-foreground">${plan.price}</span>
          <span className="text-muted mr-1">/חודש</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-brand-green" />
            </div>
            <h2 className="font-display text-xl font-black mb-2">החבילה הופעלה!</h2>
            <p className="text-secondary text-sm">
              {couponDays && `תוקף: ${couponDays} ימים`}
            </p>
            <p className="text-muted text-xs mt-2">מעביר לפאנל הניהול...</p>
          </motion.div>
        ) : (
          <motion.div key="form" className="space-y-5">
            <div>
              <label className="block text-xs text-muted mb-2 font-medium">
                <Tag className="w-3.5 h-3.5 inline ml-1" />
                קוד קופון
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value.toUpperCase());
                    setCouponValid(null);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleValidateCoupon()}
                  placeholder="הזינו קוד קופון"
                  dir="ltr"
                  className="flex-1 input-field text-center tracking-widest font-mono text-lg"
                />
                <button
                  onClick={handleValidateCoupon}
                  disabled={validating || !coupon.trim()}
                  className="btn-primary px-5 flex items-center gap-2"
                >
                  {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : "בדוק"}
                </button>
              </div>

              {couponValid === true && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-brand-green mt-2 flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  קופון תקין — {couponDays} ימים של {couponPlan === "pro" ? "Pro" : "Basic"}
                </motion.p>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm mt-2"
                  style={{ color: "var(--accent-danger)" }}
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              onClick={handleActivate}
              disabled={!couponValid || activating}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-40"
            >
              {activating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  הפעל חבילה
                </>
              )}
            </button>

            <p className="text-xs text-muted text-center">
              כרגע בתקופת פיילוט — הפעלה באמצעות קופון בלבד
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-muted" />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
