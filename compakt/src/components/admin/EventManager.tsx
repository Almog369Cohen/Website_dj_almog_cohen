"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  CheckCircle2,
  Inbox,
  Zap,
  Lock,
  Unlock,
  Share2,
  FileText,
  ShieldOff,
  ShieldCheck,
  StickyNote,
} from "lucide-react";
import { BriefViewer } from "./BriefViewer";
import { formatDate, getSafeOrigin } from "@/lib/utils";

interface EventContact {
  id: string;
  name: string;
  phone: string | null;
}

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
  status: string | null;
  locked_at: string | null;
  portal_closed_at: string | null;
  dj_notes: string | null;
  contact_id: string | null;
  portal_token: string | null;
  contact: EventContact | null;
  created_at: string;
  updated_at: string | null;
}

type EventTab = "intake" | "active" | "archived";

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

const STATUS_LABELS: Record<string, string> = {
  intake: "פנייה חדשה",
  active: "פעיל",
  completed: "הושלם",
  archived: "ארכיון",
};

function getPortalLink(token: string): string {
  const origin = getSafeOrigin();
  return `${origin}/portal/${token}`;
}

function getDjLink(slug: string, type?: string): string {
  const origin = getSafeOrigin();
  const base = `${origin}/dj/${slug}`;
  if (!type) return base;
  return `${base}?type=${encodeURIComponent(type)}`;
}

function getEventLink(token: string): string {
  const origin = getSafeOrigin();
  return `${origin}/event?token=${token}`;
}

export function EventManager() {
  const [events, setEvents] = useState<DJEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EventTab>("active");
  const [djSlug, setDjSlug] = useState<string | null>(null);
  const [copiedDjLink, setCopiedDjLink] = useState(false);
  const [copiedPreset, setCopiedPreset] = useState<string | null>(null);

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

  const linkPresets: { id: string; label: string; type: string }[] = [
    { id: "general", label: "כללי", type: "" },
    { id: "wedding", label: "חתונה", type: "wedding" },
    { id: "henna", label: "חינה", type: "henna" },
    { id: "corporate", label: "עסקי", type: "corporate" },
    { id: "bar_mitzvah", label: "בר/בת", type: "bar_mitzvah" },
    { id: "private", label: "פרטי", type: "private" },
  ];

  const copyPresetLink = async (presetId: string, type: string) => {
    if (!djSlug) return;
    const url = type ? getDjLink(djSlug, type) : getDjLink(djSlug);
    await navigator.clipboard.writeText(url);
    setCopiedPreset(presetId);
    setTimeout(() => setCopiedPreset(null), 1200);
  };

  // Load DJ slug for general link
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      supabase!
        .from("profiles")
        .select("dj_slug")
        .eq("id", data.session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile?.dj_slug) setDjSlug(profile.dj_slug);
        });
    });
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const copyLink = async (link: string, eventId: string) => {
    await navigator.clipboard.writeText(link);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyDjLink = async () => {
    if (!djSlug) return;
    const origin = getSafeOrigin();
    await navigator.clipboard.writeText(`${origin}/dj/${djSlug}`);
    setCopiedDjLink(true);
    setTimeout(() => setCopiedDjLink(false), 2000);
  };

  const confirmIntake = async (eventId: string) => {
    const bearer = await getBearer();
    if (!bearer) return;
    await fetch(`/api/events/${eventId}/confirm`, {
      method: "POST",
      headers: { Authorization: `Bearer ${bearer}` },
    });
    loadEvents();
  };

  const archiveEvent = async (eventId: string) => {
    const bearer = await getBearer();
    if (!bearer) return;
    await fetch(`/api/events/${eventId}/archive`, {
      method: "POST",
      headers: { Authorization: `Bearer ${bearer}` },
    });
    loadEvents();
  };

  const toggleLock = async (eventId: string) => {
    const bearer = await getBearer();
    if (!bearer) return;
    await fetch(`/api/events/${eventId}/lock`, {
      method: "POST",
      headers: { Authorization: `Bearer ${bearer}` },
    });
    loadEvents();
  };

  const toggleClosePortal = async (eventId: string) => {
    const bearer = await getBearer();
    if (!bearer) return;
    await fetch(`/api/events/${eventId}/close-portal`, {
      method: "POST",
      headers: { Authorization: `Bearer ${bearer}` },
    });
    loadEvents();
  };

  const saveNotes = async (eventId: string, notes: string) => {
    const bearer = await getBearer();
    if (!bearer) return;
    await fetch(`/api/events/${eventId}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
      body: JSON.stringify({ notes }),
    });
  };

  const intakeEvents = events.filter((e) => (e.status ?? "active") === "intake");
  const activeEvents = events.filter((e) => {
    const s = e.status ?? "active";
    return s === "active" || s === "completed";
  });
  const archivedEvents = events.filter((e) => (e.status ?? "active") === "archived" || e.is_archived);

  const tabCounts: Record<EventTab, number> = {
    intake: intakeEvents.length,
    active: activeEvents.length,
    archived: archivedEvents.length,
  };

  const tabs: { id: EventTab; label: string; icon: React.ReactNode }[] = [
    { id: "active", label: "פעילים", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "intake", label: "פניות", icon: <Inbox className="w-3.5 h-3.5" /> },
    { id: "archived", label: "ארכיון", icon: <Archive className="w-3.5 h-3.5" /> },
  ];

  const currentList = activeTab === "intake" ? intakeEvents : activeTab === "active" ? activeEvents : archivedEvents;

  const [briefEventId, setBriefEventId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* DJ General Link */}
      {!djSlug && (
        <div className="glass-card p-4 flex items-center gap-3 text-center">
          <Share2 className="w-4 h-4 text-muted flex-shrink-0" />
          <p className="text-sm text-secondary flex-1">
            כדי ליצור לינקים ללקוחות, הגדירו קודם את הפרופיל שלכם בטאב{" "}
            <span className="font-bold text-brand-blue">הגדרות</span>
          </p>
        </div>
      )}
      {djSlug && (
        <div className="glass-card p-4 flex items-center gap-3 flex-wrap">
          <Share2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted mb-0.5">הלינק הכללי שלך — שלח ללקוחות</p>
            <code className="text-sm text-secondary truncate block" dir="ltr">
              {getDjLink(djSlug)}
            </code>
          </div>
          <button
            onClick={copyDjLink}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 flex-shrink-0"
          >
            {copiedDjLink ? (
              <><Check className="w-3.5 h-3.5 text-brand-green" /> הועתק!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> העתק</>
            )}
          </button>

          <div className="w-full pt-3 mt-2 border-t border-glass">
            <p className="text-xs text-muted mb-2">יצירת לינק לפי סוג אירוע</p>
            <div className="flex flex-wrap gap-2">
              {linkPresets.map((p) => {
                const url = p.type ? getDjLink(djSlug, p.type) : getDjLink(djSlug);
                return (
                  <div key={p.id} className="flex items-center gap-1.5">
                    <button
                      onClick={() => void copyPresetLink(p.id, p.type)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-glass text-secondary hover:text-foreground hover:border-brand-blue/30 transition-all"
                      title={url}
                    >
                      {copiedPreset === p.id ? "הועתק" : p.label}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`היי! הנה הלינק למסע המוזיקלי שלכם 🎵\n${url}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md hover:bg-brand-green/10 transition-colors"
                      title="שלח בוואטסאפ"
                    >
                      <Share2 className="w-3.5 h-3.5 text-brand-green" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Header + Create */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">אירועים</h2>
          <p className="text-sm text-secondary">
            צרו אירוע, קבלו לינק לפורטל, שלחו ללקוח
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

      {/* Tabs */}
      <div className="flex gap-1 border-b border-glass pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-muted hover:text-secondary"
              }`}
          >
            {tab.icon}
            {tab.label}
            {tabCounts[tab.id] > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id
                ? "bg-brand-blue/10 text-brand-blue"
                : tab.id === "intake" && tabCounts.intake > 0
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-glass text-muted"
                }`}>
                {tabCounts[tab.id]}
              </span>
            )}
          </button>
        ))}
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
      {!loading && currentList.length === 0 && (
        <div className="glass-card p-8 text-center">
          {activeTab === "intake" ? (
            <>
              <Inbox className="w-10 h-10 mx-auto mb-3 text-muted" />
              <h3 className="font-bold text-lg mb-2">אין פניות חדשות</h3>
              <p className="text-sm text-secondary">
                כשלקוחות ימלאו פרטים דרך הלינק שלך, הם יופיעו כאן
              </p>
            </>
          ) : activeTab === "active" ? (
            <>
              <Calendar className="w-10 h-10 mx-auto mb-3 text-muted" />
              <h3 className="font-bold text-lg mb-2">אין אירועים פעילים</h3>
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
            </>
          ) : (
            <>
              <Archive className="w-10 h-10 mx-auto mb-3 text-muted" />
              <h3 className="font-bold text-lg mb-2">אין אירועים בארכיון</h3>
            </>
          )}
        </div>
      )}

      {/* Event List */}
      {!loading && currentList.length > 0 && (
        <div className={`space-y-3 ${activeTab === "archived" ? "opacity-60" : ""}`}>
          {currentList.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              copiedId={copiedId}
              expandedId={expandedId}
              onCopy={() => {
                const link = event.portal_token
                  ? getPortalLink(event.portal_token)
                  : getEventLink(event.magic_token);
                copyLink(link, event.id);
              }}
              onToggleExpand={() =>
                setExpandedId(expandedId === event.id ? null : event.id)
              }
              onConfirm={activeTab === "intake" ? () => confirmIntake(event.id) : undefined}
              onArchive={() => archiveEvent(event.id)}
              onViewBrief={() => setBriefEventId(event.id)}
              onToggleLock={() => toggleLock(event.id)}
              onToggleClosePortal={() => toggleClosePortal(event.id)}
              onSaveNotes={(notes) => saveNotes(event.id, notes)}
            />
          ))}
        </div>
      )}

      {/* Brief Viewer Modal */}
      <AnimatePresence>
        {briefEventId && (
          <BriefViewer
            eventId={briefEventId}
            onClose={() => setBriefEventId(null)}
          />
        )}
      </AnimatePresence>
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
  onConfirm,
  onArchive,
  onViewBrief,
  onToggleLock,
  onToggleClosePortal,
  onSaveNotes,
}: {
  event: DJEvent;
  copiedId: string | null;
  expandedId: string | null;
  onCopy: () => void;
  onToggleExpand: () => void;
  onConfirm?: () => void;
  onArchive?: () => void;
  onViewBrief?: () => void;
  onToggleLock?: () => void;
  onToggleClosePortal?: () => void;
  onSaveNotes?: (notes: string) => void;
}) {
  const isExpanded = expandedId === event.id;
  const isCopied = copiedId === event.id;
  const contactName = event.contact?.name;
  const names = contactName
    || [event.couple_name_a, event.couple_name_b].filter(Boolean).join(" & ");
  const link = event.portal_token
    ? getPortalLink(event.portal_token)
    : getEventLink(event.magic_token);
  const status = event.status ?? "active";
  const isIntake = status === "intake";

  return (
    <motion.div
      layout
      className={`glass-card p-4 space-y-3 ${isIntake ? "border-amber-500/20" : ""}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            style={{
              background: isIntake ? "rgba(245,158,11,0.1)" : "rgba(5,156,192,0.1)",
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
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>{EVENT_TYPE_LABELS[event.event_type]}</span>
              {event.event_date && <span>· {formatDate(event.event_date)}</span>}
              {event.contact?.phone && (
                <span dir="ltr" className="text-secondary">· {event.contact.phone}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status badge */}
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${isIntake
            ? "border-amber-500/30 text-amber-400 bg-amber-500/5"
            : status === "completed"
              ? "border-green-500/30 text-green-400 bg-green-500/5"
              : "border-glass text-muted"
            }`}>
            {isIntake
              ? "פנייה"
              : status === "completed"
                ? "הושלם ✓"
                : STAGE_LABELS[event.current_stage] ?? `שלב ${event.current_stage}`}
          </span>
          {event.locked_at && <Lock className="w-3.5 h-3.5 text-amber-400" />}
          <button
            onClick={onCopy}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="העתק לינק פורטל"
          >
            {isCopied ? (
              <><Check className="w-3.5 h-3.5 text-brand-green" />הועתק!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" />לינק</>
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
              {/* Portal link row */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
                <Link2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <code className="text-xs text-secondary truncate flex-1" dir="ltr">
                  {link}
                </code>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`היי! הנה הלינק למסע המוזיקלי שלכם 🎵\n${link}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-md hover:bg-brand-green/10 transition-colors"
                  title="שלח בוואטסאפ"
                >
                  <Share2 className="w-3.5 h-3.5 text-brand-green" />
                </a>
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
                {(event.contact_phone || event.contact?.phone) && (
                  <a
                    href={`tel:${event.contact?.phone || event.contact_phone}`}
                    className="flex items-center gap-1.5 text-secondary hover:text-brand-blue transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-muted" />
                    <span dir="ltr">{event.contact?.phone || event.contact_phone}</span>
                    {event.contact_role && ` (${event.contact_role})`}
                  </a>
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

              {/* DJ Notes */}
              {onSaveNotes && <NotesField initialValue={event.dj_notes ?? ""} onSave={onSaveNotes} />}

              {/* Actions */}
              <div className="flex gap-2 pt-1 flex-wrap">
                {onConfirm && isIntake && (
                  <button
                    onClick={onConfirm}
                    className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    אשר פנייה
                  </button>
                )}
                {onViewBrief && event.current_stage > 0 && (
                  <button
                    onClick={onViewBrief}
                    className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    צפה בבריף
                  </button>
                )}
                {onToggleLock && status !== "archived" && (
                  <button
                    onClick={onToggleLock}
                    className="btn-secondary text-xs py-1.5 px-3 sm:px-4 flex items-center gap-1.5"
                    title={event.locked_at ? "בטל נעילה" : "נעל אירוע"}
                  >
                    {event.locked_at ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{event.locked_at ? "בטל נעילה" : "נעל"}</span>
                  </button>
                )}
                {onToggleClosePortal && status !== "archived" && (
                  <button
                    onClick={onToggleClosePortal}
                    className={`btn-secondary text-xs py-1.5 px-3 sm:px-4 flex items-center gap-1.5 ${event.portal_closed_at ? "text-brand-green" : "text-amber-400"}`}
                    title={event.portal_closed_at ? "פתח פורטל" : "סגור פורטל"}
                  >
                    {event.portal_closed_at ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{event.portal_closed_at ? "פתח פורטל" : "סגור פורטל"}</span>
                  </button>
                )}
                {onArchive && status !== "archived" && (
                  <button
                    onClick={onArchive}
                    className="btn-secondary text-xs py-1.5 px-3 sm:px-4 flex items-center gap-1.5 text-muted hover:text-foreground"
                    title="ארכיון"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ארכיון</span>
                  </button>
                )}
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

      const data = (await res.json()) as { event: { portal_token: string | null; magic_token: string } };
      setCreatedToken(data.event.portal_token || data.event.magic_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyAndClose = async () => {
    if (createdToken) {
      const link = getPortalLink(createdToken);
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
                {getPortalLink(createdToken)}
              </code>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyAndClose}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-3"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    הועתק! סוגר...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    העתק לינק
                  </>
                )}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`היי! הנה הלינק למסע המוזיקלי שלכם 🎵\n${getPortalLink(createdToken)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-brand-green/30 text-brand-green hover:bg-brand-green/10 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                וואטסאפ
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Notes Field (debounced auto-save) ── */
function NotesField({
  initialValue,
  onSave,
}: {
  initialValue: string;
  onSave: (notes: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (text: string) => {
    setValue(text);
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave(text);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 1000);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted">
        <StickyNote className="w-3 h-3" />
        הערות פנימיות
        {saved && <span className="text-brand-green text-[10px]">נשמר ✓</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="הערות לעצמך על האירוע..."
        rows={2}
        className="w-full px-3 py-2 rounded-xl bg-transparent border border-glass text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue/50 transition-colors resize-none"
      />
    </div>
  );
}
