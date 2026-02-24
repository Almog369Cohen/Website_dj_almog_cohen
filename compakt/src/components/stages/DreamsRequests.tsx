"use client";

import { useState } from "react";
import { useEventStore } from "@/stores/eventStore";
import { useAdminStore } from "@/stores/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Link as LinkIcon,
  Sparkles,
  Music,
  Heart,
  GlassWater,
  ChevronLeft,
} from "lucide-react";
import type { MomentType, RequestType } from "@/lib/types";

const specialMoments: { type: MomentType; label: string; icon: React.ReactNode }[] = [
  { type: "ceremony_groom", label: "כניסה לחופה חתן", icon: <Heart className="w-4 h-4" /> },
  { type: "ceremony_bride", label: "כניסה לחופה כלה", icon: <Heart className="w-4 h-4" /> },
  { type: "glass_break", label: "שבירת כוס", icon: <GlassWater className="w-4 h-4" /> },
  { type: "slow", label: "סלואו", icon: <Music className="w-4 h-4" /> },
];

export function DreamsRequests() {
  const requests = useEventStore((s) => s.requests);
  const addRequest = useEventStore((s) => s.addRequest);
  const removeRequest = useEventStore((s) => s.removeRequest);
  const trackUpsellClick = useEventStore((s) => s.trackUpsellClick);
  const setStage = useEventStore((s) => s.setStage);
  const trackEvent = useEventStore((s) => s.trackEvent);

  const [freeText, setFreeText] = useState("");
  const [doText, setDoText] = useState("");
  const [dontText, setDontText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [activeMoment, setActiveMoment] = useState<MomentType | null>(null);
  const [momentText, setMomentText] = useState("");

  const addTextRequest = (type: RequestType, content: string, setter: (v: string) => void) => {
    if (!content.trim()) return;
    addRequest({ requestType: type, content: content.trim() });
    setter("");
  };

  const addLink = () => {
    if (!linkUrl.trim()) return;
    addRequest({ requestType: "link", content: linkUrl.trim() });
    setLinkUrl("");
  };

  const addMomentRequest = () => {
    if (!momentText.trim() || !activeMoment) return;
    addRequest({
      requestType: "special_moment",
      content: momentText.trim(),
      momentType: activeMoment,
    });
    setMomentText("");
    setActiveMoment(null);
  };

  const handleFinish = () => {
    trackEvent("stage_complete", { stage: 3 });
    setStage(4);
  };

  const adminUpsells = useAdminStore((s) => s.upsells);
  const upsells = adminUpsells.filter((u) => u.isActive && u.placement === "stage_4");

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <h1 className="text-2xl font-bold mb-1">✨ הרגעים שלכם</h1>
        <p className="text-secondary text-sm">
          ספרו לנו על הרגעים המיוחדים, בקשות וחלומות
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4 }}
          className="sm:hidden mt-3 text-xs text-muted"
        >
          גללו למטה ↓
        </motion.div>
      </motion.div>

      {/* Special Moments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5"
      >
        <h3 className="font-semibold mb-3 text-sm">רגעים מיוחדים</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {specialMoments.map((m) => (
            <button
              key={m.type}
              onClick={() => setActiveMoment(activeMoment === m.type ? null : m.type)}
              className={`chip ${activeMoment === m.type ? "active" : ""} flex items-center gap-1.5`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {activeMoment && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={momentText}
                  onChange={(e) => setMomentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMomentRequest()}
                  placeholder="מה חשוב לכם ברגע הזה?"
                  className="flex-1 px-3 py-2 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
                />
                <button
                  onClick={addMomentRequest}
                  className="p-2 rounded-xl bg-brand-blue text-white"
                  aria-label="הוסף"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show existing moment requests */}
        {requests
          .filter((r) => r.requestType === "special_moment")
          .map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 mt-2 text-sm text-secondary"
            >
              <span className="flex-1">
                {specialMoments.find((m) => m.type === r.momentType)?.label}: {r.content}
              </span>
              <button onClick={() => removeRequest(r.id)} className="text-muted hover:text-accent-danger">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
      </motion.div>

      {/* Free Text Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-5"
      >
        <h3 className="font-semibold mb-3 text-sm">בקשות חופשיות</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTextRequest("free_text", freeText, setFreeText)}
            placeholder="...שיר ספציפי, אמן, רגע"
            className="flex-1 px-3 py-2 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
          />
          <button
            onClick={() => addTextRequest("free_text", freeText, setFreeText)}
            className="p-2 rounded-xl bg-brand-blue text-white"
            aria-label="הוסף בקשה"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {requests
          .filter((r) => r.requestType === "free_text")
          .map((r) => (
            <div key={r.id} className="flex items-center gap-2 mt-2 text-sm text-secondary">
              <span className="flex-1">{r.content}</span>
              <button onClick={() => removeRequest(r.id)} className="text-muted hover:text-accent-danger">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
      </motion.div>

      {/* Do & Don't */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
      >
        <h3 className="font-semibold mb-3 text-sm">כן ולא</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-brand-green mb-1 block font-medium">✅ כן — חובה</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={doText}
                onChange={(e) => setDoText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTextRequest("do", doText, setDoText)}
                placeholder="שני שירים לפחות שאין סיכוי שאתם מוותרים עליהם ברחבה"
                className="flex-1 px-3 py-2 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-green transition-colors"
              />
              <button
                onClick={() => addTextRequest("do", doText, setDoText)}
                className="p-2 rounded-xl bg-brand-green text-white"
                aria-label="הוסף כן"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {requests
              .filter((r) => r.requestType === "do")
              .map((r) => (
                <div key={r.id} className="flex items-center gap-2 mt-1.5 text-sm text-brand-green">
                  <span className="flex-1">✅ {r.content}</span>
                  <button onClick={() => removeRequest(r.id)} className="text-muted hover:text-accent-danger">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>

          <div>
            <label className="text-xs mb-1 block font-medium" style={{ color: "var(--accent-danger)" }}>
              ❌ לא — קו אדום
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dontText}
                onChange={(e) => setDontText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTextRequest("dont", dontText, setDontText)}
                placeholder="שירים / סגנונות שלא בשום אופן"
                className="flex-1 px-3 py-2 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent-danger transition-colors"
              />
              <button
                onClick={() => addTextRequest("dont", dontText, setDontText)}
                className="p-2 rounded-xl text-white"
                style={{ background: "var(--accent-danger)" }}
                aria-label="הוסף לא"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {requests
              .filter((r) => r.requestType === "dont")
              .map((r) => (
                <div key={r.id} className="flex items-center gap-2 mt-1.5 text-sm" style={{ color: "var(--accent-danger)" }}>
                  <span className="flex-1">❌ {r.content}</span>
                  <button onClick={() => removeRequest(r.id)} className="text-muted hover:text-accent-danger">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </motion.div>

      {/* Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-5"
      >
        <h3 className="font-semibold mb-3 text-sm">🔗 לינקים לדוגמה</h3>
        <div className="flex gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLink()}
            placeholder="YouTube / Spotify URL"
            dir="ltr"
            className="flex-1 px-3 py-2 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
          />
          <button
            onClick={addLink}
            className="p-2 rounded-xl bg-brand-blue text-white"
            aria-label="הוסף לינק"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
        {requests
          .filter((r) => r.requestType === "link")
          .map((r) => (
            <div key={r.id} className="flex items-center gap-2 mt-2 text-sm">
              <a
                href={r.content}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-brand-blue truncate hover:underline"
                dir="ltr"
              >
                {r.content}
              </a>
              <button onClick={() => removeRequest(r.id)} className="text-muted hover:text-accent-danger">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
      </motion.div>

      {/* Upsells */}
      {upsells.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {upsells.map((upsell) => (
            <div
              key={upsell.id}
              className="glass-card p-5 relative overflow-hidden"
              style={{
                borderImage: "linear-gradient(135deg, #059cc0, #03b28c) 1",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">{upsell.titleHe}</h4>
                  <p className="text-xs text-secondary mb-2">{upsell.descriptionHe}</p>
                  {upsell.priceHint && (
                    <span className="text-xs text-muted">{upsell.priceHint}</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    trackUpsellClick(upsell.id);
                    trackEvent("upsell_click", { upsellId: upsell.id });
                  }}
                  className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap"
                >
                  {upsell.ctaTextHe} →
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Continue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <button
          onClick={handleFinish}
          className="btn-primary w-full text-base flex items-center justify-center gap-2"
        >
          סיימנו! צרו Music Brief
          <ChevronLeft className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
