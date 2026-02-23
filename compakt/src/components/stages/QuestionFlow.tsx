"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/stores/eventStore";
import { useAdminStore } from "@/stores/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, SkipForward, Home, Shield } from "lucide-react";
import type { Question } from "@/lib/types";

const ETHNIC_MUSIC_Q_ID = "ethnic_music";
const ETHNIC_MUSIC_TEXT_ID = "ethnic_music_edah";

export function QuestionFlow() {
  const router = useRouter();
  const event = useEventStore((s) => s.event);
  const answers = useEventStore((s) => s.answers);
  const saveAnswer = useEventStore((s) => s.saveAnswer);
  const setStage = useEventStore((s) => s.setStage);
  const trackEvent = useEventStore((s) => s.trackEvent);

  const adminQuestions = useAdminStore((s) => s.questions);
  const baseQuestions = adminQuestions
    .filter((q) => q.isActive && q.eventType === (event?.eventType || "wedding"))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const ethnicMusicQuestion: Question = {
    id: ETHNIC_MUSIC_Q_ID,
    eventType: event?.eventType || "wedding",
    sortOrder: 10_000,
    questionHe: "רוצים לשלב גם מוזיקת עדות?",
    questionType: "single_select",
    options: [
      { label: "כן", value: "yes" },
      { label: "לא", value: "no" },
    ],
    isActive: true,
  };

  const questions = [...baseQuestions, ethnicMusicQuestion];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showEthnicModal, setShowEthnicModal] = useState(false);
  const [ethnicText, setEthnicText] = useState(
    typeof answers.find((a) => a.questionId === ETHNIC_MUSIC_TEXT_ID)?.answerValue === "string"
      ? (answers.find((a) => a.questionId === ETHNIC_MUSIC_TEXT_ID)?.answerValue as string)
      : ""
  );

  const question = questions[currentIndex];
  const total = questions.length;
  const existingAnswer = question ? answers.find((a) => a.questionId === question.id) : undefined;

  const canContinue = (() => {
    if (!question) return false;
    const v = existingAnswer?.answerValue;

    if (question.id === ETHNIC_MUSIC_Q_ID) {
      return v === "yes" || v === "no";
    }

    switch (question.questionType) {
      case "single_select":
        return typeof v === "string" && v.trim().length > 0;
      case "multi_select":
        return Array.isArray(v) && v.length > 0;
      case "slider":
        return typeof v === "number" && Number.isFinite(v);
      case "number":
        return typeof v === "number" && Number.isFinite(v) && v > 0;
      case "text":
        return typeof v === "string" && v.trim().length > 0;
      case "demographics": {
        if (typeof v !== "string" || !v.trim()) return false;
        try {
          const parsed = JSON.parse(v) as {
            totalGuests?: number;
            groups?: { id: string; count: number }[];
            presetId?: string;
          };
          const totalGuests = Number(parsed.totalGuests);
          const groups = Array.isArray(parsed.groups) ? parsed.groups : [];
          const sum = groups.reduce((acc, g) => acc + (Number(g.count) || 0), 0);

          const hasAnyCounts = sum > 0;
          const hasPreset = typeof parsed.presetId === "string" && parsed.presetId.trim().length > 0;
          const hasTotal = Number.isFinite(totalGuests) && totalGuests > 0;

          return hasTotal && (hasPreset || hasAnyCounts || true);
        } catch {
          return false;
        }
      }
      default:
        return false;
    }
  })();

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      trackEvent("stage_complete", { stage: 1 });
      setStage(2);
    }
  }, [currentIndex, total, setStage, trackEvent]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    } else {
      const ok = confirm("לחזור להגדרות האירוע? אפשר תמיד לחזור אחר כך");
      if (ok) setStage(0);
    }
  }, [currentIndex, setStage]);

  const skip = useCallback(() => {
    trackEvent("question_skip", { questionId: question?.id });
    goNext();
  }, [goNext, trackEvent, question]);

  if (!question) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              trackEvent("navigate_home", { from: "questions" });
              setStage(0);
              router.push("/");
            }}
            className="glass-card p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label="חזרה למסך הבית"
            title="בית"
          >
            <Home className="w-4 h-4 text-muted" />
          </button>

          <button
            onClick={() => {
              trackEvent("navigate_admin", { from: "questions" });
              router.push("/admin");
            }}
            className="glass-card p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label="כניסה ל-DJ"
            title="DJ"
          >
            <Shield className="w-4 h-4 text-muted" />
          </button>
        </div>
        <div className="text-xs text-muted" />
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i === currentIndex ? "active" : i < currentIndex ? "done" : ""
              }`}
          />
        ))}
      </div>

      <div className="text-center text-xs text-muted mb-4">
        {currentIndex + 1} / {total}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={question.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <QuestionCard
            question={question}
            existingValue={existingAnswer?.answerValue}
            onAnswer={(value) => {
              if (question.id === ETHNIC_MUSIC_Q_ID) {
                if (value === "yes") {
                  saveAnswer(ETHNIC_MUSIC_Q_ID, "yes");
                  setShowEthnicModal(true);
                  trackEvent("ethnic_music_yes", {});
                  return;
                }
                saveAnswer(ETHNIC_MUSIC_Q_ID, "no");
                saveAnswer(ETHNIC_MUSIC_TEXT_ID, "");
                trackEvent("ethnic_music_no", {});
                return;
              }

              saveAnswer(question.id, value);
            }}
            onSubmitText={() => {
              if (canContinue) goNext();
            }}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showEthnicModal && (
          <EthnicMusicModal
            value={ethnicText}
            onChange={setEthnicText}
            onClose={() => setShowEthnicModal(false)}
            onSave={() => {
              saveAnswer(ETHNIC_MUSIC_TEXT_ID, ethnicText.trim());
              setShowEthnicModal(false);
              setTimeout(goNext, 200);
            }}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 px-2">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-secondary hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          הקודם
        </button>

        <button
          onClick={skip}
          className="flex items-center gap-1 text-sm text-muted hover:text-secondary transition-colors"
        >
          דלג
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={goNext}
          disabled={!canContinue}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${canContinue
            ? "text-brand-blue hover:text-brand-blue/80"
            : "text-muted opacity-60 cursor-not-allowed"
            }`}
        >
          המשך
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EthnicMusicModal({
  value,
  onChange,
  onClose,
  onSave,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card p-6 w-full max-w-md space-y-4"
      >
        <div>
          <h3 className="font-bold text-lg">מה העדה שלכם?</h3>
          <p className="text-xs text-muted">אפשר לכתוב חופשי (למשל: מרוקאי/תימני/בוכרי/רוסי/מעורב וכו׳)</p>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="...כתבו כאן"
          className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-brand-blue transition-colors resize-none"
        />

        <div className="flex gap-2">
          <button type="button" onClick={onSave} className="btn-primary flex-1">
            שמור
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            ביטול
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function QuestionCard({
  question,
  existingValue,
  onAnswer,
  onSubmitText,
}: {
  question: Question;
  existingValue?: string | string[] | number;
  onAnswer: (value: string | string[] | number) => void;
  onSubmitText: () => void;
}) {
  const existingDemographics = (() => {
    if (question.questionType !== "demographics") return null;
    if (typeof existingValue !== "string" || !existingValue.trim()) return null;
    try {
      const parsed = JSON.parse(existingValue) as {
        totalGuests?: number;
        groups?: { id: string; count: number }[];
        presetId?: string;
      };
      return parsed;
    } catch {
      return null;
    }
  })();

  const [multiSelected, setMultiSelected] = useState<string[]>(
    Array.isArray(existingValue) ? existingValue : typeof existingValue === "string" ? [existingValue] : []
  );
  const [textValue, setTextValue] = useState(
    typeof existingValue === "string" ? existingValue : ""
  );
  const [sliderValue, setSliderValue] = useState(
    typeof existingValue === "number" ? existingValue : 3
  );

  const [numberValue, setNumberValue] = useState(
    typeof existingValue === "number" ? String(existingValue) : ""
  );

  const [demoTotal, setDemoTotal] = useState(() =>
    existingDemographics?.totalGuests ? String(existingDemographics.totalGuests) : ""
  );
  const [demoGroups, setDemoGroups] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = { kids: "", teens: "", young: "", adults: "", older: "" };
    for (const g of existingDemographics?.groups || []) {
      if (typeof g?.id === "string" && typeof g?.count === "number") {
        if (g.id in base) base[g.id] = String(g.count);
      }
    }
    return base;
  });

  const [demoPreset, setDemoPreset] = useState<string>(() => existingDemographics?.presetId || "");
  const [showAdvancedDemo, setShowAdvancedDemo] = useState(!!existingDemographics);

  const demographicsSpec = [
    { id: "kids", label: "ילדים (0-12)", midAge: 8 },
    { id: "teens", label: "נוער (13-17)", midAge: 15 },
    { id: "young", label: "צעירים (18-29)", midAge: 24 },
    { id: "adults", label: "מבוגרים (30-49)", midAge: 38 },
    { id: "older", label: "50+", midAge: 58 },
  ] as const;

  const getTotalGuestsNumber = () => {
    const n = Number(demoTotal);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const computePresetGroups = (total: number, presetId: string) => {
    const preset = demoPresets.find((p) => p.id === presetId);
    const ids = demographicsSpec.map((d) => d.id);
    if (!preset) {
      return ids.map((id) => ({ id, count: 0 }));
    }

    const computed: Record<string, number> = {};
    let used = 0;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const w = (preset.weights as Record<string, number>)[id] ?? 0;
      const c = i === ids.length - 1 ? Math.max(0, total - used) : Math.round(total * w);
      computed[id] = c;
      used += c;
    }

    return ids.map((id) => ({ id, count: computed[id] ?? 0 }));
  };

  const getCurrentGroupCounts = () => {
    return demographicsSpec.map((s) => ({ id: s.id, count: Number(demoGroups[s.id] || 0) || 0 }));
  };

  const getCurrentSum = () => {
    return getCurrentGroupCounts().reduce((acc, g) => acc + g.count, 0);
  };

  const demoPresets = [
    {
      id: "mostly_young",
      label: "רוב צעירים (18-29)",
      weights: { kids: 0.05, teens: 0.05, young: 0.6, adults: 0.25, older: 0.05 },
    },
    {
      id: "mostly_family",
      label: "משפחות (הרבה ילדים)",
      weights: { kids: 0.25, teens: 0.1, young: 0.25, adults: 0.3, older: 0.1 },
    },
    {
      id: "mostly_adults",
      label: "רוב מבוגרים (30+)",
      weights: { kids: 0.05, teens: 0.05, young: 0.2, adults: 0.45, older: 0.25 },
    },
    {
      id: "mixed",
      label: "מיקס של הכל",
      weights: { kids: 0.15, teens: 0.1, young: 0.3, adults: 0.3, older: 0.15 },
    },
  ] as const;

  const computeAvgAge = (groups: { id: string; count: number }[]) => {
    let sum = 0;
    let weight = 0;
    for (const g of groups) {
      const spec = demographicsSpec.find((s) => s.id === g.id);
      const c = Number(g.count) || 0;
      if (!spec || c <= 0) continue;
      sum += c * spec.midAge;
      weight += c;
    }
    if (weight <= 0) return null;
    return Math.round((sum / weight) * 10) / 10;
  };

  const emitDemographics = (
    nextTotal: string,
    nextGroups: Record<string, string>,
    presetId: string
  ) => {
    const totalGuests = Number(nextTotal);

    let groups = demographicsSpec
      .map((s) => ({ id: s.id, count: Number(nextGroups[s.id] || 0) }))
      .filter((g) => Number.isFinite(g.count) && g.count >= 0);

    if (presetId && Number.isFinite(totalGuests) && totalGuests > 0) {
      groups = computePresetGroups(totalGuests, presetId);
    }

    const avgAge = computeAvgAge(groups);
    onAnswer(
      JSON.stringify({
        totalGuests: Number.isFinite(totalGuests) ? totalGuests : undefined,
        groups,
        avgAge,
        presetId: presetId || undefined,
      })
    );
  };

  return (
    <div className="glass-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-center mb-6 leading-relaxed">
        {question.questionHe}
      </h2>

      {/* Single Select */}
      {question.questionType === "single_select" && question.options && (
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((opt) => (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAnswer(opt.value)}
              className={`w-full min-h-[52px] text-right px-3 py-3 rounded-xl border transition-all whitespace-normal break-words ${existingValue === opt.value
                ? "border-brand-blue bg-brand-blue/10 text-brand-blue font-medium"
                : "border-glass text-secondary hover:border-brand-blue/50"
                }`}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      )}

      {/* Demographics */}
      {question.questionType === "demographics" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1">סה״כ אורחים (בערך)</label>
            <input
              type="text"
              value={demoTotal}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, "");
                setDemoTotal(cleaned);
                emitDemographics(cleaned, demoGroups, demoPreset);
              }}
              inputMode="numeric"
              placeholder="לדוגמה: 300"
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-brand-blue transition-colors"
            />
            {!demoTotal.trim() && (
              <div className="text-[11px] mt-1" style={{ color: "var(--accent-danger)" }}>
                צריך למלא סה״כ אורחים כדי להמשיך
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted">במילה אחת — מי הרוב?</div>
            <div className="grid grid-cols-2 gap-2">
              {demoPresets.map((p) => {
                const active = demoPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const next = active ? "" : p.id;
                      setDemoPreset(next);
                      const total = getTotalGuestsNumber();
                      if (next && total) {
                        const computed = computePresetGroups(total, next);
                        const nextGroups: Record<string, string> = { ...demoGroups };
                        for (const g of computed) nextGroups[g.id] = String(g.count);
                        setDemoGroups(nextGroups);
                        emitDemographics(String(total), nextGroups, next);
                      } else {
                        emitDemographics(demoTotal, demoGroups, next);
                      }
                    }}
                    className={`w-full min-h-[52px] text-right px-3 py-3 rounded-xl border transition-all whitespace-normal break-words ${active
                      ? "border-brand-blue bg-brand-blue/10 text-brand-blue font-medium"
                      : "border-glass text-secondary hover:border-brand-blue/50"
                      }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-muted">
              טיפ: אם מילאת סה״כ אורחים ובחרת רוב — אנחנו נחשב חלוקה אוטומטית.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn-primary flex-1 text-sm"
              onClick={() => {
                const total = getTotalGuestsNumber();
                if (!total || !demoPreset) return;
                const computed = computePresetGroups(total, demoPreset);
                const nextGroups: Record<string, string> = { ...demoGroups };
                for (const g of computed) nextGroups[g.id] = String(g.count);
                setDemoGroups(nextGroups);
                emitDemographics(String(total), nextGroups, demoPreset);
              }}
              disabled={!getTotalGuestsNumber() || !demoPreset}
            >
              חשב אוטומטית
            </button>
            <button
              type="button"
              className="btn-secondary flex-1 text-sm"
              onClick={() => {
                const cleared: Record<string, string> = { kids: "", teens: "", young: "", adults: "", older: "" };
                setDemoGroups(cleared);
                emitDemographics(demoTotal, cleared, demoPreset);
              }}
            >
              נקה
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvancedDemo((v) => !v)}
              className="btn-secondary w-full text-sm"
            >
              {showAdvancedDemo ? "הסתר פירוט" : "פירוט מתקדם (לא חובה)"}
            </button>
          </div>

          {showAdvancedDemo && (
            <div className="space-y-2">
              <div className="text-xs text-muted">דייקו עם + / - (כמו מחשבון)</div>

              {demographicsSpec.map((g) => {
                const current = Number(demoGroups[g.id] || 0) || 0;
                const total = getTotalGuestsNumber();
                const sum = getCurrentSum();
                const canInc = total ? sum < total : true;

                const setCount = (nextCount: number) => {
                  const clamped = Math.max(0, Math.floor(nextCount));
                  const nextGroups = { ...demoGroups, [g.id]: String(clamped) };
                  setDemoGroups(nextGroups);
                  emitDemographics(demoTotal, nextGroups, demoPreset);
                };

                return (
                  <div key={g.id} className="flex items-center gap-2">
                    <div className="flex-1 text-sm text-secondary">{g.label}</div>
                    <button
                      type="button"
                      className="btn-secondary px-3 py-2 text-sm"
                      onClick={() => setCount(current - 10)}
                      disabled={current <= 0}
                    >
                      -
                    </button>
                    <div className="w-16 text-center text-sm font-semibold text-foreground">{current}</div>
                    <button
                      type="button"
                      className="btn-secondary px-3 py-2 text-sm"
                      onClick={() => {
                        if (!canInc) return;
                        setCount(current + 10);
                      }}
                      disabled={!canInc}
                    >
                      +
                    </button>
                  </div>
                );
              })}

              <div className="text-[11px] text-muted text-center">
                סה״כ שסימנת: {getCurrentSum()}{getTotalGuestsNumber() ? ` מתוך ${getTotalGuestsNumber()}` : ""}
              </div>
            </div>
          )}

          <div className="glass-card p-3 rounded-xl">
            <DemographicsSummary value={existingValue} />
          </div>

          <p className="text-[11px] text-muted text-center">
            אנחנו מחשבים ממוצע גילאים אוטומטי לפי החלוקה. זה לא חייב להיות מדויק — מספיק הערכה.
          </p>
        </div>
      )}

      {/* Multi Select */}
      {question.questionType === "multi_select" && question.options && (
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((opt) => {
            const isSelected = multiSelected.includes(opt.value);
            return (
              <motion.button
                key={opt.value}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const updated = isSelected
                    ? multiSelected.filter((v) => v !== opt.value)
                    : [...multiSelected, opt.value];
                  setMultiSelected(updated);
                  onAnswer(updated);
                }}
                className={`w-full min-h-[52px] text-right px-3 py-3 rounded-xl border transition-all whitespace-normal break-words ${isSelected
                  ? "border-brand-blue bg-brand-blue/10 text-brand-blue font-medium"
                  : "border-glass text-secondary hover:border-brand-blue/50"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? "border-brand-blue bg-brand-blue" : "border-glass"
                      }`}
                  >
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-xs"
                      >
                        ✓
                      </motion.span>
                    )}
                  </span>
                  {opt.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Slider */}
      {question.questionType === "slider" && (
        <div className="space-y-4">
          <div className="text-center text-sm text-secondary">
            {typeof sliderValue === "number" ? sliderValue : ""}
          </div>
          <input
            type="range"
            min={question.sliderMin || 1}
            max={question.sliderMax || 5}
            value={sliderValue}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSliderValue(v);
              onAnswer(v);
            }}
            className="w-full accent-brand-blue"
          />
          {question.sliderLabels && (
            <div className="flex justify-between text-xs text-muted">
              {(() => {
                const labels = question.sliderLabels || [];
                const numericLabelValues = labels.map((l) => Number(String(l).trim()));
                const isNumericLabels = numericLabelValues.every((n) => Number.isFinite(n));

                let activeIndex = -1;
                if (isNumericLabels) {
                  let best = { idx: 0, dist: Number.POSITIVE_INFINITY };
                  for (let i = 0; i < numericLabelValues.length; i++) {
                    const dist = Math.abs(numericLabelValues[i] - sliderValue);
                    if (dist < best.dist) best = { idx: i, dist };
                  }
                  activeIndex = best.idx;
                }

                return labels.map((label, i) => {
                  const isActive = isNumericLabels
                    ? i === activeIndex
                    : i + (question.sliderMin || 1) === sliderValue;
                  return (
                    <span
                      key={i}
                      className={`transition-colors ${isActive ? "text-brand-blue font-bold text-sm" : ""}`}
                    >
                      {label}
                    </span>
                  );
                });
              })()}
            </div>
          )}
        </div>
      )}

      {/* Number */}
      {question.questionType === "number" && (
        <div className="space-y-2">
          <input
            type="text"
            value={numberValue}
            onChange={(e) => {
              const raw = e.target.value;
              const cleaned = raw.replace(/[^0-9]/g, "");
              setNumberValue(cleaned);
              const n = Number(cleaned);
              if (Number.isFinite(n) && cleaned.length > 0) {
                onAnswer(n);
              }
            }}
            inputMode="numeric"
            placeholder="לדוגמה: 250"
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-brand-blue transition-colors"
          />
          <p className="text-xs text-muted text-center">מספר משוער זה מספיק</p>
        </div>
      )}

      {/* Text */}
      {question.questionType === "text" && (
        <div>
          <textarea
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              onAnswer(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmitText();
              }
            }}
            placeholder="...ספרו לנו"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-brand-blue transition-colors resize-none"
          />
        </div>
      )}
    </div>
  );
}

function DemographicsSummary({ value }: { value?: string | string[] | number }) {
  if (typeof value !== "string" || !value.trim()) {
    return <div className="text-xs text-muted text-center">ממוצע גילאים: —</div>;
  }
  try {
    const parsed = JSON.parse(value) as { totalGuests?: number; avgAge?: number; groups?: { count: number }[] };
    const avg = typeof parsed.avgAge === "number" && Number.isFinite(parsed.avgAge) ? parsed.avgAge : null;
    const total = typeof parsed.totalGuests === "number" && Number.isFinite(parsed.totalGuests) ? parsed.totalGuests : null;
    const sum = Array.isArray(parsed.groups)
      ? parsed.groups.reduce((acc, g) => acc + (Number(g.count) || 0), 0)
      : 0;

    return (
      <div className="text-xs text-muted text-center">
        <div>
          ממוצע גילאים: <span className="text-brand-blue font-bold">{avg ?? "—"}</span>
        </div>
        <div className="mt-1">
          סה״כ שסימנת: <span className="text-secondary font-medium">{sum}</span>
          {total ? <span> מתוך {total}</span> : null}
        </div>
      </div>
    );
  } catch {
    return <div className="text-xs text-muted text-center">ממוצע גילאים: —</div>;
  }
}
