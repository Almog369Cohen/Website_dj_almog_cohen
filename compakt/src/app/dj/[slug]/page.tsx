"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Loader2, Heart, Star, PartyPopper, Briefcase, Music } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { EventType } from "@/lib/types";

interface DJPublicProfile {
  id: string;
  businessName: string;
  tagline: string | null;
  accentColor: string;
  logoUrl: string | null;
  slug: string;
}

const eventTypes: { type: EventType; label: string; icon: React.ReactNode }[] = [
  { type: "wedding", label: "חתונה", icon: <Heart className="w-4 h-4" /> },
  { type: "bar_mitzvah", label: "בר/בת מצווה", icon: <Star className="w-4 h-4" /> },
  { type: "private", label: "אירוע פרטי", icon: <PartyPopper className="w-4 h-4" /> },
  { type: "corporate", label: "אירוע עסקי", icon: <Briefcase className="w-4 h-4" /> },
  { type: "other", label: "אחר", icon: <Music className="w-4 h-4" /> },
];

interface DuplicateInfo {
  existingContactId: string;
  existingEventId: string;
  existingToken: string | null;
  existingStatus: string;
}

export default function DJClientPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [dj, setDJ] = useState<DJPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Intake form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [eventDate, setEventDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);

  useEffect(() => {
    if (!supabase || !slug) return;

    async function loadDJ() {
      const { data, error } = await supabase!
        .from("profiles")
        .select("id, business_name, tagline, accent_color, logo_url, dj_slug")
        .eq("dj_slug", slug)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setDJ({
          id: data.id,
          businessName: data.business_name ?? slug,
          tagline: data.tagline ?? null,
          accentColor: data.accent_color ?? "#059cc0",
          logoUrl: data.logo_url ?? null,
          slug: data.dj_slug ?? slug,
        });
      }
      setLoading(false);
    }

    loadDJ();
  }, [slug]);

  // Preselect event type from query param: /dj/[slug]?type=wedding|corporate|...
  useEffect(() => {
    const t = (searchParams.get("type") ?? "").toLowerCase();
    if (!t) return;

    const normalized = t === "henna" ? "private" : t;
    if (
      normalized === "wedding" ||
      normalized === "bar_mitzvah" ||
      normalized === "private" ||
      normalized === "corporate" ||
      normalized === "other"
    ) {
      setEventType(normalized as EventType);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("נא להזין שם");
      return;
    }

    setSubmitting(true);
    setError(null);
    setDuplicate(null);

    try {
      const res = await fetch("/api/portal/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          djSlug: slug,
          name: name.trim(),
          phone: phone.trim() || undefined,
          eventType,
          eventDate: eventDate || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error === "DJ_NOT_FOUND" ? "הדייג׳י לא נמצא" : "שגיאה ביצירת הפנייה");
        setSubmitting(false);
        return;
      }

      // Duplicate detected
      if (data.duplicate) {
        setDuplicate(data);
        setSubmitting(false);
        return;
      }

      // Success — redirect to portal
      router.push(`/portal/${data.token}`);
    } catch {
      setError("שגיאת רשת — נסו שוב");
      setSubmitting(false);
    }
  };

  const handleContinueExisting = () => {
    if (duplicate?.existingToken) {
      router.push(`/portal/${duplicate.existingToken}`);
    }
  };

  const handleCreateNew = async () => {
    setDuplicate(null);
    // Re-submit without phone to skip duplicate check
    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          djSlug: slug,
          name: name.trim(),
          eventType,
          eventDate: eventDate || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("שגיאה ביצירת הפנייה");
        setSubmitting(false);
        return;
      }
      router.push(`/portal/${data.token}`);
    } catch {
      setError("שגיאת רשת — נסו שוב");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center max-w-sm"
        >
          <div className="text-4xl mb-3">🎵</div>
          <h1 className="font-display text-xl font-black mb-2">לא נמצא</h1>
          <p className="text-sm text-secondary">
            הדף שחיפשתם לא קיים. בדקו את הלינק ונסו שוב.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!dj) return null;

  const djStyle = {
    "--dj-accent": dj.accentColor,
    "--dj-accent-light": `${dj.accentColor}20`,
  } as React.CSSProperties;

  return (
    <div className="min-h-dvh gradient-hero" style={djStyle} dir="rtl">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* DJ Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {dj.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dj.logoUrl}
              alt={dj.businessName}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2"
              style={{ borderColor: dj.accentColor }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
              style={{
                background: `${dj.accentColor}15`,
                borderColor: `${dj.accentColor}40`,
              }}
            >
              <Music2 className="w-8 h-8" style={{ color: dj.accentColor }} />
            </div>
          )}
          <h1
            className="font-display text-3xl font-black mb-1"
            style={{ color: dj.accentColor }}
          >
            {dj.businessName}
          </h1>
          {dj.tagline && (
            <p className="text-secondary text-sm">{dj.tagline}</p>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {duplicate ? (
            /* Duplicate detection dialog */
            <motion.div
              key="duplicate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-3xl mb-3">👋</div>
              <h2 className="font-display text-lg font-bold mb-2">
                מצאנו פנייה קיימת
              </h2>
              <p className="text-sm text-secondary mb-6">
                נראה שכבר יש פנייה עם מספר הטלפון הזה. רוצים להמשיך את הפנייה הקיימת?
              </p>
              <div className="flex flex-col gap-3">
                {duplicate.existingToken && (
                  <button
                    onClick={handleContinueExisting}
                    className="w-full py-3 rounded-2xl font-bold text-white transition-all"
                    style={{
                      background: dj.accentColor,
                      boxShadow: `0 4px 20px ${dj.accentColor}30`,
                    }}
                  >
                    המשך פנייה קיימת
                  </button>
                )}
                <button
                  onClick={handleCreateNew}
                  className="w-full py-3 rounded-2xl font-medium border border-glass text-secondary hover:text-foreground transition-all"
                >
                  צור פנייה חדשה
                </button>
                <button
                  onClick={() => setDuplicate(null)}
                  className="text-sm text-muted hover:text-secondary transition-colors"
                >
                  חזרה
                </button>
              </div>
            </motion.div>
          ) : (
            /* Intake form */
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="glass-card p-6"
            >
              <h2 className="font-display text-lg font-bold mb-1 text-center">
                בואו ניצור את המסע המוזיקלי שלכם
              </h2>
              <p className="text-sm text-secondary mb-6 text-center">
                מלאו כמה פרטים ונתחיל
              </p>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">שם מלא *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="השם שלכם"
                  className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">טלפון</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="050-1234567"
                  className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
                  dir="ltr"
                />
              </div>

              {/* Event Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">סוג אירוע</label>
                <div className="grid grid-cols-3 gap-2">
                  {eventTypes.map((et) => (
                    <button
                      key={et.type}
                      type="button"
                      onClick={() => setEventType(et.type)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-all ${eventType === et.type
                        ? "border-brand-blue bg-brand-blue/10 text-foreground"
                        : "border-glass text-secondary hover:border-glass-strong"
                        }`}
                    >
                      {et.icon}
                      {et.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5">תאריך אירוע (אופציונלי)</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground focus:outline-none focus:border-brand-blue transition-colors"
                  dir="ltr"
                />
              </div>

              {error && (
                <p className="text-xs text-center mb-3" style={{ color: "var(--accent-danger, #ef4444)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="w-full py-3.5 rounded-2xl font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: dj.accentColor,
                  boxShadow: `0 4px 20px ${dj.accentColor}30`,
                }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                יאללה מתחילים!
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted mt-6"
        >
          Powered by Compakt
        </motion.p>
      </div>
    </div>
  );
}
