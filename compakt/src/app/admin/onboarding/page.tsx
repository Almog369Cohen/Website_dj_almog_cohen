"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Palette, FileText, Check, ArrowLeft, Loader2, Music2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useDJStore } from "@/stores/djStore";
import { getSafeOrigin } from "@/lib/utils";

const ACCENT_COLORS = [
  "#059cc0", "#03b28c", "#d4627a", "#f5c542",
  "#8b5cf6", "#ef4444", "#f97316", "#06b6d4",
];

type Step = "name" | "brand" | "slug" | "done";

export default function OnboardingPage() {
  const router = useRouter();
  const profile = useDJStore((s) => s.profile);
  const setProfile = useDJStore((s) => s.setProfile);

  const [step, setStep] = useState<Step>("name");
  const [businessName, setBusinessName] = useState(profile?.businessName ?? "");
  const [tagline, setTagline] = useState(profile?.tagline ?? "");
  const [accentColor, setAccentColor] = useState(profile?.accentColor ?? "#059cc0");
  const [slug, setSlug] = useState(profile?.djSlug ?? "");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.onboardingComplete) {
      router.replace("/admin");
    }
  }, [profile, router]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0590-\u05ff]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30);
  };

  const handleNameNext = () => {
    if (!businessName.trim()) return;
    if (!slug) setSlug(generateSlug(businessName));
    setStep("brand");
  };

  const handleBrandNext = () => {
    setStep("slug");
  };

  const handleFinish = async () => {
    if (!supabase) return;
    setSaving(true);
    setSlugError(null);

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

    const { data: session } = await supabase.auth.getSession();
    const bearer = session.session?.access_token;
    if (!bearer) {
      setSlugError("ההתחברות פגה תוקף — התחברו מחדש");
      setSaving(false);
      return;
    }

    let res: Response;
    try {
      res = await fetch("/api/admin/onboarding/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify({
          businessName,
          tagline,
          accentColor,
          slug: cleanSlug,
        }),
      });
    } catch (e) {
      console.error("[onboarding] finish request failed:", e);
      setSlugError("שגיאה ברשת — נסו שוב");
      setSaving(false);
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const err = (body && (body as { error?: string }).error) || "";
      console.error("[onboarding] finish failed:", res.status, body);

      if (res.status === 409 && err === "SLUG_TAKEN") {
        setSlugError("הכתובת הזו כבר תפוסה, בחרו אחרת");
      } else if (res.status === 401) {
        setSlugError("ההתחברות פגה תוקף — התחברו מחדש");
      } else {
        setSlugError(err ? `שגיאה בשמירה: ${err}` : `שגיאה בשמירה (${res.status}) — נסו שוב`);
      }
      setSaving(false);
      return;
    }

    const updatedProfile = await res.json().catch(() => null);
    if (!updatedProfile) {
      setSlugError("שגיאה בשמירה (תגובה לא תקינה) — נסו שוב");
      setSaving(false);
      return;
    }

    setProfile(updatedProfile);
    setSaving(false);

    setStep("done");
    setTimeout(() => router.push("/admin"), 2000);
  };

  const steps: { id: Step; label: string }[] = [
    { id: "name", label: "שם" },
    { id: "brand", label: "מיתוג" },
    { id: "slug", label: "כתובת" },
  ];

  return (
    <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md"
      >
        {/* Progress */}
        {step !== "done" && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${s.id === step
                    ? "bg-brand-blue/15 border border-brand-blue/40 text-brand-blue"
                    : steps.indexOf(steps.find((x) => x.id === step)!) > i
                      ? "bg-brand-green/15 border border-brand-green/40 text-brand-green"
                      : "bg-white/5 border border-glass text-muted"
                    }`}
                >
                  {steps.indexOf(steps.find((x) => x.id === step)!) > i ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-8 h-0.5 rounded-full bg-glass" />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Business Name */}
          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-brand-blue" />
                </div>
                <h2 className="font-display text-xl font-black mb-1">ברוכים הבאים!</h2>
                <p className="text-sm text-secondary">בואו נגדיר את הפרופיל שלכם</p>
              </div>

              <div>
                <label className="block text-xs text-muted mb-1.5 font-medium">שם העסק / שם DJ</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="DJ Almog"
                  className="input-field"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs text-muted mb-1.5 font-medium">סלוגן / תיאור קצר (אופציונלי)</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="המוזיקה שלכם, הדרך שלכם"
                  className="input-field"
                />
              </div>

              <button
                onClick={handleNameNext}
                disabled={!businessName.trim()}
                className="btn-primary w-full disabled:opacity-40"
              >
                המשך
              </button>
            </motion.div>
          )}

          {/* Step 2: Branding */}
          {step === "brand" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-6 h-6 text-brand-blue" />
                </div>
                <h2 className="font-display text-xl font-black mb-1">מיתוג</h2>
                <p className="text-sm text-secondary">בחרו את הצבע שלכם</p>
              </div>

              <div>
                <label className="block text-xs text-muted mb-2 font-medium">צבע מותג</label>
                <div className="flex flex-wrap gap-3 justify-center">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-10 h-10 rounded-xl transition-all ${accentColor === color
                        ? "ring-2 ring-offset-2 ring-offset-[var(--bg-primary)] scale-110"
                        : "hover:scale-105"
                        }`}
                      style={{
                        background: color,
                        // @ts-expect-error -- Tailwind ring color via CSS var
                        "--tw-ring-color": color,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div
                className="glass-card p-4 text-center"
                style={{ borderColor: `${accentColor}40` }}
              >
                <p className="text-xs text-muted mb-1">תצוגה מקדימה</p>
                <h3 className="font-display font-black text-lg" style={{ color: accentColor }}>
                  {businessName || "שם העסק"}
                </h3>
                {tagline && <p className="text-xs text-secondary">{tagline}</p>}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("name")} className="btn-secondary flex-1 flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" />
                  חזרה
                </button>
                <button onClick={handleBrandNext} className="btn-primary flex-1">
                  המשך
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Slug */}
          {step === "slug" && (
            <motion.div
              key="slug"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-brand-blue" />
                </div>
                <h2 className="font-display text-xl font-black mb-1">כתובת אישית</h2>
                <p className="text-sm text-secondary">הלינק שתשלחו ללקוחות</p>
              </div>

              <div>
                <label className="block text-xs text-muted mb-1.5 font-medium">כתובת (באנגלית)</label>
                <div className="flex items-center gap-0 input-field !p-0 overflow-hidden">
                  <span className="text-xs text-muted px-3 py-3 bg-white/[0.03] border-l border-glass whitespace-nowrap" dir="ltr">
                    /dj/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                      setSlugError(null);
                    }}
                    placeholder="your-name"
                    dir="ltr"
                    className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm"
                  />
                </div>
                {slugError && (
                  <p className="text-xs mt-1" style={{ color: "var(--accent-danger)" }}>
                    {slugError}
                  </p>
                )}
                {slug && !slugError && (
                  <p className="text-xs text-muted mt-1" dir="ltr">
                    {getSafeOrigin()}/dj/{slug}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("brand")} className="btn-secondary flex-1 flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" />
                  חזרה
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  סיום
                </button>
              </div>
            </motion.div>
          )}

          {/* Done */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center mx-auto mb-4">
                <Music2 className="w-8 h-8 text-brand-green" />
              </div>
              <h2 className="font-display text-2xl font-black mb-2">הכל מוכן!</h2>
              <p className="text-secondary text-sm">מעביר לפאנל הניהול...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
