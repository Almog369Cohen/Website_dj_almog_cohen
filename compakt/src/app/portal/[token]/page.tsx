"use client";

import { useEventStore } from "@/stores/eventStore";
import { useAdminStore } from "@/stores/adminStore";
import { EventSetup } from "@/components/stages/EventSetup";
import { QuestionFlow } from "@/components/stages/QuestionFlow";
import { SongTinder } from "@/components/stages/SongTinder";
import { DreamsRequests } from "@/components/stages/DreamsRequests";
import { MusicBrief } from "@/components/stages/MusicBrief";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { StageNav } from "@/components/ui/StageNav";
import { HydrationGuard } from "@/components/ui/HydrationGuard";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Lock, CheckCircle2, Music2 } from "lucide-react";
import type { Song, Question, Upsell, EventType, SongCategory, QuestionType, MomentType } from "@/lib/types";

/* ── helpers to map snake_case DB rows → camelCase TS types ── */
function mapSong(row: Record<string, unknown>): Song {
  return {
    id: row.id as string,
    title: row.title as string,
    artist: row.artist as string,
    coverUrl: (row.cover_url as string) ?? "",
    previewUrl: row.preview_url as string | undefined,
    clipStartSec: row.clip_start_sec as number | undefined,
    clipEndSec: row.clip_end_sec as number | undefined,
    externalLink: row.external_link as string | undefined,
    category: (row.category as SongCategory) ?? "dancing",
    tags: (row.tags as string[]) ?? [],
    energy: (row.energy as number) ?? 3,
    decade: row.decade as string | undefined,
    language: (row.language as string) ?? "he",
    isSafe: (row.is_safe as boolean) ?? true,
    sortOrder: (row.sort_order as number) ?? 0,
    isActive: (row.is_active as boolean) ?? true,
  };
}

function mapQuestion(row: Record<string, unknown>): Question {
  return {
    id: row.id as string,
    questionHe: row.question_he as string,
    questionType: (row.question_type as QuestionType) ?? "single_select",
    eventType: (row.event_type as EventType) ?? "wedding",
    options: row.options as { label: string; value: string; icon?: string }[] | undefined,
    sliderMin: row.slider_min as number | undefined,
    sliderMax: row.slider_max as number | undefined,
    sliderLabels: row.slider_labels as string[] | undefined,
    sortOrder: (row.sort_order as number) ?? 0,
    isActive: (row.is_active as boolean) ?? true,
  };
}

function mapUpsell(row: Record<string, unknown>): Upsell {
  return {
    id: row.id as string,
    titleHe: row.title_he as string,
    descriptionHe: (row.description_he as string) ?? "",
    priceHint: row.price_hint as string | undefined,
    ctaTextHe: (row.cta_text_he as string) ?? "לפרטים",
    imageUrl: row.image_url as string | undefined,
    placement: (row.placement as "stage_4" | "post_brief" | "inline") ?? "stage_4",
    sortOrder: (row.sort_order as number) ?? 0,
    isActive: (row.is_active as boolean) ?? true,
  };
}

interface DJBranding {
  businessName: string;
  accentColor: string;
  logoUrl: string | null;
  tagline: string | null;
}

function PortalJourney() {
  const params = useParams();
  const token = params.token as string;

  const event = useEventStore((s) => s.event);
  const theme = useEventStore((s) => s.theme);
  const seedEvent = useEventStore((s) => s.seedFromServer);
  const seedAdmin = useAdminStore((s) => s.seedFromServer);
  const currentStage = event?.currentStage ?? 0;

  const [serverLoading, setServerLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [djBranding, setDJBranding] = useState<DJBranding | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [portalClosed, setPortalClosed] = useState(false);
  const fetchedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save function
  const saveToServer = useCallback(async () => {
    if (!token || isLocked) return;

    const state = useEventStore.getState();
    if (!state.event) return;

    setSaving(true);
    try {
      await fetch(`/api/portal/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStage: state.event.currentStage,
          eventUpdate: {
            coupleNameA: state.event.coupleNameA,
            coupleNameB: state.event.coupleNameB,
            eventDate: state.event.eventDate,
            venue: state.event.venue,
            city: state.event.city,
            contactPhone: state.event.contactPhone,
            contactRole: state.event.contactRole,
          },
          answers: state.answers.map((a) => ({
            questionId: a.questionId,
            answerValue: a.answerValue,
          })),
          swipes: state.swipes.map((s) => ({
            songId: s.songId,
            action: s.action,
            reasonChips: s.reasonChips,
          })),
          requests: state.requests.map((r) => ({
            requestType: r.requestType,
            content: r.content,
            momentType: r.momentType,
          })),
        }),
      });
    } catch (err) {
      console.error("[Portal] Save failed:", err);
    } finally {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [token, isLocked]);

  // Debounced auto-save: save 2s after last change
  useEffect(() => {
    if (!event || serverLoading) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void saveToServer();
    }, 2000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [event, event?.currentStage, saveToServer, serverLoading]);

  // Load portal data
  useEffect(() => {
    if (!token || fetchedRef.current) return;
    fetchedRef.current = true;

    setServerLoading(true);
    setServerError(null);

    fetch(`/api/portal/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const errCode = (data as { error?: string }).error;
          if (errCode === "TOKEN_NOT_FOUND") throw new Error("הלינק לא תקין");
          if (errCode === "TOKEN_INACTIVE" || errCode === "TOKEN_EXPIRED") throw new Error("הלינק פג תוקף");
          if (errCode === "PORTAL_CLOSED") throw new Error("הפורטל נסגר לאחר האירוע");
          if (errCode === "EVENT_ARCHIVED") throw new Error("האירוע הועבר לארכיון");
          if (errCode === "EVENT_LOCKED") throw new Error("האירוע נעול לעריכה");
          throw new Error("שגיאה בטעינה");
        }
        return res.json();
      })
      .then((data) => {
        const ev = data.event;
        // Map existing answers/swipes/requests from DB rows to store types
        const existingAnswers = ((data.answers ?? []) as Record<string, unknown>[]).map((a) => ({
          id: (a.id as string) ?? crypto.randomUUID(),
          eventId: a.event_id as string,
          questionId: a.question_id as string,
          answerValue: a.answer_value as string | string[] | number,
          answeredAt: (a.answered_at as string) ?? new Date().toISOString(),
        }));

        const existingSwipes = ((data.swipes ?? []) as Record<string, unknown>[]).map((s) => ({
          id: (s.id as string) ?? crypto.randomUUID(),
          eventId: s.event_id as string,
          songId: s.song_id as string,
          action: s.action as "like" | "dislike" | "super_like" | "unsure",
          reasonChips: (s.reason_chips as string[]) ?? [],
          swipedAt: (s.swiped_at as string) ?? new Date().toISOString(),
        }));

        const existingRequests = ((data.requests ?? []) as Record<string, unknown>[]).map((r) => ({
          id: (r.id as string) ?? crypto.randomUUID(),
          eventId: r.event_id as string,
          requestType: r.request_type as "free_text" | "do" | "dont" | "link" | "special_moment",
          content: r.content as string,
          momentType: r.moment_type as MomentType | undefined,
          createdAt: (r.created_at as string) ?? new Date().toISOString(),
        }));

        seedEvent({
          id: ev.id as string,
          magicToken: ev.magic_token as string,
          eventType: ev.event_type as EventType,
          eventDate: ev.event_date as string | undefined,
          venue: ev.venue as string | undefined,
          city: ev.city as string | undefined,
          coupleNameA: ev.couple_name_a as string | undefined,
          coupleNameB: ev.couple_name_b as string | undefined,
          currentStage: (ev.current_stage as number) ?? 0,
          theme: (ev.theme as "night" | "day") ?? "night",
          createdAt: ev.created_at as string,
          answers: existingAnswers,
          swipes: existingSwipes,
          requests: existingRequests,
        });

        seedAdmin({
          songs: (data.songs as Record<string, unknown>[]).map(mapSong),
          questions: (data.questions as Record<string, unknown>[]).map(mapQuestion),
          upsells: (data.upsells as Record<string, unknown>[]).map(mapUpsell),
        });

        setIsLocked(Boolean(data.isLocked));
        setPortalClosed(Boolean(data.isPortalClosed));

        if (data.dj) {
          setDJBranding({
            businessName: (data.dj.business_name as string) ?? "",
            accentColor: (data.dj.accent_color as string) ?? "#059cc0",
            logoUrl: (data.dj.logo_url as string) ?? null,
            tagline: (data.dj.tagline as string) ?? null,
          });
        }

        setServerLoading(false);
      })
      .catch((err) => {
        setServerError(err instanceof Error ? err.message : "שגיאה");
        setServerLoading(false);
      });
  }, [token, seedEvent, seedAdmin]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const stageKey = !event ? "setup" : `stage-${currentStage}`;

  const portalSetupProps = { portalMode: true, djName: djBranding?.businessName };

  const renderStage = () => {
    if (!event) return <EventSetup {...portalSetupProps} />;
    switch (currentStage) {
      case 0: return <EventSetup {...portalSetupProps} />;
      case 1: return <QuestionFlow />;
      case 2: return <SongTinder />;
      case 3: return <DreamsRequests />;
      case 4: return <MusicBrief />;
      default: return <EventSetup {...portalSetupProps} />;
    }
  };

  // Loading state
  if (serverLoading) {
    return (
      <main className="min-h-dvh gradient-hero flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto mb-3" />
          <p className="text-sm text-secondary">טוען...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (serverError) {
    return (
      <main className="min-h-dvh gradient-hero flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-sm">
          <div className="text-4xl mb-3">😕</div>
          <h2 className="font-bold text-lg mb-2">אופס</h2>
          <p className="text-sm text-secondary mb-4">{serverError}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm py-2.5 px-6"
            >
              נסו שוב
            </button>
            <a href="/" className="text-xs text-muted hover:text-foreground transition-colors">
              חזרה לדף הראשי
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-dvh gradient-hero relative"
      style={djBranding?.accentColor ? { "--dj-accent": djBranding.accentColor } as React.CSSProperties : undefined}
    >
      <AmbientBackground />

      {/* Top Controls */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        {/* Save indicator */}
        {saving && (
          <div className="glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-muted">
            <Loader2 className="w-3 h-3 animate-spin" />
            שומר...
          </div>
        )}
        {!saving && saved && (
          <div className="glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-brand-green">
            <CheckCircle2 className="w-3 h-3" />
            נשמר
          </div>
        )}
      </div>

      {/* DJ Branding header */}
      {djBranding && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {djBranding.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={djBranding.logoUrl}
              alt={djBranding.businessName}
              className="w-8 h-8 rounded-full object-cover border"
              style={{ borderColor: djBranding.accentColor }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border"
              style={{
                background: `${djBranding.accentColor}15`,
                borderColor: `${djBranding.accentColor}40`,
              }}
            >
              <Music2 className="w-4 h-4" style={{ color: djBranding.accentColor }} />
            </div>
          )}
          <span className="text-xs font-medium text-secondary hidden sm:inline">
            {djBranding.businessName}
          </span>
        </div>
      )}

      {/* Locked banner */}
      {isLocked && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center">
          <p className="text-xs text-amber-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            האירוע נעול לעריכה כרגע
          </p>
        </div>
      )}

      {/* Stage Navigation — shifted down to avoid DJ branding overlap */}
      {event && currentStage > 0 && currentStage <= 4 && (
        <div className={`fixed left-28 z-40 ${djBranding ? "top-14 right-4" : "top-4 right-4"}`}>
          <StageNav />
        </div>
      )}

      {/* Stage Content */}
      <div className="flex items-center justify-center min-h-dvh px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            <ErrorBoundary>
              {renderStage()}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function PortalPage() {
  return (
    <HydrationGuard>
      <PortalJourney />
    </HydrationGuard>
  );
}
