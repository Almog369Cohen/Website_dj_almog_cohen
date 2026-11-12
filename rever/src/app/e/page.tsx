"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ClientView } from "@/lib/portal";
import { cleanPhone } from "@/lib/format";
import * as api from "@/lib/portalClient";
import { clientSession, PortalError } from "@/lib/portalClient";
import { TaskList, type SaveState } from "@/components/TaskList";
import type { ClientTask } from "@/lib/tasks";

/** דף הלקוח: "האירוע שלכם". כניסה עם טלפון + קוד מרבר. הזוג עורך רק את המשימות שלו. */
export default function PortalPage() {
  return (
    <Suspense>
      <Portal />
    </Suspense>
  );
}

const KICKER: Record<string, string> = { חתונה: "החתונה של", "בר מצווה": "בר המצווה של", "בת מצווה": "בת המצווה של", חינה: "החינה של" };
const nis = (n: number) => "₪" + Math.round(n).toLocaleString("he-IL");
const dm = (d?: string) => (d ? `${Number(d.slice(8, 10))}.${Number(d.slice(5, 7))}` : "");
const KEY = /חופה|כניסה|טקס|הדלקת|ריקוד ראשון/;

function Portal() {
  const sp = useSearchParams();
  const token = sp.get("t") ?? ""; // תצוגה מקדימה לצוות (קריאה בלבד)
  const preview = !!token;
  const [view, setView] = useState<ClientView | null | undefined>(undefined);
  const [needLogin, setNeedLogin] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    if (preview) return setView(await api.preview(token));
    const s = clientSession.get();
    if (!s) return setNeedLogin(true);
    try {
      setView(await api.view(s));
      setNeedLogin(false);
    } catch (e) {
      if (e instanceof PortalError && e.code === "auth") {
        clientSession.set(null);
        return setNeedLogin(true);
      }
      setView(null); // תקלה זמנית: לא מנתקים את הזוג, מציעים לנסות שוב
    }
  }, [preview, token]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (needLogin) return <Login onDone={(s) => (clientSession.set(s), setView(undefined), load())} />;
  if (view === undefined)
    return (
      <div className="p-state">
        <div className="box">
          <span className="mono" style={{ margin: "0 auto" }}>ר</span>
          <p style={{ marginTop: 14 }}>טוען את האירוע שלכם…</p>
        </div>
      </div>
    );
  if (!view)
    return (
      <div className="p-state">
        <div className="box">
          <span className="mono" style={{ margin: "0 auto" }}>ר</span>
          <h1 className="serif">{preview ? "הקישור לא פעיל" : "משהו השתבש"}</h1>
          <p>{preview ? "ייתכן שהקישור שונה, או שצריך להיכנס למערכת." : "לא הצלחנו לטעון את הדף. בדקו את החיבור לאינטרנט ונסו שוב."}</p>
          {!preview && (
            <button className="p-btn" onClick={() => (setView(undefined), load())}>
              לנסות שוב
            </button>
          )}
        </div>
      </div>
    );

  const v = view;
  const start = v.event.date ? new Date(`${v.event.date}T${v.details?.arrival || v.timeline?.find((t) => t.time >= "17:00")?.time || "19:00"}:00`).getTime() : 0;
  const left = Math.max(0, start - now);
  const cd = { d: Math.floor(left / 864e5), h: Math.floor((left % 864e5) / 36e5), m: Math.floor((left % 36e5) / 6e4) };
  const longDate = v.event.date ? new Date(v.event.date + "T12:00:00").toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";
  const phone = v.contact.phone ? cleanPhone(v.contact.phone) : "";
  const p = v.payments;

  return (
    <>
      {preview && <div className="p-preview">תצוגה מקדימה · כך הלקוח רואה את הדף</div>}
      <div className="wrap">
        <header className="hero">
          <div>
            <div className="brandline">
              <span className="mono">{(v.business || "ר").trim()[0]}</span>
              {v.business} · הדף של האירוע שלכם
            </div>
            <div className="kicker">{KICKER[v.event.type] ?? "האירוע של"}</div>
            <h1 className="title serif">{v.event.name}</h1>
            <div className="meta">
              {longDate && <span>📅 {longDate}</span>}
              {v.event.venue && <span>📍 {v.event.venue}</span>}
              {v.event.guests ? <span>👥 {v.event.guests} אורחים</span> : null}
            </div>
          </div>
          {start > 0 && left > 0 && (
            <div className="count" aria-label="ספירה לאחור">
              <div><b>{cd.d}</b><small>ימים</small></div>
              <div><b>{cd.h}</b><small>שעות</small></div>
              <div><b>{cd.m}</b><small>דקות</small></div>
            </div>
          )}
          {start > 0 && left === 0 && <div className="kicker">מזל טוב! 🥂</div>}
        </header>

        <div className="colA">
          {v.steps && (
            <section className="sec">
              <h2 className="serif"><span className="ic">✨</span>איפה אנחנו עומדים</h2>
              <div className="ready">
                <div className="ring" style={{ ["--p" as string]: `${v.readiness ?? 0}%` }}><span>{v.readiness ?? 0}%</span></div>
                <p>
                  <b>{(v.readiness ?? 0) >= 100 ? "הכל מוכן לאירוע ✓" : "הכל מתקדם לפי התוכנית"}</b>
                  אנחנו מטפלים בכל הפרטים. כאן תמיד תראו את המצב העדכני.
                </p>
              </div>
              <ul className="steps">
                {v.steps.map((s) => (
                  <li key={s.label} className={s.done ? "done" : "wait"}>
                    <span className="st">{s.done ? "✓" : "⏳"}</span>
                    {s.label}
                    {!s.done && <small>בתהליך</small>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {v.tasks && <TasksSection key={v.tasks.rev} view={v} readOnly={preview} onReload={load} />}

          {v.timeline && v.timeline.length > 0 && (
            <section className="sec">
              <h2 className="serif"><span className="ic">🕒</span>הלו״ז של הערב<span className="r">ייתכנו שינויים קלים</span></h2>
              <div className="tl">
                {v.timeline.map((t, i) => (
                  <div key={i} className={"tli" + (KEY.test(t.title) ? " key" : "")}>
                    <time>{t.time}</time>
                    <div><b>{t.title}</b></div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="colB">
          {p && (p.total > 0 || p.plan.length > 0) && (
            <section className="sec">
              <h2 className="serif"><span className="ic">💳</span>התשלומים שלכם</h2>
              <div className="pay3">
                <div><small>סה״כ</small><b>{nis(p.total)}</b></div>
                <div><small>שולם</small><b style={{ color: "var(--green)" }}>{nis(p.paid)}</b></div>
                <div><small>נותר</small><b>{nis(p.balance)}</b></div>
              </div>
              <div className="bar"><span style={{ ["--w" as string]: `${p.total ? Math.min(100, (p.paid / p.total) * 100) : 0}%` }} /></div>
              {p.plan.length > 0 && (
                <ul className="plan">
                  {p.plan.map((x, i) => {
                    const next = !x.paid && p.plan.slice(0, i).every((y) => y.paid);
                    return (
                      <li key={i} className={x.paid ? "paid" : next ? "next" : "later"}>
                        <span className="pi">{x.paid ? "✓" : next ? "⏳" : "•"}</span>
                        <div><b>{x.name}</b><span>{x.paid ? "שולם" : x.due ? `עד ${dm(x.due)}` : ""}</span></div>
                        <div className="amt">{nis(x.amount)}<small>{x.paid ? "שולם" : next ? "הבא בתור" : ""}</small></div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {p.docs.length > 0 && (
                <div className="docs">
                  {p.docs.map((d) => (
                    <span key={d.number} className="doc">{d.label === "הצעת מחיר" ? "📄" : "🧾"} {d.label} · {dm(d.date)}</span>
                  ))}
                </div>
              )}
            </section>
          )}

          {v.suppliers && v.suppliers.length > 0 && (
            <section className="sec">
              <h2 className="serif"><span className="ic">🤝</span>הצוות של הערב שלכם</h2>
              {v.suppliers.map((s, i) => (
                <div key={i} className="sup">
                  <span className="si">{s.icon}</span>
                  <div><b>{s.name}</b><span>{s.category}</span></div>
                  {s.phone && (
                    <div className="acts">
                      <a className="cb" href={`tel:${s.phone}`} aria-label="שיחה">📞</a>
                      <a className="cb wa" href={`https://wa.me/${cleanPhone(s.phone)}`} target="_blank" rel="noreferrer" aria-label="וואטסאפ">💬</a>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {v.details && (
            <section className="sec">
              <h2 className="serif"><span className="ic">📍</span>פרטי האירוע</h2>
              <div className="det">
                {v.details.venue && <div><small>מקום</small><b>{v.details.venue}</b></div>}
                {v.details.arrival && <div><small>הגעת אורחים</small><b>{v.details.arrival}</b></div>}
                {v.details.guests ? <div><small>אורחים</small><b>{v.details.guests}</b></div> : null}
                {v.details.day_contact && <div><small>איש קשר ביום</small><b>{v.details.day_contact}</b></div>}
              </div>
              {v.details.venue && (
                <div className="navbtns">
                  <a href={`https://waze.com/ul?q=${encodeURIComponent(v.details.venue)}&navigate=yes`} target="_blank" rel="noreferrer">🧭 Waze</a>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.details.venue)}`} target="_blank" rel="noreferrer">🗺️ Google Maps</a>
                </div>
              )}
              {v.details.requests && <div className="req"><b>מה שסיכמנו:</b> {v.details.requests}</div>}
            </section>
          )}

          <section className="sec contact">
            <h2 className="serif"><span className="ic">💬</span>מי מלווה אתכם</h2>
            <div className="person">
              <div className="av">{(v.contact.name || "ר").trim()[0]}</div>
              <div><b>{v.contact.name}</b><span>מפיק האירוע שלכם ב{v.business}</span></div>
            </div>
            {phone && (
              <div className="cbtns">
                <a className="w" href={`https://wa.me/${phone}?text=${encodeURIComponent(`היי ${v.contact.name}, לגבי האירוע של ${v.event.name}: `)}`} target="_blank" rel="noreferrer">💬 וואטסאפ</a>
                <a className="c" href={`tel:${v.contact.phone}`}>📞 שיחה</a>
              </div>
            )}
          </section>
          <div className="foot">
            {v.business} · הדף מתעדכן אוטומטית
            {!preview && (
              <button className="p-out" onClick={() => (clientSession.set(null), location.reload())}>
                יציאה
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** כניסה: הטלפון שלכם + קוד מרבר */
function Login({ onDone }: { onDone(session: string): void }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="p-state">
      <form
        className="box p-login"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr("");
          try {
            onDone(await api.login(phone, code));
          } catch (x) {
            setErr(x instanceof Error ? x.message : "שגיאה. נסו שוב");
          } finally {
            setBusy(false);
          }
        }}
      >
        <span className="mono" style={{ margin: "0 auto" }}>ר</span>
        <h1 className="serif">הדף של האירוע שלכם</h1>
        <p>נכנסים עם מספר הטלפון שלכם והקוד שקיבלתם מאיתנו בוואטסאפ.</p>
        <label>
          מספר טלפון
          <input inputMode="tel" autoComplete="tel" dir="ltr" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="050-0000000" />
        </label>
        <label>
          קוד
          <input inputMode="numeric" autoComplete="one-time-code" dir="ltr" required maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="••••••" />
        </label>
        {err && <div className="p-err" role="alert">{err}</div>}
        <button className="p-btn" disabled={busy || code.length !== 6}>
          {busy ? "נכנסים…" : "כניסה"}
        </button>
        <small>אין לכם קוד? בקשו אותו מאיש הקשר שלכם.</small>
      </form>
    </div>
  );
}

/** "המשימות שלנו": שמירה מיידית, אחת-אחת, עם חיווי. התנגשות = טוענים מחדש. */
function TasksSection({ view, readOnly, onReload }: { view: ClientView; readOnly: boolean; onReload(): void }) {
  const t = view.tasks!;
  const [tasks, setTasks] = useState<ClientTask[]>(t.list);
  const [dismissed, setDismissed] = useState<string[]>(t.dismissed);
  const [save, setSave] = useState<SaveState>("idle");
  const rev = useRef(t.rev);
  const pending = useRef<{ tasks: ClientTask[]; dismissed: string[] } | null>(null);
  const busy = useRef(false);

  const flush = useCallback(async () => {
    if (busy.current || !pending.current) return;
    busy.current = true;
    const s = clientSession.get();
    while (pending.current) {
      const next = pending.current;
      pending.current = null;
      setSave("saving");
      try {
        rev.current = await api.saveTasks(s ?? "", { ...next, rev: rev.current });
        setSave("saved");
      } catch (e) {
        busy.current = false;
        if (e instanceof PortalError && (e.code === "conflict" || e.code === "auth")) return onReload();
        pending.current = pending.current ?? next;
        setSave("error");
        return;
      }
    }
    busy.current = false;
    setTimeout(() => setSave((x) => (x === "saved" ? "idle" : x)), 1800);
  }, [onReload]);

  return (
    <section className="sec" id="tasks">
      <h2 className="serif">
        <span className="ic">✅</span>המשימות שלנו
      </h2>
      <TaskList
        tasks={tasks}
        dismissed={dismissed}
        partners={t.partners}
        eventType={view.event.type}
        eventDate={view.event.date}
        readOnly={readOnly}
        save={save}
        onRetry={flush}
        onChange={(nt, nd) => {
          setTasks(nt);
          setDismissed(nd);
          pending.current = { tasks: nt, dismissed: nd };
          flush();
        }}
      />
    </section>
  );
}
