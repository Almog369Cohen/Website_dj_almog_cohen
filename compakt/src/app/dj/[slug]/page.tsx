"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Loader2, Heart, Star, PartyPopper, Briefcase, Music, Instagram, Globe, MessageCircle, Quote, Play } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { EventType } from "@/lib/types";

interface DJPublicProfile {
  id: string;
  businessName: string;
  tagline: string | null;
  accentColor: string;
  logoUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  websiteUrl: string | null;
  whatsappNumber: string | null;
  reviews: any[];
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
        .select("id, business_name, tagline, accent_color, logo_url, dj_slug, cover_url, bio, instagram_url, tiktok_url, website_url, whatsapp_number, reviews")
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
          coverUrl: data.cover_url ?? null,
          bio: data.bio ?? null,
          instagramUrl: data.instagram_url ?? null,
          tiktokUrl: data.tiktok_url ?? null,
          websiteUrl: data.website_url ?? null,
          whatsappNumber: data.whatsapp_number ?? null,
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
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
          className="text-center mb-8 relative"
        >
          {dj.coverUrl ? (
            <div className="absolute inset-0 -top-8 -mx-4 h-48 -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)] z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dj.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-60" />
            </div>
          ) : null}

          {dj.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dj.logoUrl}
              alt={dj.businessName}
              className={`w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 shadow-xl ${dj.coverUrl ? "mt-12" : ""}`}
              style={{ borderColor: dj.accentColor }}
            />
          ) : (
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 shadow-xl ${dj.coverUrl ? "mt-12" : ""}`}
              style={{
                background: `${dj.accentColor}15`,
                borderColor: `${dj.accentColor}40`,
              }}
            >
              <Music2 className="w-10 h-10" style={{ color: dj.accentColor }} />
            </div>
          )}
          <h1
            className="font-display text-4xl font-black mb-2 tracking-tight"
            style={{ color: dj.accentColor }}
          >
            {dj.businessName}
          </h1>
          {dj.tagline && (
            <p className="text-secondary text-base font-medium mb-4">{dj.tagline}</p>
          )}

          {/* Social Links */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {dj.instagramUrl && (
              <a href={dj.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-glass hover:bg-glass-strong transition-colors text-secondary hover:text-foreground">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {dj.tiktokUrl && (
              <a href={dj.tiktokUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-glass hover:bg-glass-strong transition-colors text-secondary hover:text-foreground">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.5 3.96-1.74 5.37-1.35 1.54-3.5 2.27-5.52 1.92-1.95-.33-3.66-1.57-4.57-3.34-.87-1.7-.86-3.83-.01-5.54.8-1.59 2.31-2.73 4.09-3.04v4.05c-.46.16-.9.44-1.21.84-.33.43-.45 1.01-.3 1.53.18.66.74 1.17 1.39 1.32.74.16 1.56-.05 2.06-.61.47-.53.66-1.22.68-1.91v-19.4z" />
                </svg>
              </a>
            )}
            {dj.websiteUrl && (
              <a href={dj.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-glass hover:bg-glass-strong transition-colors text-secondary hover:text-foreground">
                <Globe className="w-5 h-5" />
              </a>
            )}
            {dj.whatsappNumber && (
              <a href={`https://wa.me/${dj.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-glass hover:bg-brand-green/20 transition-colors text-secondary hover:text-brand-green">
                <MessageCircle className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Bio */}
          {dj.bio && (
            <div className="glass-card p-5 mb-6 text-right relative overflow-hidden">
              <Quote className="w-8 h-8 absolute -top-2 -right-2 text-brand-blue/10 rotate-180" style={{ color: `${dj.accentColor}20` }} />
              <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap relative z-10">{dj.bio}</p>
            </div>
          )}

          {/* Reviews Mini-Carousel */}
          {dj.reviews && dj.reviews.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-bold text-muted mb-3 uppercase tracking-wider">מה זוגות אומרים</h3>
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {dj.reviews.map((r: any, idx: number) => (
                  <div key={idx} className="glass-card p-4 min-w-[240px] snap-center flex-shrink-0 text-right relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full" style={{ background: dj.accentColor }} />
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm font-medium mb-3 italic">"{r.text}"</p>
                    <p className="text-xs text-muted font-bold">— {r.name} {r.event ? `(${r.event})` : ""}</p>
                  </div>
                ))}
              </div>
            </div>
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
                ברוכים השבים!
              </h2>
              <p className="text-sm text-secondary mb-6">
                זיהינו שכבר התחלתם (או סיימתם) למלא פרטים בעבר עם המספר הזה. רוצים להמשיך מאיפה שעצרתם?
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
                    חזרה להמשך עריכה
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
