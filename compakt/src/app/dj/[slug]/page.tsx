"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Loader2, Heart, Star, PartyPopper, Briefcase, Music, Instagram, Globe, MessageCircle, Quote, Play, ChevronLeft, ChevronRight, ExternalLink, Headphones, Video, Link2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { EventType, DJCustomLink, DJGalleryPhoto } from "@/lib/types";

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
  soundcloudUrl: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  customLinks: DJCustomLink[];
  galleryPhotos: DJGalleryPhoto[];
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

  // Gallery carousel + CTA state (must be before early returns)
  const [showForm, setShowForm] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>();

  const validPhotos = dj?.galleryPhotos?.filter((p) => p.url) ?? [];

  const nextSlide = useCallback(() => {
    if (validPhotos.length <= 1) return;
    setCarouselIdx((i) => (i + 1) % validPhotos.length);
  }, [validPhotos.length]);

  const prevSlide = useCallback(() => {
    if (validPhotos.length <= 1) return;
    setCarouselIdx((i) => (i - 1 + validPhotos.length) % validPhotos.length);
  }, [validPhotos.length]);

  // Auto-play carousel
  useEffect(() => {
    if (validPhotos.length <= 1) return;
    autoPlayRef.current = setInterval(nextSlide, 4000);
    return () => clearInterval(autoPlayRef.current);
  }, [nextSlide, validPhotos.length]);

  useEffect(() => {
    if (!supabase || !slug) return;

    async function loadDJ() {
      const { data, error } = await supabase!
        .from("profiles")
        .select("id, business_name, tagline, accent_color, logo_url, dj_slug, cover_url, bio, instagram_url, tiktok_url, website_url, whatsapp_number, soundcloud_url, spotify_url, youtube_url, custom_links, gallery_photos, reviews")
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
          soundcloudUrl: data.soundcloud_url ?? null,
          spotifyUrl: data.spotify_url ?? null,
          youtubeUrl: data.youtube_url ?? null,
          customLinks: Array.isArray(data.custom_links) ? data.custom_links : [],
          galleryPhotos: Array.isArray(data.gallery_photos) ? data.gallery_photos : [],
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

  const socialLinks = [
    { url: dj.instagramUrl, icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
    { url: dj.tiktokUrl, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.5 3.96-1.74 5.37-1.35 1.54-3.5 2.27-5.52 1.92-1.95-.33-3.66-1.57-4.57-3.34-.87-1.7-.86-3.83-.01-5.54.8-1.59 2.31-2.73 4.09-3.04v4.05c-.46.16-.9.44-1.21.84-.33.43-.45 1.01-.3 1.53.18.66.74 1.17 1.39 1.32.74.16 1.56-.05 2.06-.61.47-.53.66-1.22.68-1.91v-19.4z" /></svg>, label: "TikTok" },
    { url: dj.spotifyUrl, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>, label: "Spotify" },
    { url: dj.soundcloudUrl, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.308c.013.06.045.09.104.09.057 0 .09-.03.099-.09l.201-1.308-.201-1.332c-.009-.06-.042-.094-.099-.094m1.83-1.229c-.063 0-.109.048-.116.109l-.209 2.555.209 2.445c.007.065.053.107.116.107.063 0 .11-.042.116-.107l.24-2.445-.24-2.555c-.006-.061-.053-.109-.116-.109m.922-.153c-.073 0-.121.058-.128.122l-.178 2.708.178 2.475c.007.067.055.115.128.115s.12-.048.128-.115l.201-2.475-.201-2.708c-.008-.064-.055-.122-.128-.122m.93-.132c-.079 0-.136.063-.143.134l-.163 2.84.163 2.49c.007.071.064.126.143.126.079 0 .134-.055.143-.126l.184-2.49-.184-2.84c-.009-.071-.064-.134-.143-.134m.928-.095c-.09 0-.151.071-.156.15l-.148 2.935.148 2.5c.005.079.066.141.156.141.09 0 .149-.062.156-.141l.17-2.5-.17-2.935c-.007-.079-.066-.15-.156-.15m.93-.07c-.098 0-.163.076-.168.159l-.132 3.005.132 2.505c.005.085.07.148.168.148.097 0 .163-.063.168-.148l.149-2.505-.149-3.005c-.005-.083-.071-.159-.168-.159m.963-.158c-.103 0-.176.083-.181.17l-.118 3.163.118 2.51c.005.088.078.157.181.157.104 0 .176-.069.181-.157l.135-2.51-.135-3.163c-.005-.087-.077-.17-.181-.17m.967-.118c-.112 0-.189.089-.194.181l-.102 3.281.102 2.51c.005.094.082.165.194.165.112 0 .189-.071.194-.165l.115-2.51-.115-3.281c-.005-.092-.082-.181-.194-.181m1.001-.103c-.12 0-.199.093-.204.19l-.088 3.384.088 2.516c.005.098.084.174.204.174.12 0 .2-.076.204-.174l.1-2.516-.1-3.384c-.004-.097-.084-.19-.204-.19m.976-.04c-.128 0-.211.099-.216.199l-.072 3.424.072 2.52c.005.102.088.18.216.18.128 0 .213-.078.216-.18l.084-2.52-.084-3.424c-.003-.1-.088-.199-.216-.199m1.01-.01c-.135 0-.221.104-.225.207l-.058 3.434.058 2.522c.004.105.09.185.225.185.134 0 .22-.08.225-.185l.065-2.522-.065-3.434c-.005-.103-.091-.207-.225-.207m6.157 2.571c-.285 0-.556.056-.804.157-.165-1.855-1.727-3.31-3.636-3.31-.498 0-.977.099-1.42.276-.168.066-.211.134-.214.268v6.518c.003.138.114.253.254.262h5.82c1.139 0 2.063-.936 2.063-2.087s-.924-2.084-2.063-2.084" /></svg>, label: "SoundCloud" },
    { url: dj.youtubeUrl, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>, label: "YouTube" },
    { url: dj.websiteUrl, icon: <Globe className="w-5 h-5" />, label: "Website" },
    { url: dj.whatsappNumber ? `https://wa.me/${dj.whatsappNumber.replace(/[^0-9]/g, '')}` : null, icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp", isWhatsapp: true },
  ].filter((s) => s.url);

  const linkIcons: Record<string, React.ReactNode> = {
    music: <Music className="w-5 h-5" />,
    video: <Video className="w-5 h-5" />,
    headphones: <Headphones className="w-5 h-5" />,
    play: <Play className="w-5 h-5" />,
    link: <ExternalLink className="w-5 h-5" />,
  };

  const validLinks = dj.customLinks?.filter((l) => l.url && l.title) ?? [];

  return (
    <div className="min-h-dvh gradient-hero" style={djStyle} dir="rtl">
      {/* ── Hero Cover ── */}
      <div className="relative">
        {dj.coverUrl ? (
          <div className="h-56 sm:h-64 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[var(--bg-primary)] z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dj.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-32 sm:h-40" />
        )}

        {/* Avatar */}
        <div className="max-w-md mx-auto px-4">
          <div className={`relative ${dj.coverUrl ? "-mt-16" : "-mt-4"} flex justify-center`}>
            {dj.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dj.logoUrl}
                alt={dj.businessName}
                className="w-28 h-28 rounded-full object-cover border-4 shadow-2xl"
                style={{ borderColor: dj.accentColor }}
              />
            ) : (
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center border-4 shadow-2xl"
                style={{
                  background: `${dj.accentColor}15`,
                  borderColor: `${dj.accentColor}40`,
                }}
              >
                <Music2 className="w-12 h-12" style={{ color: dj.accentColor }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-12">
        {/* ── Name & Tagline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4 mb-6"
        >
          <h1
            className="font-display text-3xl sm:text-4xl font-black tracking-tight"
            style={{ color: dj.accentColor }}
          >
            {dj.businessName}
          </h1>
          {dj.tagline && (
            <p className="text-secondary text-sm sm:text-base font-medium mt-1">{dj.tagline}</p>
          )}
        </motion.div>

        {/* ── Social Icons Bar ── */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2.5 mb-8"
          >
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.url!}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-2xl transition-all duration-200 hover:scale-110 ${(s as any).isWhatsapp
                  ? "bg-brand-green/10 text-brand-green hover:bg-brand-green/20"
                  : "bg-glass text-secondary hover:text-foreground hover:bg-glass-strong"
                  }`}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </motion.div>
        )}

        {/* ── Bio ── */}
        {dj.bio && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-5 mb-6 text-right relative overflow-hidden"
          >
            <Quote className="w-10 h-10 absolute -top-3 -right-3 rotate-180 opacity-10" style={{ color: dj.accentColor }} />
            <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap relative z-10">{dj.bio}</p>
          </motion.div>
        )}

        {/* ── Custom Links (sets, mixes) ── */}
        {validLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 mb-8"
          >
            {validLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-2xl border border-glass bg-glass hover:border-[var(--dj-accent)] hover:bg-[var(--dj-accent-light)] transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    background: `${dj.accentColor}15`,
                    color: dj.accentColor,
                  }}
                >
                  {linkIcons[link.icon] || <ExternalLink className="w-5 h-5" />}
                </div>
                <span className="text-sm font-medium text-foreground flex-1">{link.title}</span>
                <ExternalLink className="w-4 h-4 text-muted group-hover:text-[var(--dj-accent)] transition-colors" />
              </a>
            ))}
          </motion.div>
        )}

        {/* ── Photo Gallery Carousel ── */}
        {validPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <div className="relative rounded-2xl overflow-hidden" ref={carouselRef}>
              <div className="aspect-[16/10] relative bg-black/20">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={carouselIdx}
                    src={validPhotos[carouselIdx].url}
                    alt={validPhotos[carouselIdx].caption || "Gallery"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-contain bg-black/30"
                  />
                </AnimatePresence>

                {/* Caption */}
                {validPhotos[carouselIdx].caption && (
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-xs text-white/90 text-center">{validPhotos[carouselIdx].caption}</p>
                  </div>
                )}

                {/* Nav arrows */}
                {validPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() => { prevSlide(); clearInterval(autoPlayRef.current); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { nextSlide(); clearInterval(autoPlayRef.current); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Dots */}
              {validPhotos.length > 1 && (
                <div className="flex justify-center gap-1.5 py-2.5 bg-glass">
                  {validPhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCarouselIdx(i); clearInterval(autoPlayRef.current); }}
                      className={`w-2 h-2 rounded-full transition-all ${i === carouselIdx
                        ? "w-6"
                        : "bg-muted/30 hover:bg-muted/50"
                        }`}
                      style={i === carouselIdx ? { background: dj.accentColor } : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Reviews ── */}
        {dj.reviews && dj.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-xs font-bold text-muted mb-3 uppercase tracking-wider text-center">מה אומרים עלינו</h3>
            <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
              {dj.reviews.map((r: any, idx: number) => (
                <div key={idx} className="glass-card p-4 min-w-[240px] snap-center flex-shrink-0 text-right relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full rounded-full" style={{ background: dj.accentColor }} />
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm font-medium mb-3 italic leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <p className="text-xs text-muted font-bold">— {r.name} {r.event ? `(${r.event})` : ""}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CTA Button / Intake Form ── */}
        <AnimatePresence mode="wait">
          {!showForm && !duplicate ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.35 }}
              className="text-center"
            >
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${dj.accentColor}, ${dj.accentColor}cc)`,
                  boxShadow: `0 8px 32px ${dj.accentColor}40`,
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Music2 className="w-5 h-5" />
                  בואו ניצור את המסע המוזיקלי שלכם
                </span>
              </button>
              <p className="text-xs text-muted mt-3">מלאו כמה פרטים ומשם אנחנו מטפלים</p>
            </motion.div>
          ) : duplicate ? (
            <motion.div
              key="duplicate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-3xl mb-3">👋</div>
              <h2 className="font-display text-lg font-bold mb-2">ברוכים השבים!</h2>
              <p className="text-sm text-secondary mb-6">
                זיהינו שכבר התחלתם למלא פרטים בעבר. רוצים להמשיך מאיפה שעצרתם?
              </p>
              <div className="flex flex-col gap-3">
                {duplicate.existingToken && (
                  <button
                    onClick={handleContinueExisting}
                    className="w-full py-3 rounded-2xl font-bold text-white transition-all"
                    style={{ background: dj.accentColor, boxShadow: `0 4px 20px ${dj.accentColor}30` }}
                  >
                    חזרה להמשך עריכה
                  </button>
                )}
                <button onClick={handleCreateNew} className="w-full py-3 rounded-2xl font-medium border border-glass text-secondary hover:text-foreground transition-all">
                  צור פנייה חדשה
                </button>
                <button onClick={() => setDuplicate(null)} className="text-sm text-muted hover:text-secondary transition-colors">
                  חזרה
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="glass-card p-6"
            >
              <h2 className="font-display text-lg font-bold mb-1 text-center">
                מלאו כמה פרטים ונתחיל
              </h2>
              <p className="text-sm text-secondary mb-5 text-center">
                תוך דקה אתם בפנים
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">שם מלא *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="השם שלכם" className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">טלפון</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="050-1234567" className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors" dir="ltr" />
                </div>

                <div>
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

                <div>
                  <label className="block text-sm font-medium mb-1.5">תאריך אירוע (אופציונלי)</label>
                  <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground focus:outline-none focus:border-brand-blue transition-colors" dir="ltr" />
                </div>
              </div>

              {error && (
                <p className="text-xs text-center mt-3" style={{ color: "var(--accent-danger, #ef4444)" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="w-full py-3.5 rounded-2xl font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-5"
                style={{ background: dj.accentColor, boxShadow: `0 4px 20px ${dj.accentColor}30` }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                יאללה מתחילים!
              </button>

              <button type="button" onClick={() => setShowForm(false)} className="w-full text-center text-xs text-muted mt-3 hover:text-secondary transition-colors">
                חזרה
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted mt-8"
        >
          Powered by Compakt
        </motion.p>
      </div>
    </div>
  );
}
