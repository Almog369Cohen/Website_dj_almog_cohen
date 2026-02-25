"use client";

import { useState, useCallback, useMemo } from "react";
import { useAdminStore } from "@/stores/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Eye,
  EyeOff,
  GripVertical,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Copy,
} from "lucide-react";
import type { Question, QuestionOption, QuestionType, EventType } from "@/lib/types";
import { useDBMutations } from "@/hooks/useDBMutations";

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "single_select", label: "בחירה יחידה" },
  { value: "multi_select", label: "בחירה מרובה" },
  { value: "slider", label: "סליידר" },
  { value: "number", label: "מספר" },
  { value: "demographics", label: "פירוט קהל (גילאים)" },
  { value: "text", label: "טקסט חופשי" },
];

export function QuestionManager() {
  const questions = useAdminStore((s) => s.questions);
  const eventTypes = useAdminStore((s) => s.eventTypes);
  const updateEventType = useAdminStore((s) => s.updateEventType);
  const { dbAddQuestion: addQuestion, dbUpdateQuestion: updateQuestion, dbDeleteQuestion: deleteQuestion } = useDBMutations();

  const [filterType, setFilterType] = useState<string>("wedding");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const filtered = questions
    .filter((q) => {
      const types = Array.isArray(q.eventTypes) && q.eventTypes.length ? q.eventTypes : [q.eventType];
      return types.includes(filterType as EventType);
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-blue" />
          ניהול שאלות ({filtered.length})
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-sm flex items-center gap-1.5 py-2 px-4"
        >
          <Plus className="w-4 h-4" />
          הוסף שאלה
        </button>
      </div>

      {/* Event Types Settings */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold">סוגי אירועים</h3>
          <p className="text-xs text-muted">אפשר לשנות שמות ולהסתיר סוגים</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {eventTypes.map((t) => (
            <div key={t.id} className="flex items-center gap-2 p-2 rounded-xl border border-glass">
              <button
                type="button"
                onClick={() => updateEventType(t.id, { enabled: !t.enabled })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${t.enabled
                  ? "border-brand-green/30 text-brand-green hover:bg-brand-green/10"
                  : "border-glass text-muted hover:text-foreground"}`}
                title={t.enabled ? "מוצג" : "מוסתר"}
              >
                {t.enabled ? "מוצג" : "מוסתר"}
              </button>
              <input
                value={t.label}
                onChange={(e) => updateEventType(t.id, { label: e.target.value })}
                className="flex-1 bg-transparent border border-glass rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-blue"
                placeholder={t.id}
              />
              <code className="text-[10px] text-muted" dir="ltr">
                {t.id}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Event Type Filter */}
      <div className="flex gap-1">
        {eventTypes.filter((t) => t.enabled).map((et) => (
          <button
            key={et.id}
            onClick={() => setFilterType(et.id)}
            className={`chip text-xs ${filterType === et.id ? "active" : ""}`}
          >
            {et.label}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-2">
        {filtered.map((q, i) => (
          <motion.div
            key={q.id}
            layout
            className="glass-card p-4 flex items-start gap-3"
          >
            <div className="text-muted cursor-grab mt-1">
              <GripVertical className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-brand-blue font-bold">
                  {i + 1}.
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${q.isActive
                    ? "bg-brand-green/10 text-brand-green"
                    : "bg-accent-danger/10 text-accent-danger"
                    }`}
                >
                  {q.isActive ? "פעיל" : "מוסתר"}
                </span>
                <span className="text-xs text-muted px-2 py-0.5 rounded-full border border-glass">
                  {questionTypes.find((t) => t.value === q.questionType)?.label}
                </span>
              </div>
              <p className="font-medium text-sm">{q.questionHe}</p>
              {q.options && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {q.options.map((opt) => (
                    <span key={opt.value} className="text-xs text-muted">
                      {opt.label}
                    </span>
                  ))}
                </div>
              )}
              {q.sliderLabels && (
                <div className="flex gap-2 mt-1.5 text-xs text-muted">
                  {q.sliderLabels.map((l, i) => (
                    <span key={i}>{l}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => updateQuestion(q.id, { isActive: !q.isActive })}
                className="p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
                aria-label={q.isActive ? "הסתר" : "הצג"}
              >
                {q.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setEditingQuestion(q)}
                className="p-1.5 rounded-lg text-muted hover:text-brand-blue transition-colors"
                aria-label="ערוך"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm("למחוק את השאלה?")) deleteQuestion(q.id);
                }}
                className="p-1.5 rounded-lg text-muted hover:text-accent-danger transition-colors"
                aria-label="מחק"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card p-8 text-center text-muted text-sm">
            אין שאלות לסוג אירוע זה
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingQuestion) && (
          <QuestionModal
            question={editingQuestion}
            defaultEventType={filterType as EventType}
            onSave={(data) => {
              if (editingQuestion) {
                updateQuestion(editingQuestion.id, data);
              } else {
                addQuestion(data as Omit<Question, "id" | "sortOrder">);
              }
              setShowAddModal(false);
              setEditingQuestion(null);
            }}
            onClose={() => {
              setShowAddModal(false);
              setEditingQuestion(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function QuestionModal({
  question,
  defaultEventType,
  onSave,
  onClose,
}: {
  question: Question | null;
  defaultEventType: EventType;
  onSave: (data: Partial<Question>) => void;
  onClose: () => void;
}) {
  const eventTypesConfig = useAdminStore((s) => s.eventTypes);
  const enabledEventTypes = useMemo(
    () => eventTypesConfig.filter((t) => t.enabled),
    [eventTypesConfig]
  );

  const [questionHe, setQuestionHe] = useState(question?.questionHe || "");
  const [questionType, setQuestionType] = useState<QuestionType>(
    question?.questionType || "single_select"
  );
  const initialTypes = (() => {
    const t = Array.isArray(question?.eventTypes) && question?.eventTypes.length
      ? question.eventTypes
      : [question?.eventType || defaultEventType];
    // Ensure at least one and keep only enabled/known types
    const known = new Set(enabledEventTypes.map((e) => e.id));
    const cleaned = t.filter((x) => known.has(x));
    return cleaned.length ? cleaned : [defaultEventType];
  })();

  const [eventTypes, setEventTypes] = useState<EventType[]>(initialTypes);
  const [options, setOptions] = useState<QuestionOption[]>(
    question?.options?.length
      ? question.options.map((o) => ({ ...o }))
      : [{ label: "", value: "" }]
  );
  const [sliderMin, setSliderMin] = useState(question?.sliderMin || 1);
  const [sliderMax, setSliderMax] = useState(question?.sliderMax || 5);
  const [sliderLabels, setSliderLabels] = useState(
    question?.sliderLabels?.join(", ") || ""
  );

  const hasOptions = questionType === "single_select" || questionType === "multi_select";

  /* ── Option helpers ── */
  const updateOption = useCallback((index: number, field: "label" | "value", val: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      // Auto-generate value from label if value is empty or was auto-generated
      if (field === "label") {
        const autoVal = val
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\u0590-\u05ff ]/g, "")
          .replace(/\s+/g, "_")
          .slice(0, 30);
        // Only auto-fill if value was empty or looks auto-generated
        const curVal = next[index].value;
        if (!curVal || curVal === prev[index].value) {
          next[index].value = autoVal || `opt_${index + 1}`;
        }
      }
      return next;
    });
  }, []);

  const addOption = useCallback(() => {
    setOptions((prev) => [...prev, { label: "", value: "" }]);
  }, []);

  const removeOption = useCallback((index: number) => {
    setOptions((prev) => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  }, []);

  const moveOption = useCallback((index: number, dir: -1 | 1) => {
    setOptions((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const duplicateOption = useCallback((index: number) => {
    setOptions((prev) => {
      const next = [...prev];
      const orig = prev[index];
      next.splice(index + 1, 0, {
        label: orig.label,
        value: `${orig.value}_copy`,
      });
      return next;
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanOptions = hasOptions
      ? options
        .filter((o) => o.label.trim())
        .map((o) => ({
          label: o.label.trim(),
          value: o.value.trim() || o.label.trim().toLowerCase().replace(/\s+/g, "_"),
        }))
      : undefined;

    onSave({
      questionHe,
      questionType,
      // Back-compat: keep eventType as primary (first selected)
      eventType: (eventTypes[0] ?? defaultEventType),
      eventTypes,
      options: cleanOptions,
      sliderMin: questionType === "slider" ? sliderMin : undefined,
      sliderMax: questionType === "slider" ? sliderMax : undefined,
      sliderLabels:
        questionType === "slider" && sliderLabels
          ? sliderLabels.split(",").map((l) => l.trim())
          : undefined,
      isActive: question?.isActive ?? true,
    });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-transparent border border-glass text-sm focus:outline-none focus:border-brand-blue transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">
            {question ? "עריכת שאלה" : "הוספת שאלה"}
          </h3>
          <button type="button" onClick={onClose} className="p-1 text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question text */}
        <div>
          <label className="block text-xs text-muted mb-1.5 font-medium">טקסט השאלה *</label>
          <input
            type="text"
            value={questionHe}
            onChange={(e) => setQuestionHe(e.target.value)}
            required
            placeholder="מה האווירה שאתם חולמים עליה?"
            className={inputClass}
            autoFocus
          />
        </div>

        {/* Type + Event selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">סוג שאלה</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
              className={inputClass}
            >
              {questionTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium">סוגי אירועים (אפשר לבחור כמה)</label>
            <div className="flex flex-wrap gap-2">
              {enabledEventTypes.map((et) => {
                const selected = eventTypes.includes(et.id);
                return (
                  <button
                    key={et.id}
                    type="button"
                    onClick={() => {
                      setEventTypes((prev) => {
                        const next = selected ? prev.filter((x) => x !== et.id) : [...prev, et.id];
                        return next.length ? next : prev; // never allow empty
                      });
                    }}
                    className={`chip text-xs ${selected ? "active" : ""}`}
                    title={et.id}
                  >
                    {et.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Options Editor (for select types) ── */}
        {hasOptions && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted font-medium">
                תשובות ({options.filter((o) => o.label.trim()).length})
              </label>
              <button
                type="button"
                onClick={addOption}
                className="text-xs text-brand-blue hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף תשובה
              </button>
            </div>

            <div className="space-y-2">
              {options.map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 group"
                >
                  {/* Order number */}
                  <span className="text-xs text-muted w-5 text-center flex-shrink-0 font-bold">
                    {i + 1}
                  </span>

                  {/* Label input */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => updateOption(i, "label", e.target.value)}
                      placeholder={`תשובה ${i + 1}`}
                      className="w-full px-3 py-2 rounded-lg bg-transparent border border-glass text-sm focus:outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-0.5 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveOption(i, -1)}
                      disabled={i === 0}
                      className="p-1 rounded text-muted hover:text-foreground disabled:opacity-20 transition-colors"
                      title="הזז למעלה"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveOption(i, 1)}
                      disabled={i === options.length - 1}
                      className="p-1 rounded text-muted hover:text-foreground disabled:opacity-20 transition-colors"
                      title="הזז למטה"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateOption(i)}
                      className="p-1 rounded text-muted hover:text-brand-blue transition-colors"
                      title="שכפל"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      disabled={options.length <= 1}
                      className="p-1 rounded text-muted hover:text-accent-danger disabled:opacity-20 transition-colors"
                      title="מחק"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add on Enter */}
            <p className="text-[11px] text-muted">
              הזינו טקסט התשובה. הערך הטכני נוצר אוטומטית.
            </p>
          </div>
        )}

        {/* ── Slider settings ── */}
        {questionType === "slider" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1.5 font-medium">מינימום</label>
                <input
                  type="number"
                  value={sliderMin}
                  onChange={(e) => setSliderMin(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-medium">מקסימום</label>
                <input
                  type="number"
                  value={sliderMax}
                  onChange={(e) => setSliderMax(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-medium">
                תוויות (מופרדות בפסיק, לפי סדר)
              </label>
              <input
                type="text"
                value={sliderLabels}
                onChange={(e) => setSliderLabels(e.target.value)}
                placeholder="רגוע, קליל, אנרגטי, פרוע, מטורף"
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1 py-2.5">
            {question ? "שמור שינויים" : "הוסף שאלה"}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">
            ביטול
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
