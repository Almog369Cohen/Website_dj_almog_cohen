"use client";

import { useState } from "react";
import { useEventStore } from "@/stores/eventStore";
import { motion } from "framer-motion";
import { Music, PartyPopper, Briefcase, Star, Heart, UserCircle } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { EventType } from "@/lib/types";

const eventTypes: { type: EventType; label: string; icon: React.ReactNode }[] = [
  { type: "wedding", label: "חתונה", icon: <Heart className="w-6 h-6" /> },
  { type: "bar_mitzvah", label: "בר/בת מצווה", icon: <Star className="w-6 h-6" /> },
  { type: "private", label: "אירוע פרטי", icon: <PartyPopper className="w-6 h-6" /> },
  { type: "corporate", label: "אירוע עסקי", icon: <Briefcase className="w-6 h-6" /> },
  { type: "other", label: "אחר", icon: <Music className="w-6 h-6" /> },
];

export function EventSetup() {
  const event = useEventStore((s) => s.event);
  const createEvent = useEventStore((s) => s.createEvent);
  const updateEvent = useEventStore((s) => s.updateEvent);
  const setStage = useEventStore((s) => s.setStage);
  const trackEvent = useEventStore((s) => s.trackEvent);

  const [selectedType, setSelectedType] = useState<EventType>(event?.eventType || "wedding");
  const [coupleNameA, setCoupleNameA] = useState(event?.coupleNameA || "");
  const [coupleNameB, setCoupleNameB] = useState(event?.coupleNameB || "");
  const [eventDate, setEventDate] = useState(event?.eventDate || "");
  const [venue, setVenue] = useState(event?.venue || "");
  const [contactPhone, setContactPhone] = useState(event?.contactPhone || "");
  const [contactRole, setContactRole] = useState(event?.contactRole || "groom");
  const [nameHint, setNameHint] = useState(false);
  const [showNoNameConfirm, setShowNoNameConfirm] = useState(false);

  const nameLabels = (() => {
    if (selectedType === "corporate") {
      return {
        a: "שם החברה",
        b: "איש קשר",
        aPlaceholder: "שם החברה",
        bPlaceholder: "שם מלא",
      };
    }

    if (selectedType === "bar_mitzvah") {
      return {
        a: "שם חתן/כלת בר/בת המצווה",
        b: "שם ההורים",
        aPlaceholder: "שם",
        bPlaceholder: "שמות ההורים",
      };
    }

    return {
      a: "שם חתן",
      b: "שם כלה",
      aPlaceholder: "דנה",
      bPlaceholder: "אלון",
    };
  })();

  const proceedToStage1 = () => {
    if (event) {
      updateEvent({
        eventType: selectedType,
        coupleNameA,
        coupleNameB,
        eventDate: eventDate || undefined,
        venue: venue || undefined,
        contactPhone: contactPhone || undefined,
        contactRole: contactRole || undefined,
      });
      setStage(1);
      trackEvent("stage_complete", { stage: 0 });
    } else {
      createEvent({
        eventType: selectedType,
        coupleNameA: coupleNameA || undefined,
        coupleNameB: coupleNameB || undefined,
        eventDate: eventDate || undefined,
        venue: venue || undefined,
        contactPhone: contactPhone || undefined,
        contactRole: contactRole || undefined,
      });
      trackEvent("event_created", { eventType: selectedType });

      setStage(1);
      trackEvent("stage_complete", { stage: 0 });
    }
  };

  const handleStart = () => {
    if (!coupleNameA.trim() && !coupleNameB.trim()) {
      setNameHint(true);
      setTimeout(() => setNameHint(false), 1600);
      setShowNoNameConfirm(true);
      return;
    }
    proceedToStage1();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <motion.div
        key="form"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card p-6 sm:p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }}
          >
            <Music className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Compakt</h1>
          <p className="text-secondary text-sm">בואו ניצור את האירוע שלכם!</p>
        </div>

        <div className="space-y-6">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium mb-3">סוג האירוע</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {eventTypes.map((et) => (
                <button
                  key={et.type}
                  onClick={() => setSelectedType(et.type)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${selectedType === et.type
                    ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                    : "border-glass text-secondary hover:border-brand-blue/50"
                    }`}
                >
                  {et.icon}
                  <span className="text-xs font-medium">{et.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">{nameLabels.a}</label>
              <input
                type="text"
                value={coupleNameA}
                onChange={(e) => setCoupleNameA(e.target.value)}
                placeholder={nameLabels.aPlaceholder}
                className={`w-full px-3 py-2.5 rounded-xl bg-transparent border text-foreground placeholder:text-muted text-sm focus:outline-none transition-colors ${nameHint ? "border-accent-danger" : "border-glass focus:border-brand-blue"
                  }`}
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">{nameLabels.b}</label>
              <input
                type="text"
                value={coupleNameB}
                onChange={(e) => setCoupleNameB(e.target.value)}
                placeholder={nameLabels.bPlaceholder}
                className={`w-full px-3 py-2.5 rounded-xl bg-transparent border text-foreground placeholder:text-muted text-sm focus:outline-none transition-colors ${nameHint ? "border-accent-danger" : "border-glass focus:border-brand-blue"
                  }`}
              />
            </div>
          </div>

          {nameHint && (
            <p className="text-xs" style={{ color: "var(--accent-danger)" }}>
              מומלץ להוסיף לפחות שם אחד (אפשר גם אחר כך)
            </p>
          )}

          {/* Date */}
          <div>
            <label className="block text-xs text-muted mb-1">תאריך (אופציונלי)</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-transparent border border-glass text-foreground text-sm focus:outline-none focus:border-brand-blue transition-colors"
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs text-muted mb-1">אולם / מקום (אופציונלי)</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="שם האולם או העיר"
              className="w-full px-3 py-2.5 rounded-xl bg-transparent border border-glass text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-brand-blue transition-colors"
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">מספר נייד (אופציונלי)</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="05X-XXXXXXX"
                className="w-full px-3 py-2.5 rounded-xl bg-transparent border border-glass text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">שיוך לאיש קשר</label>
              <select
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-transparent border border-glass text-foreground text-sm focus:outline-none focus:border-brand-blue transition-colors"
              >
                <option value="groom">חתן</option>
                <option value="bride">כלה</option>
                <option value="inviter">מזמין</option>
                <option value="planner">מארגן</option>
                <option value="mother">אמא</option>
                <option value="father">אבא</option>
                <option value="other">אחר</option>
              </select>
            </div>
          </div>

          <button onClick={handleStart} className="btn-primary w-full text-base py-3.5">
            יאללה מתחילים →
          </button>

          <ConfirmModal
            open={showNoNameConfirm}
            title="להמשיך בלי שמות?"
            description="אפשר להוסיף שמות גם אחר כך"
            icon={<UserCircle className="w-8 h-8 text-muted" />}
            confirmText="כן, המשיכו"
            cancelText="אוסיף שמות"
            onConfirm={() => { setShowNoNameConfirm(false); proceedToStage1(); }}
            onCancel={() => setShowNoNameConfirm(false)}
          />

          <div className="text-center mt-4">
            <a
              href="/admin"
              className="text-xs text-muted hover:text-brand-blue transition-colors"
            >
              כניסת DJ →
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
