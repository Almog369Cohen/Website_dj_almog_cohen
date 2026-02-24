"use client";

import { useState } from "react";
import { useEventStore } from "@/stores/eventStore";
import { motion } from "framer-motion";
import { PartyPopper, Briefcase, Star, Heart, UserCircle, Music, Disc3 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { VinylSpinner } from "@/components/ui/VinylSpinner";
import type { EventType } from "@/lib/types";

const eventTypes: { type: EventType; label: string; icon: React.ReactNode; gradient: string }[] = [
  { type: "wedding", label: "חתונה", icon: <Heart className="w-5 h-5" />, gradient: "from-rose-400/20 to-pink-500/10" },
  { type: "bar_mitzvah", label: "בר/בת מצווה", icon: <Star className="w-5 h-5" />, gradient: "from-amber-400/20 to-yellow-500/10" },
  { type: "private", label: "אירוע פרטי", icon: <PartyPopper className="w-5 h-5" />, gradient: "from-purple-400/20 to-indigo-500/10" },
  { type: "corporate", label: "אירוע עסקי", icon: <Briefcase className="w-5 h-5" />, gradient: "from-cyan-400/20 to-blue-500/10" },
  { type: "other", label: "אחר", icon: <Music className="w-5 h-5" />, gradient: "from-emerald-400/20 to-teal-500/10" },
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
      {/* Hero Header — no card wrapper, floats on ambient */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.1 }}
          className="inline-block mb-5"
        >
          <VinylSpinner size={88} spinning />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-3 text-gold"
        >
          Compakt
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-secondary text-sm font-light"
        >
          בואו ניצור את המסע המוזיקלי שלכם
        </motion.p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 sm:p-8 space-y-7"
      >
        {/* Event Type — large cards with gradient */}
        <div>
          <label className="block text-xs text-muted mb-3 font-medium tracking-wide">סוג האירוע</label>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {eventTypes.map((et) => (
              <motion.button
                key={et.type}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(et.type)}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition-all ${selectedType === et.type
                  ? "border-brand-blue bg-gradient-to-br from-brand-blue/15 to-brand-blue/5 text-brand-blue shadow-gold-sm"
                  : "border-glass-strong text-secondary hover:border-brand-blue/30 hover:bg-white/[0.02]"
                  }`}
              >
                {et.icon}
                <span className="text-[11px] font-semibold">{et.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Names */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">{nameLabels.a}</label>
            <input
              type="text"
              value={coupleNameA}
              onChange={(e) => setCoupleNameA(e.target.value)}
              placeholder={nameLabels.aPlaceholder}
              className={`input-field ${nameHint ? "!border-accent-danger" : ""}`}
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">{nameLabels.b}</label>
            <input
              type="text"
              value={coupleNameB}
              onChange={(e) => setCoupleNameB(e.target.value)}
              placeholder={nameLabels.bPlaceholder}
              className={`input-field ${nameHint ? "!border-accent-danger" : ""}`}
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
          <label className="block text-xs text-muted mb-1.5 font-medium">תאריך (אופציונלי)</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block text-xs text-muted mb-1.5 font-medium">אולם / מקום (אופציונלי)</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="שם האולם או העיר"
            className="input-field"
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">מספר נייד (אופציונלי)</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="05X-XXXXXXX"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">שיוך לאיש קשר</label>
            <select
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
              className="input-field"
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

        {/* Gold CTA */}
        <button onClick={handleStart} className="btn-primary w-full text-base py-4 font-display font-black tracking-wide">
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

        <div className="text-center mt-2">
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand-blue transition-colors"
          >
            <Disc3 className="w-3.5 h-3.5" />
            כניסת DJ
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
