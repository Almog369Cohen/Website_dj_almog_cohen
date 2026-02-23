"use client";

import { useEffect, useMemo, useState } from "react";
import { useEventStore } from "@/stores/eventStore";
import { useAdminStore } from "@/stores/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  Music,
  Heart,
  Star,
  XCircle,
  TrendingUp,
  Clock,
  HelpCircle,
  Sparkles,
  Download,
  ListTodo,
  X,
  Plus,
  Trash2,
  FileText,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import type { SongCategory } from "@/lib/types";

type FixItem = {
  id: string;
  text: string;
  done: boolean;
};

const FIXES_STORAGE_KEY = "compakt.admin.fixes";

const CATEGORY_META: Record<SongCategory, { label: string; emoji: string }> = {
  reception: { label: "קבלת פנים", emoji: "🥂" },
  ceremony: { label: "טקס", emoji: "💍" },
  food: { label: "אוכל", emoji: "🍽️" },
  dancing: { label: "רחבה", emoji: "💃" },
};

export function Dashboard() {
  const event = useEventStore((s) => s.event);
  const swipes = useEventStore((s) => s.swipes);
  const answers = useEventStore((s) => s.answers);
  const requests = useEventStore((s) => s.requests);
  const analytics = useEventStore((s) => s.analytics);
  const upsellClicks = useEventStore((s) => s.upsellClicks);
  const songs = useAdminStore((s) => s.songs);
  const questions = useAdminStore((s) => s.questions);
  const upsells = useAdminStore((s) => s.upsells);

  const [showFixes, setShowFixes] = useState(false);
  const [fixes, setFixes] = useState<FixItem[]>([]);
  const [newFixText, setNewFixText] = useState("");
  const [copiedCSV, setCopiedCSV] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FIXES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FixItem[];
        if (Array.isArray(parsed)) setFixes(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FIXES_STORAGE_KEY, JSON.stringify(fixes));
    } catch {
      // ignore
    }
  }, [fixes]);

  const stats = useMemo(() => {
    const likes = swipes.filter((s) => s.action === "like").length;
    const superLikes = swipes.filter((s) => s.action === "super_like").length;
    const dislikes = swipes.filter((s) => s.action === "dislike").length;
    const unsure = swipes.filter((s) => s.action === "unsure").length;
    const totalSwipes = swipes.length;
    const completionRate = event
      ? Math.round(((event.currentStage || 0) / 4) * 100)
      : 0;

    // Reason chips
    const topReasons = new Map<string, number>();
    swipes
      .filter((s) => s.action === "dislike")
      .forEach((s) =>
        s.reasonChips.forEach((chip) =>
          topReasons.set(chip, (topReasons.get(chip) || 0) + 1)
        )
      );
    const sortedReasons = Array.from(topReasons.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    // Category breakdown
    const categoryBreakdown = (Object.keys(CATEGORY_META) as SongCategory[]).map((cat) => {
      const catSongs = songs.filter((s) => s.category === cat && s.isActive);
      const catSwipes = swipes.filter((sw) => catSongs.some((s) => s.id === sw.songId));
      const catLikes = catSwipes.filter((s) => s.action === "like" || s.action === "super_like").length;
      const catDislikes = catSwipes.filter((s) => s.action === "dislike").length;
      return {
        category: cat,
        totalSongs: catSongs.length,
        swiped: catSwipes.length,
        likes: catLikes,
        dislikes: catDislikes,
        pct: catSwipes.length > 0 ? Math.round((catLikes / catSwipes.length) * 100) : 0,
      };
    });

    // Top liked songs
    const likedSongIds = swipes
      .filter((s) => s.action === "like" || s.action === "super_like")
      .map((s) => s.songId);
    const topLiked = songs
      .filter((s) => likedSongIds.includes(s.id))
      .map((s) => ({
        ...s,
        isSuper: swipes.find((sw) => sw.songId === s.id)?.action === "super_like",
      }))
      .slice(0, 10);

    // Top disliked songs
    const dislikedSongIds = swipes
      .filter((s) => s.action === "dislike")
      .map((s) => s.songId);
    const topDisliked = songs
      .filter((s) => dislikedSongIds.includes(s.id))
      .slice(0, 5);

    return {
      likes,
      superLikes,
      dislikes,
      unsure,
      totalSwipes,
      completionRate,
      sortedReasons,
      categoryBreakdown,
      topLiked,
      topDisliked,
      answeredQuestions: answers.length,
      totalRequests: requests.length,
      totalUpsellClicks: upsellClicks.length,
    };
  }, [swipes, event, songs, answers, requests, upsellClicks]);

  // Export helpers
  const exportJSON = () => {
    if (!event) return;
    const data = {
      event,
      answers,
      swipes: swipes.map((s) => ({
        ...s,
        songTitle: songs.find((song) => song.id === s.songId)?.title,
        songArtist: songs.find((song) => song.id === s.songId)?.artist,
      })),
      requests,
      upsellClicks,
      analytics,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compakt-brief-${event.magicToken?.slice(0, 8) || "draft"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const likedSwipes = swipes.filter((s) => s.action === "like" || s.action === "super_like");
    const rows = likedSwipes.map((sw) => {
      const song = songs.find((s) => s.id === sw.songId);
      return `"${song?.title || ""}","${song?.artist || ""}","${song?.category || ""}","${sw.action}"`;
    });
    const csv = `"שם שיר","אמן","קטגוריה","פעולה"\n${rows.join("\n")}`;
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compakt-liked-songs.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLikedToClipboard = () => {
    const likedSwipes = swipes.filter((s) => s.action === "like" || s.action === "super_like");
    const text = likedSwipes
      .map((sw) => {
        const song = songs.find((s) => s.id === sw.songId);
        const cat = song ? CATEGORY_META[song.category]?.emoji || "" : "";
        const star = sw.action === "super_like" ? " ⭐" : "";
        return `${cat} ${song?.artist || "?"} - ${song?.title || "?"}${star}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCSV(true);
      setTimeout(() => setCopiedCSV(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-blue" />
          דשבורד
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFixes(true)}
            className="btn-secondary text-sm flex items-center gap-1.5 py-2 px-4"
          >
            <ListTodo className="w-4 h-4" />
            תיקונים
          </button>

          {stats.totalSwipes > 0 && (
            <>
              <button
                onClick={copyLikedToClipboard}
                className="btn-secondary text-sm flex items-center gap-1.5 py-2 px-4"
              >
                {copiedCSV ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedCSV ? "הועתק!" : "העתק אהובים"}
              </button>
              <button
                onClick={exportCSV}
                className="btn-secondary text-sm flex items-center gap-1.5 py-2 px-4"
              >
                <FileText className="w-4 h-4" />
                CSV
              </button>
            </>
          )}

          {event && (
            <button
              onClick={exportJSON}
              className="btn-secondary text-sm flex items-center gap-1.5 py-2 px-4"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
          )}
        </div>
      </div>

      {/* Fixes Modal */}
      <AnimatePresence>
        {showFixes && (
          <div
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4"
            onClick={() => setShowFixes(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="glass-card w-full max-w-lg p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-brand-blue" />
                  <h3 className="font-bold">תיקונים</h3>
                  <span className="text-xs text-muted">({fixes.filter((f) => !f.done).length} פתוחים)</span>
                </div>
                <button
                  onClick={() => setShowFixes(false)}
                  className="p-2 rounded-lg text-muted hover:text-foreground transition-colors"
                  aria-label="סגור"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  value={newFixText}
                  onChange={(e) => setNewFixText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    const text = newFixText.trim();
                    if (!text) return;
                    setFixes((prev) => [
                      { id: crypto.randomUUID(), text, done: false },
                      ...prev,
                    ]);
                    setNewFixText("");
                  }}
                  placeholder="הוסף תיקון…"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
                />
                <button
                  onClick={() => {
                    const text = newFixText.trim();
                    if (!text) return;
                    setFixes((prev) => [
                      { id: crypto.randomUUID(), text, done: false },
                      ...prev,
                    ]);
                    setNewFixText("");
                  }}
                  className="btn-primary text-sm flex items-center gap-1.5 py-2.5 px-4"
                >
                  <Plus className="w-4 h-4" />
                  הוסף
                </button>
              </div>

              <div className="space-y-2 max-h-[55vh] overflow-auto pr-1">
                {fixes.length === 0 ? (
                  <div className="text-sm text-muted text-center py-10">
                    אין תיקונים עדיין
                  </div>
                ) : (
                  fixes.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-glass"
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() =>
                          setFixes((prev) =>
                            prev.map((f) =>
                              f.id === item.id ? { ...f, done: !f.done } : f
                            )
                          )
                        }
                        className="w-4 h-4"
                      />
                      <span
                        className={`text-sm flex-1 ${item.done ? "line-through text-muted" : ""}`}
                      >
                        {item.text}
                      </span>
                      <button
                        onClick={() => setFixes((prev) => prev.filter((f) => f.id !== item.id))}
                        className="p-2 rounded-lg text-muted hover:text-accent-danger transition-colors"
                        aria-label="מחק"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {fixes.length > 0 && (
                <div className="flex items-center justify-between mt-4 gap-2">
                  <button
                    onClick={() => setFixes((prev) => prev.filter((f) => !f.done))}
                    className="text-xs text-secondary hover:text-foreground transition-colors"
                  >
                    נקה שבוצעו
                  </button>
                  <button
                    onClick={() => setFixes([])}
                    className="text-xs"
                    style={{ color: "var(--accent-danger)" }}
                  >
                    מחק הכל
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Music className="w-5 h-5" />}
          label="שירים בספרייה"
          value={songs.length}
          color="#059cc0"
        />
        <StatCard
          icon={<HelpCircle className="w-5 h-5" />}
          label="שאלות פעילות"
          value={questions.filter((q) => q.isActive).length}
          color="#03b28c"
        />
        <StatCard
          icon={<Sparkles className="w-5 h-5" />}
          label="שדרוגים"
          value={upsells.filter((u) => u.isActive).length}
          color="#f5c542"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="קליקים על שדרוגים"
          value={stats.totalUpsellClicks}
          color="#059cc0"
        />
      </div>

      {/* Current Event */}
      {event ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-blue" />
            אירוע נוכחי
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted">סוג</p>
              <p className="font-medium text-sm">
                {event.eventType === "wedding"
                  ? "חתונה 💍"
                  : event.eventType === "bar_mitzvah"
                    ? "בר/בת מצווה 🎉"
                    : event.eventType === "private"
                      ? "אירוע פרטי 🎈"
                      : event.eventType === "corporate"
                        ? "עסקי 🏢"
                        : "אחר"}
              </p>
            </div>
            {(event.coupleNameA || event.coupleNameB) && (
              <div>
                <p className="text-xs text-muted">שמות</p>
                <p className="font-medium text-sm">
                  {[event.coupleNameA, event.coupleNameB].filter(Boolean).join(" & ")}
                </p>
              </div>
            )}
            {event.eventDate && (
              <div>
                <p className="text-xs text-muted">תאריך</p>
                <p className="font-medium text-sm">{event.eventDate}</p>
              </div>
            )}
            {event.venue && (
              <div>
                <p className="text-xs text-muted">מקום</p>
                <p className="font-medium text-sm">{event.venue}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted">שלב נוכחי</p>
              <p className="font-medium text-sm">
                {event.currentStage}/4 ({stats.completionRate}%)
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-brand-gray/30 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #059cc0, #03b28c)" }}
            />
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-8 text-center text-muted text-sm">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          אין אירוע פעיל כרגע
        </div>
      )}

      {/* Swipe Overview */}
      {stats.totalSwipes > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold text-sm mb-4">סטטיסטיקת שירים</h3>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart className="w-4 h-4 text-brand-green" fill="var(--accent-secondary)" />
              </div>
              <p className="text-lg font-bold text-brand-green">{stats.likes}</p>
              <p className="text-xs text-muted">אהבו</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4" style={{ color: "var(--accent-gold)" }} fill="var(--accent-gold)" />
              </div>
              <p className="text-lg font-bold" style={{ color: "var(--accent-gold)" }}>
                {stats.superLikes}
              </p>
              <p className="text-xs text-muted">סופר!</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <XCircle className="w-4 h-4" style={{ color: "var(--accent-danger)" }} />
              </div>
              <p className="text-lg font-bold" style={{ color: "var(--accent-danger)" }}>
                {stats.dislikes}
              </p>
              <p className="text-xs text-muted">לא אהבו</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <HelpCircle className="w-4 h-4 text-muted" />
              </div>
              <p className="text-lg font-bold text-muted">{stats.unsure}</p>
              <p className="text-xs text-muted">דילגו</p>
            </div>
          </div>

          {/* Visual bar */}
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {stats.likes > 0 && (
              <div className="rounded-full" style={{ width: `${(stats.likes / stats.totalSwipes) * 100}%`, background: "var(--accent-secondary)" }} />
            )}
            {stats.superLikes > 0 && (
              <div className="rounded-full" style={{ width: `${(stats.superLikes / stats.totalSwipes) * 100}%`, background: "var(--accent-gold)" }} />
            )}
            {stats.dislikes > 0 && (
              <div className="rounded-full" style={{ width: `${(stats.dislikes / stats.totalSwipes) * 100}%`, background: "var(--accent-danger)" }} />
            )}
            {stats.unsure > 0 && (
              <div className="rounded-full bg-muted" style={{ width: `${(stats.unsure / stats.totalSwipes) * 100}%` }} />
            )}
          </div>
        </motion.div>
      )}

      {/* Category Breakdown */}
      {stats.totalSwipes > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold text-sm mb-4">פירוט לפי קטגוריה</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.categoryBreakdown.map((cat) => {
              const meta = CATEGORY_META[cat.category];
              return (
                <div key={cat.category} className="p-3 rounded-xl border border-glass">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{meta.emoji}</span>
                    <span className="text-sm font-medium">{meta.label}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">שירים</span>
                      <span className="font-medium">{cat.totalSongs}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">נסוייפו</span>
                      <span className="font-medium">{cat.swiped}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-green">❤️ אהבו</span>
                      <span className="font-medium text-brand-green">{cat.likes}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "var(--accent-danger)" }}>✕ לא</span>
                      <span className="font-medium" style={{ color: "var(--accent-danger)" }}>{cat.dislikes}</span>
                    </div>
                    {/* Approval rate bar */}
                    {cat.swiped > 0 && (
                      <div className="mt-1">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${cat.pct}%`,
                              background: cat.pct >= 60 ? "#03b28c" : cat.pct >= 30 ? "#f5c542" : "#ff4466",
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-muted mt-0.5 text-center">{cat.pct}% אהבו</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Top Liked Songs */}
      {stats.topLiked.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-brand-green" />
            שירים שאהבו ({stats.likes + stats.superLikes})
          </h3>
          <div className="space-y-2">
            {stats.topLiked.map((song) => (
              <div key={song.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover transition-colors">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-brand-gray/30 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-muted truncate">{song.artist}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: "rgba(3,178,140,0.1)",
                  color: "#03b28c",
                }}>
                  {CATEGORY_META[song.category]?.emoji} {CATEGORY_META[song.category]?.label}
                </span>
                {song.isSuper && <Star className="w-4 h-4 flex-shrink-0" fill="#ffc832" style={{ color: "#ffc832" }} />}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Top Disliked Songs */}
      {stats.topDisliked.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <ThumbsDown className="w-4 h-4" style={{ color: "var(--accent-danger)" }} />
            שירים שלא אהבו ({stats.dislikes})
          </h3>
          <div className="space-y-2">
            {stats.topDisliked.map((song) => {
              const sw = swipes.find((s) => s.songId === song.id && s.action === "dislike");
              return (
                <div key={song.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover transition-colors">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-brand-gray/30 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{song.title}</p>
                    <p className="text-xs text-muted truncate">{song.artist}</p>
                  </div>
                  {sw?.reasonChips && sw.reasonChips.length > 0 && (
                    <div className="flex gap-1">
                      {sw.reasonChips.slice(0, 2).map((chip) => (
                        <span key={chip} className="text-[10px] px-2 py-0.5 rounded-full" style={{
                          background: "rgba(255,68,102,0.1)",
                          color: "#ff6680",
                        }}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Top Dislike Reasons */}
      {stats.sortedReasons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold text-sm mb-3">סיבות דחייה נפוצות</h3>
          <div className="space-y-2">
            {stats.sortedReasons.map(([reason, count]) => (
              <div key={reason} className="flex items-center gap-3">
                <span className="text-sm flex-1">{reason}</span>
                <div className="flex-1 h-2 rounded-full bg-brand-gray/30 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(count / Math.max(1, stats.dislikes)) * 100}%`,
                      background: "var(--accent-danger)",
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span className="text-xs text-muted w-8 text-left">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Requests Summary */}
      {stats.totalRequests > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold text-sm mb-3">בקשות</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MiniStat label="חופשיות" count={requests.filter((r) => r.requestType === "free_text").length} />
            <MiniStat label="✅ כן" count={requests.filter((r) => r.requestType === "do").length} />
            <MiniStat label="❌ לא" count={requests.filter((r) => r.requestType === "dont").length} />
            <MiniStat label="🔗 לינקים" count={requests.filter((r) => r.requestType === "link").length} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-4 text-center"
    >
      <div className="flex justify-center mb-2" style={{ color }}>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-muted">{label}</p>
    </motion.div>
  );
}

function MiniStat({ label, count }: { label: string; count: number }) {
  return (
    <div className="text-center p-2 rounded-xl border border-glass">
      <p className="text-lg font-bold">{count}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
