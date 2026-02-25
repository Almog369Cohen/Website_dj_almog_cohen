"use client";

import { useState, useEffect } from "react";
import { useDJStore } from "@/stores/djStore";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  User,
  Palette,
  Link2,
  Save,
  Loader2,
  Check,
  Crown,
  Copy,
  Share2,
} from "lucide-react";
import type { PlanTier } from "@/lib/types";

const ACCENT_COLORS = [
  "#059cc0", "#03b28c", "#d4627a", "#f5c542",
  "#8b5cf6", "#ef4444", "#f97316", "#06b6d4",
];

const PLAN_LABELS: Record<PlanTier, string> = {
  free: "חינמי",
  basic: "בייסיק",
  pro: "פרו",
};

export function ProfileSettings() {
  const profile = useDJStore((s) => s.profile);
  const setProfile = useDJStore((s) => s.setProfile);

  const [businessName, setBusinessName] = useState(profile?.businessName ?? "");
  const [tagline, setTagline] = useState(profile?.tagline ?? "");
  const [accentColor, setAccentColor] = useState(profile?.accentColor ?? "#059cc0");
  const [slug, setSlug] = useState(profile?.djSlug ?? "");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state if profile loads later
  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName ?? "");
      setTagline(profile.tagline ?? "");
      setAccentColor(profile.accentColor ?? "#059cc0");
      setSlug(profile.djSlug ?? "");
    }
  }, [profile]);

  const djLink = slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/dj/${slug}`
    : null;

  const handleSave = async () => {
    if (!supabase || !profile) return;
    setSaving(true);
    setSlugError(null);
    setSaved(false);

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

    // Check slug uniqueness
    if (cleanSlug) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("dj_slug", cleanSlug)
        .neq("id", profile.id)
        .limit(1);

      if (existing && existing.length > 0) {
        setSlugError("הכתובת הזו כבר תפוסה, בחרו אחרת");
        setSaving(false);
        return;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: businessName.trim() || null,
        tagline: tagline.trim() || null,
        accent_color: accentColor,
        dj_slug: cleanSlug || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      setSlugError("שגיאה בשמירה, נסו שוב");
      setSaving(false);
      return;
    }

    // Update local store
    setProfile({
      ...profile,
      businessName: businessName.trim() || null,
      tagline: tagline.trim() || null,
      accentColor,
      djSlug: cleanSlug || null,
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const copyLink = async () => {
    if (!djLink) return;
    await navigator.clipboard.writeText(djLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  if (!profile) {
    return (
      <div className="glass-card p-8 text-center text-muted">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
        <p className="text-sm">טוען פרופיל...</p>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl bg-transparent border border-glass text-sm focus:outline-none focus:border-brand-blue transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-brand-blue" />
          הגדרות פרופיל
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-sm flex items-center gap-2 py-2.5 px-5"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "נשמר!" : "שמור שינויים"}
        </button>
      </div>

      {/* Account Info (read-only) */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4 text-brand-blue" />
          חשבון
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted block mb-0.5">אימייל</span>
            <span className="text-secondary" dir="ltr">{profile.email}</span>
          </div>
          <div>
            <span className="text-xs text-muted block mb-0.5">תפקיד</span>
            <span className="text-secondary">{profile.role}</span>
          </div>
          <div>
            <span className="text-xs text-muted block mb-0.5">חבילה</span>
            <span className="font-medium" style={{ color: "#059cc0" }}>
              {PLAN_LABELS[profile.plan] ?? profile.plan}
            </span>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="glass-card p-4 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <User className="w-4 h-4 text-brand-blue" />
          פרטי עסק
        </h3>

        <div>
          <label className="block text-xs text-muted mb-1.5 font-medium">שם העסק / שם DJ</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="DJ Almog"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1.5 font-medium">סלוגן / תיאור קצר</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="המוזיקה שלכם, הדרך שלכם"
            className={inputClass}
          />
        </div>
      </div>

      {/* Branding */}
      <div className="glass-card p-4 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Palette className="w-4 h-4 text-brand-blue" />
          מיתוג
        </h3>

        <div>
          <label className="block text-xs text-muted mb-2 font-medium">צבע מותג</label>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-10 h-10 rounded-xl transition-all ${
                  accentColor === color
                    ? "ring-2 ring-offset-2 ring-offset-[var(--bg-primary)] scale-110"
                    : "hover:scale-105"
                }`}
                style={{
                  background: color,
                  // @ts-expect-error -- ring color
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
      </div>

      {/* Slug / Link */}
      <div className="glass-card p-4 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Link2 className="w-4 h-4 text-brand-blue" />
          כתובת אישית
        </h3>

        <div>
          <label className="block text-xs text-muted mb-1.5 font-medium">כתובת (באנגלית)</label>
          <div className="flex items-center gap-0 rounded-xl border border-glass overflow-hidden">
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
        </div>

        {djLink && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
            <Link2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
            <code className="text-xs text-secondary truncate flex-1" dir="ltr">
              {djLink}
            </code>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`היי! הנה הלינק למסע המוזיקלי שלכם 🎵\n${djLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-md hover:bg-brand-green/10 transition-colors"
              title="שלח בוואטסאפ"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-green" />
            </a>
            <button
              onClick={copyLink}
              className="text-xs text-brand-blue hover:underline flex items-center gap-1"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? "הועתק" : "העתק"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
