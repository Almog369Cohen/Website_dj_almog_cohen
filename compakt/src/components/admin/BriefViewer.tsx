"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Star,
  XCircle,
  HelpCircle,
  MessageSquare,
  Music,
  Loader2,
  Copy,
  Check,
  Download,
  Calendar,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface BriefSwipe {
  id: string;
  action: string;
  reasonChips: string[];
  song: { title: string; artist: string; category: string; cover_url: string };
}

interface BriefAnswer {
  id: string;
  value: unknown;
  question: { question_he: string; question_type: string };
}

interface BriefRequest {
  id: string;
  request_type: string;
  text: string;
}

interface BriefEvent {
  id: string;
  eventType: string;
  coupleNameA: string | null;
  coupleNameB: string | null;
  eventDate: string | null;
  venue: string | null;
  city: string | null;
  currentStage: number;
  status: string;
  contactPhone: string | null;
  contactName: string | null;
}

interface BriefData {
  event: BriefEvent;
  swipes: BriefSwipe[];
  answers: BriefAnswer[];
  requests: BriefRequest[];
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "חתונה",
  bar_mitzvah: "בר/בת מצווה",
  private: "אירוע פרטי",
  corporate: "עסקי",
  other: "אחר",
};

const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  reception: { label: "קבלת פנים", emoji: "🥂" },
  ceremony: { label: "טקס", emoji: "💍" },
  food: { label: "אוכל", emoji: "🍽️" },
  dancing: { label: "רחבה", emoji: "💃" },
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  free_text: "הערה חופשית",
  do: "כן, בבקשה",
  dont: "לא, תודה",
  link: "לינק",
  special_moment: "רגע מיוחד",
};

export function BriefViewer({
  eventId,
  onClose,
}: {
  eventId: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const fetchBrief = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { data: session } = await supabase.auth.getSession();
      const bearer = session.session?.access_token;
      if (!bearer) {
        setError("לא מחובר");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/events/${eventId}/brief`, {
        headers: { Authorization: `Bearer ${bearer}` },
      });

      if (!res.ok) {
        setError("שגיאה בטעינת הבריף");
        setLoading(false);
        return;
      }

      const json = await res.json();
      setData(json);
    } catch {
      setError("שגיאה בטעינה");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchBrief();
  }, [fetchBrief]);

  const likes = data?.swipes.filter((s) => s.action === "like" || s.action === "super_like") ?? [];
  const dislikes = data?.swipes.filter((s) => s.action === "dislike") ?? [];
  const superLikes = data?.swipes.filter((s) => s.action === "super_like") ?? [];

  const copyBriefText = () => {
    if (!data) return;
    const ev = data.event;
    const names = [ev.coupleNameA, ev.coupleNameB].filter(Boolean).join(" & ") || "ללא שם";
    const lines: string[] = [];

    lines.push(`בריף מוזיקלי — ${names}`);
    lines.push(`סוג: ${EVENT_TYPE_LABELS[ev.eventType] ?? ev.eventType}`);
    if (ev.eventDate) lines.push(`תאריך: ${ev.eventDate}`);
    if (ev.venue) lines.push(`מקום: ${ev.venue}${ev.city ? `, ${ev.city}` : ""}`);
    lines.push("");

    if (data.answers.length > 0) {
      lines.push("── תשובות ──");
      data.answers.forEach((a) => {
        const val = typeof a.value === "object" ? JSON.stringify(a.value) : String(a.value);
        lines.push(`${a.question.question_he}: ${val}`);
      });
      lines.push("");
    }

    if (likes.length > 0) {
      lines.push(`── שירים שאהבו (${likes.length}) ──`);
      likes.forEach((s) => {
        const star = s.action === "super_like" ? " ⭐" : "";
        const cat = CATEGORY_META[s.song.category]?.emoji ?? "";
        lines.push(`${cat} ${s.song.artist} - ${s.song.title}${star}`);
      });
      lines.push("");
    }

    if (dislikes.length > 0) {
      lines.push(`── שירים שלא אהבו (${dislikes.length}) ──`);
      dislikes.forEach((s) => {
        const reasons = s.reasonChips.length > 0 ? ` (${s.reasonChips.join(", ")})` : "";
        lines.push(`${s.song.artist} - ${s.song.title}${reasons}`);
      });
      lines.push("");
    }

    if (data.requests.length > 0) {
      lines.push("── בקשות ──");
      data.requests.forEach((r) => {
        const label = REQUEST_TYPE_LABELS[r.request_type] ?? r.request_type;
        lines.push(`[${label}] ${r.text}`);
      });
    }

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  const exportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brief-${eventId.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 flex items-start justify-center px-4 py-8 overflow-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="glass-card w-full max-w-2xl p-5 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Music className="w-5 h-5 text-brand-blue" />
            בריף מוזיקלי
          </h2>
          <div className="flex items-center gap-2">
            {data && (
              <>
                <button
                  onClick={copyBriefText}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText ? "הועתק!" : "העתק טקסט"}
                </button>
                <button
                  onClick={exportJSON}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  JSON
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-brand-blue" />
            <p className="text-sm text-muted">טוען בריף...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-sm text-muted">{error}</p>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-5">
            {/* Event Info */}
            <div className="p-4 rounded-xl border border-glass space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-blue" />
                <span className="font-bold text-sm">
                  {[data.event.coupleNameA, data.event.coupleNameB].filter(Boolean).join(" & ") || data.event.contactName || "ללא שם"}
                </span>
                <span className="text-xs text-muted">
                  {EVENT_TYPE_LABELS[data.event.eventType] ?? data.event.eventType}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-secondary">
                {data.event.eventDate && (
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{data.event.eventDate}</span>
                )}
                {data.event.venue && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{data.event.venue}{data.event.city ? `, ${data.event.city}` : ""}</span>
                )}
                {data.event.contactPhone && (
                  <a href={`tel:${data.event.contactPhone}`} className="flex items-center gap-1 text-brand-blue" dir="ltr">
                    <Phone className="w-3 h-3" />{data.event.contactPhone}
                  </a>
                )}
              </div>
            </div>

            {/* Answers */}
            {data.answers.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-blue" />
                  תשובות ({data.answers.length})
                </h3>
                <div className="space-y-2">
                  {data.answers.map((a) => (
                    <div key={a.id} className="p-3 rounded-xl border border-glass">
                      <p className="text-xs text-muted mb-1">{a.question.question_he}</p>
                      <p className="text-sm font-medium">
                        {typeof a.value === "object" ? JSON.stringify(a.value) : String(a.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Liked Songs */}
            {likes.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-brand-green" />
                  שירים שאהבו ({likes.length})
                  {superLikes.length > 0 && (
                    <span className="text-xs text-muted">({superLikes.length} סופר)</span>
                  )}
                </h3>
                <div className="space-y-1.5">
                  {likes.map((sw) => (
                    <div key={sw.id} className="flex items-center gap-3 p-2 rounded-xl border border-glass">
                      {sw.song.cover_url && (
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sw.song.cover_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{sw.song.title}</p>
                        <p className="text-xs text-muted truncate">{sw.song.artist}</p>
                      </div>
                      <span className="text-xs text-muted">
                        {CATEGORY_META[sw.song.category]?.emoji} {CATEGORY_META[sw.song.category]?.label}
                      </span>
                      {sw.action === "super_like" && (
                        <Star className="w-4 h-4 flex-shrink-0" fill="#ffc832" style={{ color: "#ffc832" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disliked Songs */}
            {dislikes.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" style={{ color: "var(--accent-danger)" }} />
                  שירים שלא אהבו ({dislikes.length})
                </h3>
                <div className="space-y-1.5">
                  {dislikes.map((sw) => (
                    <div key={sw.id} className="flex items-center gap-3 p-2 rounded-xl border border-glass">
                      {sw.song.cover_url && (
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sw.song.cover_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{sw.song.title}</p>
                        <p className="text-xs text-muted truncate">{sw.song.artist}</p>
                      </div>
                      {sw.reasonChips.length > 0 && (
                        <div className="flex gap-1 flex-wrap justify-end">
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
                  ))}
                </div>
              </div>
            )}

            {/* Requests */}
            {data.requests.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-blue" />
                  בקשות ({data.requests.length})
                </h3>
                <div className="space-y-2">
                  {data.requests.map((r) => (
                    <div key={r.id} className="p-3 rounded-xl border border-glass">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue mb-1 inline-block">
                        {REQUEST_TYPE_LABELS[r.request_type] ?? r.request_type}
                      </span>
                      <p className="text-sm mt-1">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {data.swipes.length === 0 && data.answers.length === 0 && data.requests.length === 0 && (
              <div className="text-center py-8 text-muted text-sm">
                הלקוח עוד לא מילא נתונים בפורטל
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
