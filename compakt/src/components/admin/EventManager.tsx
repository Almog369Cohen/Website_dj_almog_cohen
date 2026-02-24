"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Users,
  MapPin,
  Phone,
  Archive,
  Loader2,
  Link2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DJEvent {
  id: string;
  event_type: string;
  couple_name_a: string | null;
  couple_name_b: string | null;
  event_date: string | null;
  venue: string | null;
  city: string | null;
  contact_phone: string | null;
  contact_role: string | null;
  magic_token: string;
  current_stage: number;
  is_archived: boolean;
  created_at: string;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "חתונה",
  bar_mitzvah: "בר/בת מצווה",
  private: "אירוע פרטי",
  corporate: "אירוע חברה",
  other: "אחר",
};

const STAGE_LABELS: Record<number, string> = {
  0: "חדש",
  1: "שאלות",
  2: "סווייפ שירים",
  3: "בקשות",
  4: "בריף מוזיקלי",
};

function getEventLink(token: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/event?token=${token}`;
}

export function EventManager() {
  const [events, setEvents] = useState<DJEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getBearer = useCallback(async (): Promise<string | null> => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  }, []);

  const loadEvents = useCallback(async () => {
    const bearer = await getBearer();
    if (!bearer) return;

    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        headers: { Authorization: `Bearer ${bearer}` },
      });
      if (res.ok) {
        const data = (await res.json()) as { events: DJEvent[] };
        setEvents(data.events);
      }
    } finally {
      setLoading(false);
    }
  }, [getBearer]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const copyLink = async (token: string, eventId: string) => {
    const link = getEventLink(token);
    await navigator.clipboard.writeText(link);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeEvents = events.filter((e) => !e.is_archived);
  const archivedEvents = events.filter((e) => e.is_archived);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">אירועים</h2>
          <p className="text-sm text-secondary">
            צרו אירוע, קבלו לינק, שלחו ללקוח
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary text-sm flex items-center gap-2 py-2.5 px-5"
        >
          <Plus className="w-4 h-4" />
          אירוע חדש
        </button>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateEventModal
            getBearer={getBearer}
            onCreated={() => {
              setShowCreate(false);
              loadEvents();
            }}
            onClose={() => setShowCreate(false)}
          />
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted" />
        </div>
      )}

      {/* Empty State */}
      {!loading && activeEvents.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-muted" />
          <h3 className="font-bold text-lg mb-2">אין אירועים עדיין</h3>
          <p className="text-sm text-secondary mb-4">
            צרו אירוע חדש כדי לקבל לינק לשליחה ללקוח
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary text-sm py-2.5 px-6 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            צור אירוע ראשון
          </button>
        </div>
      )}

      {/* Active Events */}
      {!loading && activeEvents.length > 0 && (
        <div className="space-y-3">
          {activeEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              copiedId={copiedId}
              expandedId={expandedId}
              onCopy={() => copyLink(event.magic_token, event.id)}
              onToggleExpand={() =>
                setExpandedId(expandedId === event.id ? null : event.id)
              }
            />
          ))}
        </div>
      )}

      {/* Archived */}
      {!loading && archivedEvents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-muted mb-3 flex items-center gap-2">
            <Archive className="w-4 h-4" />
            אירועים בארכיון ({archivedEvents.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {archivedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                copiedId={copiedId}
                expandedId={expandedId}
                onCopy={() => copyLink(event.magic_token, event.id)}
                onToggleExpand={() =>
                  setExpandedId(expandedId === event.id ? null : event.id)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Event Card ── */
function EventCard({
  event,
  copiedId,
  expandedId,
  onCopy,
  onToggleExpand,
}: {
  event: DJEvent;
  copiedId: string | null;
  expandedId: string | null;
  onCopy: () => void;
  onToggleExpand: () => void;
}) {
  const isExpanded = expandedId === event.id;
  const isCopied = copiedId === event.id;
  const names = [event.couple_name_a, event.couple_name_b]
    .filter(Boolean)
    .join(" & ");
  const link = getEventLink(event.magic_token);

  return (
    <motion.div
      layout
      className="glass-card p-4 space-y-3"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            style={{
              background: "rgba(5,156,192,0.1)",
              color: "#059cc0",
            }}
          >
            {event.event_type === "wedding"
              ? "💍"
              : event.event_type === "bar_mitzvah"
              ? "🎉"
              : "🎵"}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">
              {names || EVENT_TYPE_LABELS[event.event_type] || "אירוע"}
            </p>
            <p className="text-xs text-muted">
              {EVENT_TYPE_LABELS[event.event_type]}
              {event.event_date && ` · ${formatDate(event.event_date)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] px-2 py-0.5 rounded-full border border-glass text-muted">
            {STAGE_LABELS[event.current_stage] ?? `שלב ${event.current_stage}`}
          </span>
          <button
            onClick={onCopy}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="העתק לינק"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-brand-green" />
                הועתק!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                העתק לינק
              </>
            )}
          </button>
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t border-glass space-y-3">
              {/* Link row */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
                <Link2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <code className="text-xs text-secondary truncate flex-1" dir="ltr">
                  {link}
                </code>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {event.venue && (
                  <div className="flex items-center gap-1.5 text-secondary">
                    <MapPin className="w-3.5 h-3.5 text-muted" />
                    {event.venue}
                    {event.city && `, ${event.city}`}
                  </div>
                )}
                {event.contact_phone && (
                  <div className="flex items-center gap-1.5 text-secondary">
                    <Phone className="w-3.5 h-3.5 text-muted" />
                    <span dir="ltr">{event.contact_phone}</span>
                    {event.contact_role && ` (${event.contact_role})`}
                  </div>
                )}
                {event.couple_name_a && (
                  <div className="flex items-center gap-1.5 text-secondary">
                    <Users className="w-3.5 h-3.5 text-muted" />
                    {event.couple_name_a}
                    {event.couple_name_b && ` & ${event.couple_name_b}`}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-secondary">
                  <Calendar className="w-3.5 h-3.5 text-muted" />
                  נוצר {formatDate(event.created_at)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Create Event Modal ── */
function CreateEventModal({
  getBearer,
  onCreated,
  onClose,
}: {
  getBearer: () => Promise<string | null>;
  onCreated: () => void;
  onClose: () => void;
}) {
  const [eventType, setEventType] = useState("wedding");
  const [coupleNameA, setCoupleNameA] = useState("");
  const [coupleNameB, setCoupleNameB] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const bearer = await getBearer();
      if (!bearer) throw new Error("יש להתחבר קודם");

      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify({
          eventType,
          coupleNameA: coupleNameA || undefined,
          coupleNameB: coupleNameB || undefined,
          eventDate: eventDate || undefined,
          venue: venue || undefined,
          city: city || undefined,
          contactPhone: contactPhone || undefined,
          contactRole: contactRole || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "שגיאה ביצירת אירוע");
      }

      const data = (await res.json()) as { event: { magic_token: string } };
      setCreatedToken(data.event.magic_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyAndClose = async () => {
    if (createdToken) {
      const link = getEventLink(createdToken);
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => {
        onCreated();
      }, 800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {!createdToken ? (
          <>
            <h3 className="font-bold text-lg">אירוע חדש</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              {/* Event Type */}
              <div>
                <label className="block text-xs text-muted mb-1">סוג אירוע</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="input-field"
                >
                  <option value="wedding">חתונה</option>
                  <option value="bar_mitzvah">בר/בת מצווה</option>
                  <option value="private">אירוע פרטי</option>
                  <option value="corporate">אירוע חברה</option>
                  <option value="other">אחר</option>
                </select>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1">שם א׳</label>
                  <input
                    type="text"
                    value={coupleNameA}
                    onChange={(e) => setCoupleNameA(e.target.value)}
                    placeholder="למשל: דניאל"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">שם ב׳</label>
                  <input
                    type="text"
                    value={coupleNameB}
                    onChange={(e) => setCoupleNameB(e.target.value)}
                    placeholder="למשל: נועה"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs text-muted mb-1">תאריך אירוע</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="input-field"
                  dir="ltr"
                />
              </div>

              {/* Venue + City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1">מקום</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="שם האולם"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">עיר</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="עיר"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1">טלפון</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="050-1234567"
                    className="input-field"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">תפקיד איש קשר</label>
                  <input
                    type="text"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder="חתן / כלה / מפיק"
                    className="input-field"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-accent-danger">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2.5"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  צור אירוע
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary text-sm py-2.5 px-5"
                >
                  ביטול
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success — show link */
          <div className="text-center space-y-4 py-4">
            <div className="text-4xl">🎉</div>
            <h3 className="font-bold text-lg">האירוע נוצר!</h3>
            <p className="text-sm text-secondary">
              שלחו את הלינק הזה ללקוח כדי שימלא את ההעדפות שלו
            </p>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
              <Link2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <code className="text-xs text-secondary truncate flex-1" dir="ltr">
                {getEventLink(createdToken)}
              </code>
            </div>

            <button
              onClick={handleCopyAndClose}
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  הועתק! סוגר...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  העתק לינק וסגור
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
