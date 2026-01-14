"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/utils/analytics";

type FormState = {
  coupleNames: string;
  weddingDate: string;
  weddingLocation: string;
  guestCount: string;
  groomPhone: string;
  bridePhone: string;
  eventSize: "intimate" | "medium" | "large" | "unknown";
  mostImportant: string;
  biggestFear: string;
  decisionStyle: "connection" | "experience" | "price" | "mix";
  budgetComfort: "basic" | "mid" | "premium" | "unknown";
  commitment: boolean;
};

type StepId = 1 | 2;

export default function WeddingFitCheckPage() {
  const [step, setStep] = useState<StepId>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("fitcheck_open", { source: "weddings_fit_check" });
  }, []);

  const [form, setForm] = useState<FormState>({
    coupleNames: "",
    weddingDate: "",
    weddingLocation: "",
    guestCount: "",
    groomPhone: "",
    bridePhone: "",
    eventSize: "unknown",
    mostImportant: "",
    biggestFear: "",
    decisionStyle: "mix",
    budgetComfort: "unknown",
    commitment: false,
  });

  const progress = useMemo(() => {
    return {
      current: step,
      total: 2,
      pct: (step / 2) * 100,
    };
  }, [step]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (!form.coupleNames.trim()) e.coupleNames = "זה שדה חובה.";

    if (!form.weddingDate) e.weddingDate = "זה שדה חובה.";
    if (!form.weddingLocation.trim()) e.weddingLocation = "זה שדה חובה.";

    if (!form.guestCount.trim()) e.guestCount = "זה שדה חובה.";
    if (!form.groomPhone.trim()) e.groomPhone = "זה שדה חובה.";
    if (!form.bridePhone.trim()) e.bridePhone = "זה שדה חובה.";

    if (!form.mostImportant.trim()) e.mostImportant = "זה שדה חובה.";
    if (!form.biggestFear.trim()) e.biggestFear = "זה שדה חובה.";

    if (!form.commitment) e.commitment = "חובה לאשר כדי לשלוח.";

    return e;
  }, [form]);

  const canContinue = useMemo(() => {
    if (step === 1) return !errors.coupleNames;
    if (step === 2) {
      return (
        !errors.weddingDate &&
        !errors.weddingLocation &&
        !errors.guestCount &&
        !errors.groomPhone &&
        !errors.bridePhone &&
        !errors.mostImportant &&
        !errors.biggestFear &&
        !errors.commitment
      );
    }
    return false;
  }, [errors, step]);

  const nextStep = () => {
    if (!canContinue) return;
    setStep((s) => (s < 2 ? ((s + 1) as StepId) : s));
  };

  const prevStep = () => {
    setStep((s) => (s > 1 ? ((s - 1) as StepId) : s));
  };

  const onSubmit = async () => {
    if (!canContinue) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      fd.set("coupleNames", form.coupleNames);
      fd.set("weddingDate", form.weddingDate);
      fd.set("weddingLocation", form.weddingLocation);
      fd.set("guestCount", form.guestCount);
      fd.set("groomPhone", form.groomPhone);
      fd.set("bridePhone", form.bridePhone);
      fd.set("eventSize", form.eventSize);
      fd.set("mostImportant", form.mostImportant);
      fd.set("biggestFear", form.biggestFear);
      fd.set("decisionStyle", form.decisionStyle);
      fd.set("budgetComfort", form.budgetComfort);
      fd.set("commitment", String(form.commitment));

      const res = await fetch("/api/wedding-fit-check", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error("submit_failed");
      }

      setSubmitted(true);
      trackEvent("fitcheck_submit", { source: "weddings_fit_check" });
    } catch {
      setSubmitError("לא הצלחתי לשלוח כרגע. נסו שוב בעוד רגע.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="mx-auto w-full max-w-[680px] px-6 py-10">
        {!submitted ? (
          <>
            <section className="mb-10">
              <h1 className="text-3xl font-black leading-tight">לפני שקובעים שיחה – בודקים התאמה.</h1>
              <p className="mt-4 text-base leading-relaxed text-white/85">
                לא כל זוג מתאים לעבוד איתי, ולא כל ערב נכון לי להחזיק.
                <br />
                העמוד הזה נועד לבדוק אם יש התאמה אמיתית – לשני הצדדים.
              </p>
              <p className="mt-4 text-sm font-medium text-white/70">זה חוסך זמן. מייצר בהירות. ושומר על היום שלכם נקי מרעש.</p>
            </section>

            <section className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold">מה התהליך הזה כן / לא</h2>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <div className="text-sm font-bold text-white">התהליך הזה כן:</div>
                  <ul className="mt-3 space-y-2 text-white/85">
                    <li className="flex gap-3"><span className="text-[#03b28c]">✓</span><span>בדיקה של כיוון, לא סגירת עסקה</span></li>
                    <li className="flex gap-3"><span className="text-[#03b28c]">✓</span><span>שיחה על ערב, לא על רשימות</span></li>
                    <li className="flex gap-3"><span className="text-[#03b28c]">✓</span><span>מקום להגיד גם “לא”</span></li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-bold text-white">התהליך הזה לא:</div>
                  <ul className="mt-3 space-y-2 text-white/85">
                    <li className="flex gap-3"><span className="text-red-400">✕</span><span>בקשת מחיר</span></li>
                    <li className="flex gap-3"><span className="text-red-400">✕</span><span>השוואה בין ספקים</span></li>
                    <li className="flex gap-3"><span className="text-red-400">✕</span><span>התחייבות מכל סוג</span></li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold">תיאום ציפיות</h2>
              <p className="mt-4 text-base leading-relaxed text-white/85">
                מילוי הטופס לוקח דקה.
                <br />
                לא כל פנייה מתקבלת.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                אם יש התאמה — תקבלו תגובה אישית ומדויקת.
                <br />
                אם אין — זה עדיין סיום מכבד: בלי משיכה של זמן ובלי חוסר בהירות.
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-bold text-white">שלב {progress.current} מתוך {progress.total}</div>
                <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <div className="h-full bg-gradient-to-r from-[#059cc0] to-[#03b28c]" style={{ width: `${progress.pct}%` }} />
                </div>
              </div>

              <div className="mt-6">
                {step === 1 && (
                  <div>
                    <label className="block text-sm font-bold text-white">שם מלא של שני בני הזוג</label>
                    <p className="mt-2 text-sm text-white/70">כדי שנדע עם מי אנחנו מדברים, לא רק על איזה אירוע.</p>
                    <input
                      value={form.coupleNames}
                      onChange={(e) => update("coupleNames", e.target.value)}
                      placeholder="לדוגמה: נועה ואלון"
                      className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                    />
                    {errors.coupleNames && <p className="mt-2 text-sm text-red-300">{errors.coupleNames}</p>}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <label className="block text-sm font-bold text-white">פרטי האירוע</label>
                    <p className="mt-2 text-sm text-white/70">תאריך, אולם וכמות אורחים — ואז כמה שאלות קצרות.</p>
                    <div className="mt-3 grid gap-3">
                      <input
                        type="date"
                        value={form.weddingDate}
                        onChange={(e) => update("weddingDate", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                      />
                      {errors.weddingDate && <p className="text-sm text-red-300">{errors.weddingDate}</p>}
                      <input
                        value={form.weddingLocation}
                        onChange={(e) => update("weddingLocation", e.target.value)}
                        placeholder="אולם / גן / עיר"
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                      />
                      {errors.weddingLocation && <p className="text-sm text-red-300">{errors.weddingLocation}</p>}
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-bold text-white">כמות אורחים</label>
                      <p className="mt-2 text-sm text-white/70">מספר משוער מספיק.</p>
                      <input
                        inputMode="numeric"
                        value={form.guestCount}
                        onChange={(e) => update("guestCount", e.target.value)}
                        placeholder="לדוגמה: 350"
                        className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                      />
                      {errors.guestCount && <p className="mt-2 text-sm text-red-300">{errors.guestCount}</p>}
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-white">נייד חתן</label>
                        <input
                          inputMode="tel"
                          value={form.groomPhone}
                          onChange={(e) => update("groomPhone", e.target.value)}
                          placeholder="05X-XXXXXXX"
                          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                        />
                        {errors.groomPhone && <p className="mt-2 text-sm text-red-300">{errors.groomPhone}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white">נייד כלה</label>
                        <input
                          inputMode="tel"
                          value={form.bridePhone}
                          onChange={(e) => update("bridePhone", e.target.value)}
                          placeholder="05X-XXXXXXX"
                          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                        />
                        {errors.bridePhone && <p className="mt-2 text-sm text-red-300">{errors.bridePhone}</p>}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-bold text-white">סוג האירוע</label>
                      <p className="mt-2 text-sm text-white/70">כדי להבין את גודל החדר, לא כדי להכניס אתכם לתבנית.</p>
                      <select
                        value={form.eventSize}
                        onChange={(e) => update("eventSize", e.target.value as FormState["eventSize"])}
                        className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                      >
                        <option value="intimate">חתונה קטנה ואינטימית</option>
                        <option value="medium">חתונה בינונית</option>
                        <option value="large">חתונה גדולה</option>
                        <option value="unknown">אחר / לא בטוחים</option>
                      </select>
                    </div>

                    <div className="mt-8">
                      <label className="block text-sm font-bold text-white">מה הכי חשוב לכם במוזיקה של הערב?</label>
                      <p className="mt-2 text-sm text-white/70">לא תשובה נכונה – רק כנה.</p>
                      <textarea
                        value={form.mostImportant}
                        onChange={(e) => update("mostImportant", e.target.value)}
                        rows={4}
                        placeholder="מינימום שתי שורות מומלץ"
                        className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                      />
                      {errors.mostImportant && <p className="mt-2 text-sm text-red-300">{errors.mostImportant}</p>}

                      <div className="mt-6">
                        <label className="block text-sm font-bold text-white">מה אתם הכי לא רוצים שיקרה בערב?</label>
                        <p className="mt-2 text-sm text-white/70">לפעמים הגבולות חשובים יותר מהחזון.</p>
                        <textarea
                          value={form.biggestFear}
                          onChange={(e) => update("biggestFear", e.target.value)}
                          rows={4}
                          placeholder="מה אתם רוצים למנוע?"
                          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                        />
                        {errors.biggestFear && <p className="mt-2 text-sm text-red-300">{errors.biggestFear}</p>}
                      </div>
                    </div>

                    <div className="mt-8">
                      <label className="block text-sm font-bold text-white">איך אתם בדרך כלל מקבלים החלטות כספקים?</label>
                      <p className="mt-2 text-sm text-white/70">כדי להבין מה מניע אתכם, לא כדי לשפוט.</p>
                      <select
                        value={form.decisionStyle}
                        onChange={(e) => update("decisionStyle", e.target.value as FormState["decisionStyle"])}
                        className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                      >
                        <option value="connection">לפי חיבור ותחושה</option>
                        <option value="experience">לפי ניסיון ומקצועיות</option>
                        <option value="price">לפי מחיר</option>
                        <option value="mix">שילוב</option>
                      </select>

                      <div className="mt-6">
                        <label className="block text-sm font-bold text-white">טווח השקעה שאתם מרגישים איתו בנוח</label>
                        <p className="mt-2 text-sm text-white/70">לא התחייבות – רק בדיקת התאמה בסיסית.</p>
                        <select
                          value={form.budgetComfort}
                          onChange={(e) => update("budgetComfort", e.target.value as FormState["budgetComfort"])}
                          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                        >
                          <option value="basic">בסיסי</option>
                          <option value="mid">ביניים</option>
                          <option value="premium">פרימיום</option>
                          <option value="unknown">לא בטוחים עדיין</option>
                        </select>
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <label className="flex items-start gap-3 text-white/90">
                          <input
                            type="checkbox"
                            checked={form.commitment}
                            onChange={(e) => update("commitment", e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black"
                          />
                          <span>
                            אני מבין/ה שלא כל פנייה מתקבלת,
                            ושזו בדיקת התאמה – לא סגירת מחיר.
                          </span>
                        </label>
                        {errors.commitment && <p className="mt-3 text-sm text-red-300">{errors.commitment}</p>}
                      </div>

                      <div className="mt-6">
                        <p className="text-sm text-white/85">
                          אם זה מרגיש מדויק — שלחו.
                          <br />
                          אם משהו מרגיש לכם לא נכון — עצרו.
                          <br />
                          החלטות טובות מתחילות בכנות.
                        </p>

                        {submitError && <p className="mt-4 text-sm text-red-300">{submitError}</p>}

                        <button
                          type="button"
                          onClick={onSubmit}
                          disabled={!canContinue || submitting}
                          className="mt-5 w-full rounded-full bg-white px-6 py-4 text-base font-bold text-black transition disabled:opacity-60"
                        >
                          {submitting ? "שולח…" : "שליחת בדיקת התאמה"}
                        </button>
                        <p className="mt-3 text-center text-xs text-white/60">תגובה אישית תישלח רק אם יש התאמה.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1 || submitting}
                  className="rounded-full border border-white/15 bg-white/0 px-5 py-3 text-sm font-bold text-white/85 transition hover:bg-white/5 disabled:opacity-40"
                >
                  חזרה
                </button>

                {step < 2 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canContinue}
                    className="rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-6 py-3 text-sm font-bold text-white transition disabled:opacity-60"
                  >
                    המשך
                  </button>
                )}
              </div>

              {step < 2 && <p className="mt-4 text-center text-xs text-white/60">לא מתאים לכל זוג – וזה בסדר.</p>}
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h1 className="text-3xl font-black">קיבלתי. עכשיו בודקים.</h1>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              בדיקת התאמה לוקחת זמן — בכוונה.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              אם יש התאמה, אחזור אליכם אישית עם השלב הבא.
              <br />
              אין כאן קביעת שיחה אוטומטית, ואין מערכת שמחזירה תשובה.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/85">תודה שבאתם בגישה רצינית. זה בדיוק סוג ההתחלה שמייצר ערב נכון.</p>
          </section>
        )}
      </div>
    </div>
  );
}
