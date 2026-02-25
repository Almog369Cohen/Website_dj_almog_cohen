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
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Loader2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
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
    eventTypes: (row.event_types as EventType[]) ?? undefined,
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

function JourneyApp() {
  const event = useEventStore((s) => s.event);
  const theme = useEventStore((s) => s.theme);
  const loadEvent = useEventStore((s) => s.loadEvent);
  const seedEvent = useEventStore((s) => s.seedFromServer);
  const seedAdmin = useAdminStore((s) => s.seedFromServer);
  const reset = useEventStore((s) => s.reset);
  const currentStage = event?.currentStage ?? 0;
  const [showReset, setShowReset] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  // Load event from magic link URL param — fetch from server
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Clear URL immediately
    window.history.replaceState({}, "", window.location.pathname);

    setServerLoading(true);
    setServerError(null);

    fetch(`/api/events/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error === "EVENT_NOT_FOUND" ? "הלינק לא תקין או שהאירוע לא נמצא" : "שגיאה בטעינת האירוע");
        }
        return res.json();
      })
      .then((data: { event: Record<string, unknown>; songs: Record<string, unknown>[]; questions: Record<string, unknown>[]; upsells: Record<string, unknown>[]; answers?: Record<string, unknown>[]; swipes?: Record<string, unknown>[]; requests?: Record<string, unknown>[] }) => {
        const ev = data.event;

        // Map existing answers/swipes/requests from DB rows
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
          contactPhone: ev.contact_phone as string | undefined,
          contactRole: ev.contact_role as string | undefined,
          currentStage: (ev.current_stage as number) ?? 0,
          theme: (ev.theme as "night" | "day") ?? "night",
          createdAt: ev.created_at as string,
          answers: existingAnswers,
          swipes: existingSwipes,
          requests: existingRequests,
        });

        seedAdmin({
          songs: data.songs.map(mapSong),
          questions: data.questions.map(mapQuestion),
          upsells: data.upsells.map(mapUpsell),
        });

        setServerLoading(false);
      })
      .catch((err) => {
        setServerError(err instanceof Error ? err.message : "שגיאה");
        setServerLoading(false);
      });
  }, [loadEvent, seedEvent, seedAdmin]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    reset();
    setShowReset(false);
    setShowResetConfirm(false);
  };

  const stageKey = !event ? "setup" : `stage-${currentStage}`;

  const renderStage = () => {
    if (!event) return <EventSetup />;
    switch (currentStage) {
      case 0: return <EventSetup />;
      case 1: return <QuestionFlow />;
      case 2: return <SongTinder />;
      case 3: return <DreamsRequests />;
      case 4: return <MusicBrief />;
      default: return <EventSetup />;
    }
  };

  // Server loading state
  if (serverLoading) {
    return (
      <main className="min-h-dvh gradient-hero flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto mb-3" />
          <p className="text-sm text-secondary">טוען את האירוע...</p>
        </div>
      </main>
    );
  }

  // Server error state
  if (serverError) {
    return (
      <main className="min-h-dvh gradient-hero flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-sm">
          <div className="text-4xl mb-3">😕</div>
          <h2 className="font-bold text-lg mb-2">אופס</h2>
          <p className="text-sm text-secondary mb-4">{serverError}</p>
          <a href="/event" className="btn-primary text-sm py-2.5 px-6 inline-block">
            חזרה לדף הראשי
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh gradient-hero relative">
      <AmbientBackground />
      {/* Top Controls */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        {event && (
          <button
            onClick={() => setShowReset(!showReset)}
            className="glass-card p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label="התחל מחדש"
          >
            <RotateCcw className="w-5 h-5 text-muted" />
          </button>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        open={showResetConfirm}
        title="להתחיל מחדש?"
        description="כל הנתונים יימחקו — שאלות, שירים ובקשות"
        icon={<RotateCcw className="w-8 h-8 text-muted" />}
        confirmText="כן, מחק הכל"
        cancelText="חזרה"
        danger
        onConfirm={confirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Stage Navigation */}
      {event && currentStage > 0 && currentStage <= 4 && (
        <div className="fixed top-4 right-4 left-28 z-40">
          <StageNav />
        </div>
      )}

      {/* Stage Content with transitions */}
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

export default function EventPage() {
  return (
    <HydrationGuard>
      <JourneyApp />
    </HydrationGuard>
  );
}
