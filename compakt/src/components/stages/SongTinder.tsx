"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useEventStore } from "@/stores/eventStore";
import { useAdminStore } from "@/stores/adminStore";
import { reasonChips } from "@/data/songs";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { Heart, X, Star, HelpCircle, Play, Pause, Volume2, SkipForward, SkipBack, ChevronLeft } from "lucide-react";
import type { SwipeAction, Song, SongSwipe, SongCategory } from "@/lib/types";
import { SwipeTutorial, useSwipeTutorial } from "@/components/ui/SwipeTutorial";
import { CircularProgress } from "@/components/ui/CircularProgress";

const SWIPE_THRESHOLD = 100;

const CATEGORY_ORDER: { key: SongCategory; label: string; emoji: string }[] = [
  { key: "reception", label: "קבלת פנים", emoji: "🥂" },
  { key: "ceremony", label: "טקס", emoji: "💍" },
  { key: "food", label: "אוכל", emoji: "🍽️" },
  { key: "dancing", label: "רחבה", emoji: "💃" },
];

export function SongTinder() {
  const saveSwipe = useEventStore((s) => s.saveSwipe);
  const getSwipedSongIds = useEventStore((s) => s.getSwipedSongIds);
  const swipes = useEventStore((s) => s.swipes);
  const setStage = useEventStore((s) => s.setStage);
  const trackEvent = useEventStore((s) => s.trackEvent);
  const setSwipes = useEventStore((s) => s.setSwipes);

  const adminSongs = useAdminStore((s) => s.songs);

  // Group active songs by category
  const categoryGroups = useMemo(() => {
    return CATEGORY_ORDER
      .map((cat) => ({
        ...cat,
        songs: adminSongs
          .filter((s) => s.isActive && s.category === cat.key)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
      }))
      .filter((g) => g.songs.length > 0);
  }, [adminSongs]);

  const [currentCatIdx, setCurrentCatIdx] = useState(0);
  const [showCategoryIntro, setShowCategoryIntro] = useState(true);
  const [skippedCategories, setSkippedCategories] = useState<Set<string>>(new Set());
  const [showReasons, setShowReasons] = useState(false);
  const [lastSwipedSongId, setLastSwipedSongId] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<SwipeAction | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSuperBurst, setShowSuperBurst] = useState(false);
  const { showTutorial, dismissTutorial } = useSwipeTutorial();

  const [lastUndo, setLastUndo] = useState<{
    songId: string;
    prevSwipes: SongSwipe[];
  } | null>(null);

  const swipedIds = getSwipedSongIds();
  const totalLikeCount = swipes.filter((s) => s.action === "like" || s.action === "super_like").length;

  // Current category data
  const currentGroup = categoryGroups[currentCatIdx];
  const allDone = !currentGroup;

  // Songs remaining in current category
  const categorySongs = currentGroup?.songs ?? [];
  const categoryRemaining = categorySongs.filter((s) => !swipedIds.includes(s.id));
  const categoryDone = currentGroup && categoryRemaining.length === 0;
  const categorySwipedCount = categorySongs.length - categoryRemaining.length;
  const categoryLikeCount = currentGroup
    ? swipes.filter(
      (sw) =>
        (sw.action === "like" || sw.action === "super_like") &&
        categorySongs.some((s) => s.id === sw.songId)
    ).length
    : 0;

  const currentSong = categoryRemaining[0];

  // Skip to first category that has remaining songs on mount
  useEffect(() => {
    if (showCategoryIntro || !currentGroup) return;
    if (categoryDone) {
      // Auto advance if current category is done
      advanceCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advanceCategory = useCallback(() => {
    setCurrentCatIdx((prev) => prev + 1);
    setShowCategoryIntro(true);
    setShowReasons(false);
    setLastSwipedSongId(null);
    setIsPlaying(false);
    setLastUndo(null);
  }, []);

  const handleSkipCategory = useCallback(() => {
    if (!currentGroup) return;
    setSkippedCategories((prev) => new Set(prev).add(currentGroup.key));
    trackEvent("category_skip", { category: currentGroup.key });
    advanceCategory();
  }, [currentGroup, trackEvent, advanceCategory]);

  const handleStartCategory = useCallback(() => {
    setShowCategoryIntro(false);
  }, []);

  const handleSwipe = useCallback(
    (songId: string, action: SwipeAction) => {
      setLastSwipedSongId(songId);
      setLastAction(action);

      if (action === "dislike") {
        setShowReasons(true);
        saveSwipe(songId, action, []);
      } else {
        saveSwipe(songId, action, []);
        setShowReasons(false);
        if (action === "super_like") {
          setShowSuperBurst(true);
          setTimeout(() => setShowSuperBurst(false), 1200);
        }
      }

      setLastUndo({ songId, prevSwipes: swipes });
      setIsPlaying(false);
      trackEvent("song_swipe", { songId, action, category: currentGroup?.key });

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(action === "super_like" ? [30, 50, 30] : 15);
      }
    },
    [saveSwipe, trackEvent, swipes, currentGroup]
  );

  const handleUndo = useCallback(() => {
    if (!lastUndo) return;
    setSwipes(lastUndo.prevSwipes);
    setShowReasons(false);
    setLastSwipedSongId(null);
    setLastAction(null);
    setIsPlaying(false);
    trackEvent("song_undo", { songId: lastUndo.songId });
    setLastUndo(null);
  }, [lastUndo, setSwipes, trackEvent]);

  useEffect(() => {
    if (allDone || showCategoryIntro || !currentSong) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showReasons) {
        setShowReasons(false);
        setLastSwipedSongId(null);
        return;
      }
      if (showReasons) return;
      switch (e.key) {
        case "ArrowRight":
          handleSwipe(currentSong.id, "like");
          break;
        case "ArrowLeft":
          handleSwipe(currentSong.id, "dislike");
          break;
        case "ArrowUp":
          handleSwipe(currentSong.id, "super_like");
          break;
        case "ArrowDown":
        case " ":
          e.preventDefault();
          handleSwipe(currentSong.id, "unsure");
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [allDone, showCategoryIntro, currentSong, handleSwipe, showReasons]);

  const handleReasonChip = useCallback(
    (chip: string) => {
      if (!lastSwipedSongId) return;
      const existing = swipes.find((s) => s.songId === lastSwipedSongId);
      if (existing) {
        const chips = existing.reasonChips.includes(chip)
          ? existing.reasonChips.filter((c) => c !== chip)
          : [...existing.reasonChips, chip];
        saveSwipe(lastSwipedSongId, existing.action, chips);
      }
    },
    [lastSwipedSongId, swipes, saveSwipe]
  );

  const dismissReasons = useCallback(() => {
    setShowReasons(false);
    setLastSwipedSongId(null);
  }, []);

  const handleFinish = () => {
    trackEvent("stage_complete", { stage: 2 });
    setStage(3);
  };

  // ── All categories done ──
  if (allDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center max-w-md mx-auto"
      >
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold mb-2">סיימנו את השירים!</h2>
        <p className="text-secondary text-sm mb-2">
          אהבתם {totalLikeCount} שירים
        </p>
        {/* Per-category summary */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {categoryGroups.map((g) => {
            const likes = swipes.filter(
              (sw) =>
                (sw.action === "like" || sw.action === "super_like") &&
                g.songs.some((s) => s.id === sw.songId)
            ).length;
            const skipped = skippedCategories.has(g.key);
            return (
              <span key={g.key} className="chip text-xs">
                {g.emoji} {g.label}: {skipped ? "דולג" : `${likes} ❤️`}
              </span>
            );
          })}
        </div>
        <p className="text-muted text-xs mb-6">
          עכשיו בואו נדבר על הרגעים המיוחדים
        </p>
        <button onClick={handleFinish} className="btn-primary w-full">
          המשיכו לבקשות →
        </button>
      </motion.div>
    );
  }

  // ── Category Intro Screen ──
  if (showCategoryIntro && currentGroup) {
    return (
      <motion.div
        key={`intro-${currentGroup.key}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="glass-card p-8 text-center max-w-md mx-auto"
      >
        <div className="text-5xl mb-4">{currentGroup.emoji}</div>
        <h2 className="font-display text-2xl font-black mb-1">{currentGroup.label}</h2>
        <p className="text-secondary text-sm mb-1">
          {categorySongs.length} שירים
          {categorySwipedCount > 0 && ` (${categorySwipedCount} כבר סומנו)`}
        </p>
        <p className="text-muted text-xs mb-6">
          החליקו ימינה לאהוב, שמאלה לדלג
        </p>

        {/* Category progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {categoryGroups.map((g, i) => (
            <div
              key={g.key}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i < currentCatIdx
                ? "bg-brand-green/30 ring-1 ring-brand-green/60"
                : i === currentCatIdx
                  ? "bg-brand-blue/30 ring-1 ring-brand-blue/60 shadow-[0_0_6px_rgba(5,156,192,0.3)]"
                  : "bg-white/5 ring-1 ring-white/10"
                }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleStartCategory}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {categoryRemaining.length === 0 ? "הבא" : "בואו נתחיל"}
          </button>
          <button
            onClick={handleSkipCategory}
            className="btn-secondary flex items-center gap-1.5 px-4"
          >
            <SkipForward className="w-4 h-4" />
            דלג
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Category complete → auto advance ──
  if (categoryDone && currentGroup) {
    return (
      <motion.div
        key={`done-${currentGroup.key}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center max-w-md mx-auto"
      >
        <div className="text-3xl mb-3">✅</div>
        <h2 className="font-display text-lg font-black mb-1">
          {currentGroup.emoji} {currentGroup.label} — סיימנו!
        </h2>
        <p className="text-secondary text-sm mb-4">
          אהבתם {categoryLikeCount} מתוך {categorySongs.length} שירים
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          {categoryGroups.map((g, i) => (
            <div
              key={g.key}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i <= currentCatIdx ? "bg-brand-green/30 ring-1 ring-brand-green/60" : "bg-white/5 ring-1 ring-white/10"
                }`}
            />
          ))}
        </div>

        <button
          onClick={advanceCategory}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {currentCatIdx < categoryGroups.length - 1 ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              לחלק הבא: {categoryGroups[currentCatIdx + 1]?.emoji} {categoryGroups[currentCatIdx + 1]?.label}
            </>
          ) : (
            "סיום ←"
          )}
        </button>
      </motion.div>
    );
  }

  if (!currentSong) return null;

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Swipe Tutorial */}
      <AnimatePresence>
        {showTutorial && <SwipeTutorial onDismiss={dismissTutorial} />}
      </AnimatePresence>

      {/* Category Header + Counters */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{currentGroup?.emoji}</span>
          <span className="text-xs font-bold text-foreground">{currentGroup?.label}</span>
          <span className="text-[11px] text-muted">
            {categorySwipedCount + 1}/{categorySongs.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Heart className="w-3.5 h-3.5 text-brand-green" fill="var(--accent-secondary)" />
            <span className="text-brand-green font-bold text-xs">{categoryLikeCount}</span>
          </div>
          <button
            onClick={handleUndo}
            disabled={!lastUndo}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${lastUndo ? "glass-card text-muted hover:text-brand-blue" : "opacity-40 cursor-not-allowed"
              }`}
            aria-label="בטל פעולה אחרונה"
          >
            ↩
          </button>
          <button
            onClick={handleSkipCategory}
            className="text-[11px] text-muted hover:text-brand-blue transition-colors flex items-center gap-0.5"
          >
            <SkipForward className="w-3 h-3" />
            דלג
          </button>
        </div>
      </div>

      {/* Category progress bar */}
      <div className="mx-2 mb-4 h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(to right, var(--accent-primary), var(--accent-secondary))" }}
          initial={false}
          animate={{ width: `${(categorySwipedCount / Math.max(1, categorySongs.length)) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* ── Effects Layer ── */}
      <AnimatePresence>
        {showSuperBurst && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-7xl">⭐</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Like effect — green pulse */}
      <AnimatePresence>
        {lastAction === "like" && !showReasons && (
          <motion.div
            key="like-fx"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-40 pointer-events-none rounded-[28px]"
            style={{ background: "radial-gradient(circle, rgba(3,178,140,0.3) 0%, transparent 70%)" }}
          />
        )}
      </AnimatePresence>

      {/* Unlike effect — red flash */}
      <AnimatePresence>
        {lastAction === "dislike" && showReasons && (
          <motion.div
            key="dislike-fx"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,68,102,0.2) 0%, transparent 70%)" }}
          />
        )}
      </AnimatePresence>

      {/* Card Stack */}
      <div className="relative h-[520px] w-full">
        {categoryRemaining[2] && (
          <div className="absolute inset-0 rounded-[28px] overflow-hidden scale-[0.88] opacity-20 translate-y-3"
            style={{ background: "rgba(10,10,20,0.8)" }}>
            <SongCardStatic song={categoryRemaining[2]} />
          </div>
        )}
        {categoryRemaining[1] && (
          <div className="absolute inset-0 rounded-[28px] overflow-hidden scale-[0.94] opacity-40 translate-y-1.5"
            style={{ background: "rgba(10,10,20,0.8)" }}>
            <SongCardStatic song={categoryRemaining[1]} />
          </div>
        )}
        <SwipeCard
          key={currentSong.id}
          song={currentSong}
          onSwipe={handleSwipe}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
        />
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex items-center justify-center gap-5 mt-5">
        {/* Dislike */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleSwipe(currentSong.id, "dislike")}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-shadow"
          style={{
            background: "linear-gradient(135deg, rgba(255,68,102,0.15), rgba(255,68,102,0.05))",
            border: "2px solid rgba(255,68,102,0.4)",
            color: "#ff4466",
            boxShadow: "0 0 20px rgba(255,68,102,0.1)",
          }}
          aria-label="לא אוהב"
        >
          <X className="w-7 h-7" strokeWidth={3} />
        </motion.button>

        {/* Unsure */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleSwipe(currentSong.id, "unsure")}
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1.5px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.4)",
          }}
          aria-label="לא בטוח"
        >
          <HelpCircle className="w-5 h-5" />
        </motion.button>

        {/* Super Like */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleSwipe(currentSong.id, "super_like")}
          className="w-13 h-13 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgba(255,200,50,0.15), rgba(255,200,50,0.05))",
            border: "2px solid rgba(255,200,50,0.4)",
            color: "#ffc832",
            boxShadow: "0 0 20px rgba(255,200,50,0.1)",
            width: "52px",
            height: "52px",
          }}
          aria-label="סופר לייק"
        >
          <Star className="w-6 h-6" fill="#ffc832" />
        </motion.button>

        {/* Like */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleSwipe(currentSong.id, "like")}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-shadow"
          style={{
            background: "linear-gradient(135deg, rgba(3,178,140,0.2), rgba(3,178,140,0.05))",
            border: "2px solid rgba(3,178,140,0.5)",
            color: "#03b28c",
            boxShadow: "0 0 20px rgba(3,178,140,0.15)",
          }}
          aria-label="אהבתי"
        >
          <Heart className="w-7 h-7" fill="#03b28c" />
        </motion.button>
      </div>

      {/* Keyboard Hints (desktop only) */}
      <div className="hidden sm:flex items-center justify-center gap-6 mt-2.5 text-[10px] text-white/25 font-mono">
        <span>← לא</span>
        <span>↓ דלג</span>
        <span>↑ סופר</span>
        <span>→ אהבתי</span>
      </div>

      {/* ── Reason Chips Bottom Sheet ── */}
      <AnimatePresence>
        {showReasons && lastAction === "dislike" && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 px-4 pb-8 pt-5"
            style={{
              background: "linear-gradient(to top, rgba(10,10,20,0.98) 0%, rgba(10,10,20,0.9) 80%, transparent 100%)",
            }}
          >
            <div className="max-w-md mx-auto">
              <p className="text-sm text-white/60 text-center mb-4 font-medium">למה לא? (אופציונלי)</p>
              <div className="flex flex-wrap gap-2.5 justify-center mb-5">
                {reasonChips.map((chip) => {
                  const swipe = swipes.find((s) => s.songId === lastSwipedSongId);
                  const chipActive = swipe?.reasonChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      onClick={() => handleReasonChip(chip)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
                      style={{
                        background: chipActive
                          ? "linear-gradient(135deg, rgba(255,68,102,0.25), rgba(255,68,102,0.1))"
                          : "rgba(255,255,255,0.06)",
                        border: chipActive
                          ? "1.5px solid rgba(255,68,102,0.5)"
                          : "1.5px solid rgba(255,255,255,0.1)",
                        color: chipActive ? "#ff6680" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={dismissReasons}
                className="w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                המשך →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SongCardStatic({ song }: { song: Song }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg mb-3 bg-brand-gray/30 flex items-center justify-center">
        {!imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={song.coverUrl}
            alt={`${song.title} - ${song.artist}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(5,156,192,0.25), rgba(3,178,140,0.18))" }}
          >
            <span className="text-4xl">🎵</span>
          </div>
        )}
      </div>
      <h3 className="text-base font-bold text-white">{song.title}</h3>
      <p className="text-white/50 text-xs">{song.artist}</p>
    </div>
  );
}

function formatPlayerTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function SwipeCard({
  song,
  onSwipe,
  isPlaying,
  onTogglePlay,
}: {
  song: Song;
  onSwipe: (songId: string, action: SwipeAction) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);

  const isGcsAudio = !!song.previewUrl && song.previewUrl.startsWith("/api/uploads/");
  const clipStart = song.clipStartSec ?? 0;
  const clipEnd = song.clipEndSec ?? 60;
  const clipDuration = clipEnd - clipStart;

  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const youtubeId = song.previewUrl ? getYouTubeId(song.previewUrl) : null;
  const hasAnyPreview = isGcsAudio || !!youtubeId;

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !isGcsAudio) return;
    if (isPlaying) {
      if (el.currentTime < clipStart || el.currentTime >= clipEnd) {
        el.currentTime = clipStart;
      }
      el.play().catch(() => { });
    } else {
      el.pause();
    }
  }, [isPlaying, isGcsAudio, clipStart, clipEnd]);

  useEffect(() => {
    const el = audioRef.current;
    return () => { el?.pause(); };
  }, []);

  const seekRelative = useCallback((delta: number) => {
    const el = audioRef.current;
    if (!el) return;
    const newTime = Math.max(clipStart, Math.min(clipEnd, el.currentTime + delta));
    el.currentTime = newTime;
  }, [clipStart, clipEnd]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const likeOpacity = useTransform(x, [0, 120], [0, 1]);
  const dislikeOpacity = useTransform(x, [-120, 0], [1, 0]);
  const cardGlow = useTransform(
    x,
    [-150, 0, 150],
    [
      "0 0 40px rgba(255,68,102,0.4), inset 0 0 30px rgba(255,68,102,0.1)",
      "0 12px 40px rgba(0,0,0,0.5)",
      "0 0 40px rgba(3,178,140,0.4), inset 0 0 30px rgba(3,178,140,0.1)",
    ]
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > SWIPE_THRESHOLD || velocity > 500) {
      animate(x, 500, { type: "spring" });
      onSwipe(song.id, "like");
    } else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      animate(x, -500, { type: "spring" });
      onSwipe(song.id, "dislike");
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, boxShadow: cardGlow }}
      className="absolute inset-0 rounded-[28px] overflow-hidden cursor-grab active:cursor-grabbing touch-none"
    >
      {/* ── Background ── */}
      {!imgError && song.coverUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={song.coverUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-50"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(10,10,20,0.4) 0%, rgba(10,10,20,0.6) 40%, rgba(10,10,20,0.92) 100%)",
          }} />
        </>
      )}
      {(imgError || !song.coverUrl) && (
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #0a0a14 0%, #111128 50%, #0a0a14 100%)",
        }} />
      )}

      {/* Swipe Indicators */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 right-6 z-20"
      >
        <div className="px-5 py-2.5 rounded-2xl font-black text-xl tracking-wide"
          style={{
            background: "linear-gradient(135deg, rgba(3,178,140,0.3), rgba(3,178,140,0.1))",
            border: "2px solid rgba(3,178,140,0.6)",
            color: "#03b28c",
            transform: "rotate(-12deg)",
            textShadow: "0 0 20px rgba(3,178,140,0.5)",
          }}>
          ❤️ אהבתי
        </div>
      </motion.div>
      <motion.div
        style={{ opacity: dislikeOpacity }}
        className="absolute top-8 left-6 z-20"
      >
        <div className="px-5 py-2.5 rounded-2xl font-black text-xl tracking-wide"
          style={{
            background: "linear-gradient(135deg, rgba(255,68,102,0.3), rgba(255,68,102,0.1))",
            border: "2px solid rgba(255,68,102,0.6)",
            color: "#ff4466",
            transform: "rotate(12deg)",
            textShadow: "0 0 20px rgba(255,68,102,0.5)",
          }}>
          ✕ לא
        </div>
      </motion.div>

      {/* ── Card Content ── */}
      <div className="relative h-full flex flex-col items-center justify-between py-6 px-5 z-10">
        {/* Top spacer */}
        <div />

        {/* Center: Cover + Info */}
        <div className="flex flex-col items-center w-full">
          {/* Cover Art with breathe animation */}
          <motion.div
            className="relative mb-5"
            animate={isPlaying ? { scale: [1, 1.02, 1] } : { scale: 1 }}
            transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
          >
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden shadow-2xl relative"
              style={{
                boxShadow: isPlaying
                  ? "0 20px 60px rgba(5,156,192,0.2), 0 0 0 1px rgba(255,255,255,0.08)"
                  : "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              {!imgError && song.coverUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={song.coverUrl}
                  alt={`${song.title} - ${song.artist}`}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #0d1b2a, #0a0a1e)" }}>
                  <Volume2 className="w-14 h-14 text-white/20" />
                </div>
              )}
              {/* Glow ring when playing */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 0 2px rgba(5,156,192,0.35)",
                  }} />
              )}
            </div>
          </motion.div>

          {/* Song Info */}
          <h3 className="font-display text-3xl font-black text-white text-center leading-tight mb-1.5 tracking-tight">
            {song.title}
          </h3>
          <p className="text-white/50 text-sm font-medium mb-3">{song.artist}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {song.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                {tag}
              </span>
            ))}
          </div>

          <p className="text-[11px] text-white/40 text-center mt-2">
            אפשר לגרור את הכרטיס או להשתמש בכפתורים למטה
          </p>
        </div>

        {/* ── Bottom: Premium Audio Player ── */}
        <div className="w-full space-y-3">
          <p className="text-[11px] text-white/40 text-center">
            האזינו לקטע קצר ואז החליקו ימינה/שמאלה כדי לבחור
          </p>
          {/* Hidden audio */}
          {isGcsAudio && (
            <audio
              ref={audioRef}
              src={song.previewUrl}
              preload="metadata"
              onTimeUpdate={(e) => {
                const el = e.currentTarget;
                if (el.currentTime >= clipEnd) {
                  el.pause();
                  el.currentTime = clipStart;
                  onTogglePlay();
                  setProgress(0);
                  setCurrentTimeSec(0);
                  return;
                }
                const elapsed = el.currentTime - clipStart;
                setProgress(clipDuration > 0 ? (elapsed / clipDuration) * 100 : 0);
                setCurrentTimeSec(Math.max(0, elapsed));
              }}
              onEnded={() => { setProgress(0); setCurrentTimeSec(0); onTogglePlay(); }}
              className="hidden"
            />
          )}

          {hasAnyPreview ? (
            <>
              {/* Transport: Seek Back — Circular Play — Seek Forward */}
              <div className="flex items-center justify-center gap-5">
                {/* -15s */}
                <button
                  onClick={(e) => { e.stopPropagation(); seekRelative(-15); }}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  aria-label="15 שניות אחורה"
                >
                  <SkipBack className="w-4 h-4 text-white/60" />
                </button>

                {/* Play/Pause with circular progress ring */}
                <div className="relative">
                  <CircularProgress progress={progress} size={72} strokeWidth={3} />
                  <button
                    onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background: isPlaying
                        ? "rgba(255,255,255,0.1)"
                        : "linear-gradient(135deg, #059cc0, #03b28c)",
                      boxShadow: isPlaying
                        ? "none"
                        : "0 4px 24px rgba(5,156,192,0.35)",
                    }}
                    aria-label={isPlaying ? "השהה" : "נגן"}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                    )}
                  </button>
                </div>

                {/* +15s */}
                <button
                  onClick={(e) => { e.stopPropagation(); seekRelative(15); }}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  aria-label="15 שניות קדימה"
                >
                  <SkipForward className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {/* Time display */}
              <div className="flex justify-center text-[10px] font-mono text-white/35 gap-1" dir="ltr">
                <span>{formatPlayerTime(currentTimeSec)}</span>
                <span>/</span>
                <span>{formatPlayerTime(clipDuration)}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-[11px] text-white/30">אין תצוגה מקדימה</p>
            </div>
          )}

          {/* YouTube fallback */}
          {!isGcsAudio && youtubeId && isPlaying && (
            <div className="rounded-xl overflow-hidden opacity-50">
              <iframe
                width="100%"
                height="52"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&start=${clipStart}&end=${clipEnd}&controls=1`}
                allow="autoplay; encrypted-media"
                className="rounded-xl"
                title={`${song.title} preview`}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
