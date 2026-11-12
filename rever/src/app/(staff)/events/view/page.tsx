"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import type { Doc, EventPlan, Lead, PlanPayment, PortalSection, Supplier, TimelineItem } from "@/lib/types";
import { DOC_STATUS, DOC_TYPES, PORTAL_SECTIONS, SUPPLIER_CATEGORIES } from "@/lib/types";
import { nis, relDay, shortDate, uid } from "@/lib/format";
import { AFTER_STEPS, CHECKS, byTime, daysUntil, planOf, readiness, timelineTemplate, timelineText, type PlanView } from "@/lib/events";
import { CLIENT_STEP_LABELS, DEFAULT_CLIENT_STEPS, DEFAULT_SECTIONS, allocatePlan, newPortalCode, newPortalToken, portalPath } from "@/lib/portal";
import { fillTemplate, waLink } from "@/lib/whatsapp";
import { TASKS_LOG_PREFIX, lateTasks, parseTasks, partnersOf, starterTasks } from "@/lib/tasks";
import { TaskList } from "@/components/TaskList";

type Tab = "timeline" | "suppliers" | "prep" | "tasks" | "payments" | "portal";

export default function EventPage() {
  return (
    <Suspense>
      <EventById />
    </Suspense>
  );
}

function EventById() {
  const id = useSearchParams().get("id") ?? "";
  const { lead } = useStore();
  const l = lead(id);
  if (!l)
    return (
      <div className="empty">
        האירוע לא נמצא. <Link className="link" href="/events">לכל האירועים</Link>
      </div>
    );
  return <EventCard l={l} />;
}

const parse = <X,>(s: string | undefined, d: X): X => {
  if (!s) return d;
  try {
    return JSON.parse(s) as X;
  } catch {
    return d;
  }
};

function EventCard({ l }: { l: Lead }) {
  const { db, save, can } = useStore();
  const [tab, setTab] = useState<Tab>("timeline");
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1) as Tab;
      if (["timeline", "suppliers", "prep", "tasks", "payments", "portal"].includes(h)) setTab(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const v = planOf(db, l);
  const r = readiness(v);
  const days = daysUntil(l.event_date);
  const savePlan = (patch: Partial<EventPlan>) => save("event_plans", { ...v.plan, ...patch, updated_at: new Date().toISOString() });

  const TABS: { id: Tab; label: string; show: boolean }[] = [
    { id: "timeline", label: "🕒 לו״ז", show: true },
    { id: "suppliers", label: "🤝 ספקים", show: true },
    { id: "prep", label: "✅ הכנה", show: true },
    { id: "tasks", label: "📝 משימות הזוג", show: l.status === "won" },
    { id: "payments", label: "💳 תשלומים", show: can("prices") && can("finance") },
    { id: "portal", label: "🔗 קישור ללקוח", show: can("portal") },
  ];

  return (
    <>
      <div className="top">
        <div>
          <div className="crumb">
            <Link href="/events">אירועים</Link> ‹ כרטיס אירוע
          </div>
          <h1>
            {l.event_type}: {l.name}
          </h1>
          <div className="sub">
            📅 {shortDate(l.event_date)}
            {days !== null && (days >= 0 ? ` · בעוד ${days} ימים` : " · האירוע עבר")}
            {l.venue ? ` · 📍 ${l.venue}` : ""}
            {l.guests ? ` · 👥 ${l.guests}` : ""}
          </div>
        </div>
        <div className="ml" style={{ minWidth: 170 }}>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 14, fontWeight: 600 }}>
            <span>מוכנות</span>
            <span>{r.pct}%</span>
          </div>
          <div className="progress" style={{ width: "100%", height: 9, marginTop: 6 }}>
            <span style={{ width: `${r.pct}%`, background: r.pct === 100 ? "var(--green)" : r.pct >= 50 ? "var(--gold)" : "var(--orange)" }} />
          </div>
        </div>
        <Link className="btn" href={`/leads/view?id=${l.id}`}>
          👤 כרטיס לקוח
        </Link>
        {can("portal") && (
          <button className="btn pri" onClick={() => setTab("portal")}>
            🔗 קישור ללקוח
          </button>
        )}
      </div>

      <div className="tabs ev-tabs">
        {TABS.filter((t) => t.show).map((t) => (
          <button key={t.id} className={"tab" + (tab === t.id ? " on" : "")} onClick={() => (setTab(t.id), history.replaceState(null, "", "#" + t.id))}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "timeline" && <TimelineTab l={l} v={v} onChange={(t) => savePlan({ timeline: JSON.stringify(t) })} />}
      {tab === "suppliers" && <SuppliersTab v={v} onChange={(s) => savePlan({ suppliers: JSON.stringify(s) })} showCost={can("prices")} />}
      {tab === "prep" && <PrepTab l={l} v={v} days={days} savePlan={savePlan} />}
      {tab === "tasks" && <CoupleTasksTab l={l} v={v} savePlan={savePlan} />}
      {tab === "payments" && can("prices") && can("finance") && <PaymentsTab l={l} v={v} savePlan={savePlan} />}
      {tab === "portal" && can("portal") && <PortalTab l={l} v={v} savePlan={savePlan} />}
    </>
  );
}

/* ---------------- לו"ז ---------------- */
function TimelineTab({ l, v, onChange }: { l: Lead; v: PlanView; onChange: (t: TimelineItem[]) => void }) {
  const { toast } = useStore();
  const rows = [...v.timeline].sort(byTime);
  const set = (id: string, patch: Partial<TimelineItem>) => onChange(v.timeline.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  return (
    <div className="card">
      <h2>
        🕒 לו״ז האירוע
        <span className="r row" style={{ gap: 6 }}>
          {rows.length > 0 && (
            <>
              <a className="btn sm wa" href={waLink("", timelineText(l, v))} target="_blank" rel="noreferrer">
                💬 שליחה לספקים
              </a>
              <button className="btn sm" onClick={() => navigator.clipboard?.writeText(timelineText(l, v)).then(() => toast("הלו\"ז הועתק"))}>
                📋 העתקה
              </button>
            </>
          )}
        </span>
      </h2>
      {rows.length === 0 ? (
        <div className="empty" style={{ padding: "18px 0" }}>
          עוד אין לו"ז.{" "}
          <button className="link" onClick={() => onChange(timelineTemplate(l.event_type))}>
            להתחיל מתבנית של {l.event_type}
          </button>
        </div>
      ) : (
        <div className="tl-head">
          <span>שעה</span>
          <span>מה קורה</span>
          <span>
            מי אחראי <span className="badge-int">פנימי</span>
          </span>
          <span title="להציג את השורה בקישור ללקוח">ללקוח</span>
          <span />
        </div>
      )}
      {rows.map((t) => (
        <div key={t.id} className="tl-row tl-row5">
          <input
            className="tl-time"
            inputMode="numeric"
            placeholder="19:30"
            maxLength={5}
            dir="ltr"
            defaultValue={t.time}
            onBlur={(e) => {
              const val = normTime(e.target.value);
              e.target.value = val;
              if (val !== t.time) set(t.id, { time: val });
            }}
          />
          <input className="tl-title" defaultValue={t.title} placeholder="מה קורה" onBlur={(e) => e.target.value !== t.title && set(t.id, { title: e.target.value })} />
          <input className="tl-who" defaultValue={t.who ?? ""} placeholder="מי אחראי" onBlur={(e) => e.target.value !== (t.who ?? "") && set(t.id, { who: e.target.value })} />
          <label className="switch" title="להציג ללקוח">
            <input type="checkbox" checked={t.show_client !== false} onChange={(e) => set(t.id, { show_client: e.target.checked })} />
            <span />
          </label>
          <button className="muted" title="הסרה" onClick={() => onChange(v.timeline.filter((x) => x.id !== t.id))}>
            ✕
          </button>
        </div>
      ))}
      <button className="link" style={{ marginTop: 10 }} onClick={() => onChange([...v.timeline, { id: uid(), time: "", title: "", who: "" }])}>
        + שורה
      </button>
    </div>
  );
}

/* ---------------- ספקים ---------------- */
function SuppliersTab({ v, onChange, showCost }: { v: PlanView; onChange: (s: Supplier[]) => void; showCost: boolean }) {
  const set = (id: string, patch: Partial<Supplier>) => onChange(v.suppliers.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const total = v.suppliers.reduce((s, x) => s + (x.cost || 0), 0);
  return (
    <div className="card" style={{ padding: 0 }}>
      <h2 style={{ padding: "18px 20px 0" }}>
        🤝 ספקים
        <span className="r muted" style={{ fontSize: 14, fontWeight: 500 }}>
          {v.suppliers.filter((s) => s.confirmed).length}/{v.suppliers.length} אישרו
          {showCost && total ? ` · עלות ${nis(total)}` : ""}
        </span>
      </h2>
      <div className="tablewrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>קטגוריה</th>
              <th>שם</th>
              <th>טלפון</th>
              {showCost && <th>עלות</th>}
              <th>אישר</th>
              <th title="להציג בקישור ללקוח (בלי מחיר)">ללקוח</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {v.suppliers.map((s) => (
              <tr key={s.id}>
                <td>
                  <select
                    className="cell"
                    style={{ width: "auto", minWidth: 130 }}
                    value={s.category ?? ""}
                    onChange={(e) => set(s.id, { category: e.target.value || undefined, role: SUPPLIER_CATEGORIES.find((c) => c.id === e.target.value)?.label ?? s.role })}
                  >
                    <option value="">{s.role || "—"}</option>
                    {SUPPLIER_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input className="cell" defaultValue={s.name} onBlur={(e) => e.target.value !== s.name && set(s.id, { name: e.target.value })} />
                </td>
                <td>
                  <input className="cell" dir="ltr" defaultValue={s.phone ?? ""} onBlur={(e) => e.target.value !== (s.phone ?? "") && set(s.id, { phone: e.target.value })} />
                </td>
                {showCost && (
                  <td>
                    <input
                      className="cell"
                      type="number"
                      defaultValue={s.cost ?? ""}
                      onBlur={(e) => Number(e.target.value || 0) !== (s.cost || 0) && set(s.id, { cost: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </td>
                )}
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={!!s.confirmed} onChange={(e) => set(s.id, { confirmed: e.target.checked })} />
                    <span />
                  </label>
                </td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={!!s.show_client} onChange={(e) => set(s.id, { show_client: e.target.checked })} />
                    <span />
                  </label>
                </td>
                <td>
                  <div className="row" style={{ gap: 6 }}>
                    {s.phone && (
                      <a className="ib wa" style={{ width: 34, height: 34 }} href={waLink(s.phone, `היי ${s.name}, `)} target="_blank" rel="noreferrer">
                        💬
                      </a>
                    )}
                    <button className="muted" title="הסרה" onClick={() => onChange(v.suppliers.filter((x) => x.id !== s.id))}>
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "10px 20px 16px" }}>
        <button className="link" onClick={() => onChange([...v.suppliers, { id: uid(), role: "", name: "", confirmed: false, show_client: true }])}>
          + ספק
        </button>
      </div>
    </div>
  );
}

/* ---------------- הכנה ---------------- */
function PrepTab({ l, v, days, savePlan }: { l: Lead; v: PlanView; days: number | null; savePlan: (p: Partial<EventPlan>) => void }) {
  const { db, settings } = useStore();
  const r = readiness(v);
  const toggle = (k: string) => savePlan({ checklist: JSON.stringify({ ...v.checklist, [k]: !v.checklist[k] }) });
  const contract = v.plan.contract_status ?? "none";
  return (
    <div className="eventgrid">
      <div className="card">
        <h2>
          ✅ צ'קליסט הכנה
          <span className="r muted" style={{ fontSize: 14, fontWeight: 500 }}>
            {r.done}/{r.total}
          </span>
        </h2>
        {CHECKS.map((c) => (
          <label key={c.id} className="check">
            <input type="checkbox" checked={!!v.checklist[c.id]} onChange={() => toggle(c.id)} />
            <span>{c.label}</span>
          </label>
        ))}
        {v.extra.map((x) => (
          <label key={x} className="check">
            <input type="checkbox" checked={!!v.checklist["x:" + x]} onChange={() => toggle("x:" + x)} />
            <span>{x}</span>
            <button className="ml muted" title="הסרה" onClick={(e) => (e.preventDefault(), savePlan({ extra_checks: JSON.stringify(v.extra.filter((y) => y !== x)) }))}>
              ✕
            </button>
          </label>
        ))}
        <AddLine placeholder="+ פריט נוסף לרשימה" onAdd={(x) => !v.extra.includes(x) && savePlan({ extra_checks: JSON.stringify([...v.extra, x]) })} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="card">
          <h2>📝 חוזה</h2>
          <div className="seg">
            {(
              [
                ["none", "טרם נשלח"],
                ["sent", "נשלח"],
                ["signed", "נחתם ✓"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                className={contract === k ? "on" : ""}
                onClick={() => savePlan({ contract_status: k, ...(k === "signed" ? { checklist: JSON.stringify({ ...v.checklist, contract: true }) } : {}) })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>
            🔒 הערות פנימיות
            <span className="r muted" style={{ fontSize: 13, fontWeight: 500 }}>
              הלקוח לא רואה
            </span>
          </h2>
          <textarea
            className="internal-notes"
            defaultValue={v.plan.internal_notes ?? ""}
            placeholder="מה הצוות צריך לדעת, ולא הלקוח"
            onBlur={(e) => e.target.value !== (v.plan.internal_notes ?? "") && savePlan({ internal_notes: e.target.value || undefined })}
          />
        </div>

        <div className="card">
          <h2>📞 ביום האירוע</h2>
          <div className="form">
            <div className="f">
              <label>איש קשר</label>
              <input defaultValue={v.plan.contact_name ?? ""} onBlur={(e) => e.target.value !== (v.plan.contact_name ?? "") && savePlan({ contact_name: e.target.value || undefined })} />
            </div>
            <div className="f">
              <label>טלפון</label>
              <input dir="ltr" defaultValue={v.plan.contact_phone ?? ""} onBlur={(e) => e.target.value !== (v.plan.contact_phone ?? "") && savePlan({ contact_phone: e.target.value || undefined })} />
            </div>
            <div className="f full">
              <label>מה שסיכמנו עם הלקוח (מוצג ללקוח בפרטי האירוע)</label>
              <textarea defaultValue={v.plan.requests ?? ""} onBlur={(e) => e.target.value !== (v.plan.requests ?? "") && savePlan({ requests: e.target.value || undefined })} />
            </div>
          </div>
        </div>

        {days !== null && days <= 0 && (
          <div className="card">
            <h2>⭐ אחרי האירוע</h2>
            <div className="row" style={{ flexWrap: "wrap", marginBottom: 12 }}>
              <a
                className="btn wa"
                href={waLink(l.phone, fillTemplate(db.templates.find((t) => t.name.includes("תודה"))?.body ?? "תודה שבחרתם בנו! נשמח להמלצה 🙏", l, settings))}
                target="_blank"
                rel="noreferrer"
                onClick={() => savePlan({ after: JSON.stringify({ ...v.after, review_asked: true }) })}
              >
                ⭐ בקשת המלצה
              </a>
              <a className="btn" href={waLink(l.phone, `היי ${l.name}, אשמח אם תשלחו לנו כמה תמונות וסרטונים מהאירוע 📸🙏`)} target="_blank" rel="noreferrer">
                📸 בקשת צילומים
              </a>
            </div>
            <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
              {AFTER_STEPS.map((s) => (
                <button key={s.id} className={"fl" + (v.after[s.id] ? " on" : "")} onClick={() => savePlan({ after: JSON.stringify({ ...v.after, [s.id]: !v.after[s.id] }) })}>
                  {v.after[s.id] ? "✓ " : ""}
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- משימות הזוג ---------------- */
function CoupleTasksTab({ l, v, savePlan }: { l: Lead; v: PlanView; savePlan: (p: Partial<EventPlan>) => void }) {
  const { db, saveTasks, toast } = useStore();
  const tasks = parseTasks(v.plan.client_tasks);
  const dismissed = parse<string[]>(v.plan.dismissed_suggestions, []);
  const partners = partnersOf(l, v.plan);
  const late = lateTasks(tasks, 1);
  const log = db.activities
    .filter((a) => a.lead_id === l.id && (a.text.startsWith(TASKS_LOG_PREFIX) || a.text.includes("הלקוח צפה")))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);
  return (
    <div className="eventgrid">
      <div className="card">
        <h2>
          📝 המשימות של הזוג
          <span className="r muted" style={{ fontSize: 13, fontWeight: 500 }}>
            הזוג רואה ועורך את אותה רשימה
          </span>
        </h2>
        <TaskList
          variant="staff"
          tasks={tasks}
          dismissed={dismissed}
          partners={partners}
          eventType={l.event_type}
          eventDate={l.event_date}
          onChange={(t, d) => saveTasks(l.id, t, d)}
        />
        {tasks.length === 0 && (
          <button className="btn" style={{ marginTop: 10 }} onClick={() => (saveTasks(l.id, starterTasks(l.event_type, l.event_date), dismissed), toast("נטענה רשימה מוכנה ✓"))}>
            📋 טעינת רשימה מוכנה ל{l.event_type}
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="card">
          <h2>👫 בני הזוג</h2>
          <div className="form">
            <div className="f">
              <label>שם א׳</label>
              <input defaultValue={v.plan.partner_a ?? ""} placeholder={partners.a} onBlur={(e) => e.target.value !== (v.plan.partner_a ?? "") && savePlan({ partner_a: e.target.value.trim() || undefined })} />
            </div>
            <div className="f">
              <label>שם ב׳</label>
              <input defaultValue={v.plan.partner_b ?? ""} placeholder={partners.b} onBlur={(e) => e.target.value !== (v.plan.partner_b ?? "") && savePlan({ partner_b: e.target.value.trim() || undefined })} />
            </div>
          </div>
        </div>
        <div className="card">
          <h2>🕘 מה הזוג עשה</h2>
          {log.length === 0 && <div className="muted" style={{ fontSize: 14 }}>עוד לא נכנסו לדף.</div>}
          {log.map((a) => (
            <div key={a.id} className="trow" style={{ display: "block" }}>
              <div style={{ fontSize: 14 }}>{a.text}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{relDay(a.at)}</div>
            </div>
          ))}
          {late.map((t) => (
            <div key={t.id} className="trow">
              <span style={{ fontSize: 14 }}>⚠ &quot;{t.title}&quot; באיחור</span>
              <a
                className="btn sm wa ml"
                target="_blank"
                rel="noreferrer"
                href={waLink(l.phone, `היי ${l.name} 😊 ראיתי ש"${t.title}" עוד פתוח. צריכים עזרה או המלצה? אנחנו כאן.`)}
              >
                💬 להציע עזרה
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- תשלומים ---------------- */
function PaymentsTab({ l, v, savePlan }: { l: Lead; v: PlanView; savePlan: (p: Partial<EventPlan>) => void }) {
  const { db, save, can } = useStore();
  const plan = parse<PlanPayment[]>(v.plan.payment_plan, []);
  const paid = db.payments.filter((p) => p.lead_id === l.id).reduce((s, p) => s + (p.kind === "refund" ? -p.amount : p.amount), 0);
  const alloc = allocatePlan(plan, paid);
  const sum = plan.reduce((s, p) => s + (p.amount || 0), 0);
  const setPlan = (next: PlanPayment[]) => savePlan({ payment_plan: JSON.stringify(next) });
  const set = (id: string, patch: Partial<PlanPayment>) => setPlan(plan.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const docs = db.docs.filter((d) => d.lead_id === l.id);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="eventgrid">
      <div className="card">
        <h2>
          💳 תוכנית תשלומים
          <span className="r muted" style={{ fontSize: 14, fontWeight: 500 }}>
            {nis(sum)}
            {l.price && sum !== l.price ? <span className="late"> · מחיר העסקה {nis(l.price)}</span> : null}
          </span>
        </h2>
        {plan.length === 0 && l.price ? (
          <div className="empty" style={{ padding: "14px 0" }}>
            אין עדיין תוכנית.{" "}
            <button
              className="link"
              onClick={() => {
                const third = Math.round(l.price! / 3 / 100) * 100;
                setPlan([
                  { id: uid(), name: "מקדמה", amount: third, due: today },
                  { id: uid(), name: "תשלום ביניים", amount: third },
                  { id: uid(), name: "תשלום אחרון", amount: l.price! - third * 2, due: l.event_date },
                ]);
              }}
            >
              לחלק ל-3 תשלומים
            </button>
          </div>
        ) : null}
        {plan.length > 0 && (
          <div className="tablewrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>שלב</th>
                <th>סכום</th>
                <th>עד תאריך</th>
                <th>מצב</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plan.map((p, i) => (
                <tr key={p.id}>
                  <td>
                    <input className="cell" defaultValue={p.name} onBlur={(e) => e.target.value !== p.name && set(p.id, { name: e.target.value })} />
                  </td>
                  <td>
                    <input className="cell" type="number" defaultValue={p.amount} onBlur={(e) => Number(e.target.value) !== p.amount && set(p.id, { amount: Number(e.target.value) || 0 })} />
                  </td>
                  <td>
                    <input className="cell" type="date" defaultValue={p.due ?? ""} onBlur={(e) => e.target.value !== (p.due ?? "") && set(p.id, { due: e.target.value || undefined })} />
                  </td>
                  <td>
                    {alloc[i]?.paid ? (
                      <span className="tag t-green">שולם ✓</span>
                    ) : p.due && p.due < today ? (
                      <span className="tag t-red">באיחור</span>
                    ) : (
                      <span className="tag t-gold">ממתין</span>
                    )}
                  </td>
                  <td>
                    <button className="muted" onClick={() => setPlan(plan.filter((x) => x.id !== p.id))}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        <button className="link" style={{ marginTop: 10 }} onClick={() => setPlan([...plan, { id: uid(), name: "", amount: 0 }])}>
          + שלב תשלום
        </button>
        <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
          "שולם" מתעדכן לבד לפי התשלומים שנרשמו בכספים (שולם עד היום: {nis(paid)}).
        </div>
      </div>

      {(
        <div className="card">
          <h2>
            📄 מסמכים
            <span className="r muted" style={{ fontSize: 13, fontWeight: 500 }}>
              ללקוח = מוצג בקישור
            </span>
          </h2>
          {docs.length === 0 && <div className="muted" style={{ fontSize: 14 }}>אין מסמכים. מוסיפים ממסך הכספים או מכרטיס הלקוח.</div>}
          {docs.map((d: Doc) => (
            <div key={d.id} className="trow">
              <span>
                {DOC_TYPES[d.type]} {d.number} · <span className="muted">{DOC_STATUS[d.status]}</span>
              </span>
              <b className="ml">{nis(d.amount)}</b>
              <label className="switch" title="להציג ללקוח">
                <input type="checkbox" checked={!!d.show_client} onChange={(e) => save("docs", { ...d, show_client: e.target.checked })} />
                <span />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- קישור ללקוח ---------------- */
function PortalTab({ l, v, savePlan }: { l: Lead; v: PlanView; savePlan: (p: Partial<EventPlan>) => void }) {
  const { settings, toast, can } = useStore();
  const [base, setBase] = useState("");
  useEffect(() => setBase(window.location.origin + window.location.pathname.split("/events")[0]), []);
  const token = v.plan.portal_token;
  const code = v.plan.portal_code;
  const ver = Number(v.plan.portal_code_ver) || 0;
  const enabled = !!v.plan.portal_enabled && !!token;
  const url = token ? base + portalPath(token) : ""; // תצוגה מקדימה לצוות בלבד
  const loginUrl = base + "/e";
  const sections = { ...DEFAULT_SECTIONS, ...parse<Partial<Record<PortalSection, boolean>>>(v.plan.portal_sections, {}) };
  const steps = parse<string[]>(v.plan.client_steps, DEFAULT_CLIENT_STEPS);
  const msg = `היי ${l.name} 🥂\nזה הדף של האירוע שלכם, כל מה שחשוב במקום אחד: הלו״ז, המשימות שלכם, התשלומים ואנשי הקשר.\n${loginUrl}\nנכנסים עם מספר הטלפון הזה והקוד: ${code}`;
  const [frame, setFrame] = useState(0);
  const refresh = () => setTimeout(() => setFrame((x) => x + 1), 600);

  if (l.status !== "won") return <div className="card empty">הקישור ללקוח זמין לאירוע שנסגר.</div>;

  return (
    <div className="portalgrid">
      <div className="card">
        <h2>
          🔗 הדף של הלקוח
          <span className="r">{enabled ? <span className="tag t-green">פעיל</span> : <span className="tag t-gray">כבוי</span>}</span>
        </h2>
        {!enabled || !code ? (
          <>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
              דף אישי לאירוע, מהטלפון. הזוג נכנס עם מספר הטלפון שלו וקוד שאתם שולחים. הוא רואה לו״ז, תשלומים, ספקים ואיש קשר, ועורך רק את המשימות שלו. בלי עלויות, רווח או הערות פנימיות.
            </p>
            <button
              className="btn pri"
              onClick={() => (savePlan({ portal_token: token || newPortalToken(), portal_enabled: true, portal_code: code || newPortalCode(), portal_code_ver: ver }), refresh())}
            >
              🔗 הפעלת הדף והנפקת קוד
            </button>
          </>
        ) : (
          <>
            <div className="codebox">
              <div>
                <small>כתובת (אותה לכל הלקוחות)</small>
                <b dir="ltr">{loginUrl.replace(/^https?:\/\//, "")}</b>
              </div>
              <div>
                <small>טלפון</small>
                <b dir="ltr">{l.phone || "—"}</b>
              </div>
              <div>
                <small>קוד כניסה</small>
                <b dir="ltr" className="code">{code}</b>
              </div>
            </div>
            {!l.phone && <div className="banner err" style={{ marginTop: 10 }}>אין טלפון בכרטיס הלקוח, ולכן הזוג לא יוכל להיכנס. מוסיפים טלפון בכרטיס הלקוח.</div>}
            <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
              <a className="btn wa" href={waLink(l.phone, msg)} target="_blank" rel="noreferrer">
                💬 שליחה ל{l.name}
              </a>
              <button className="btn" onClick={() => navigator.clipboard?.writeText(msg).then(() => toast("ההודעה הועתקה"))}>
                📋 העתקת ההודעה
              </button>
              <a className="btn" href={url} target="_blank" rel="noreferrer">
                👁 לראות כמו הלקוח
              </a>
            </div>
            <div className="trow" style={{ marginTop: 8 }}>
              <span>👀 נצפה לאחרונה</span>
              <b className="ml">{v.plan.portal_seen_at ? relDay(v.plan.portal_seen_at) : "עוד לא נכנסו"}</b>
            </div>
          </>
        )}
        {token && code && (
          <>
            <div className="trow">
              <span>הדף פעיל</span>
              <label className="switch ml">
                <input type="checkbox" checked={enabled} onChange={(e) => (savePlan({ portal_enabled: e.target.checked }), refresh())} />
                <span />
              </label>
            </div>
            <div className="trow">
              <span className="muted" style={{ fontSize: 14 }}>הקוד הגיע למישהו אחר?</span>
              <button
                className="btn sm danger ml"
                onClick={() =>
                  confirm("מי שנכנס עם הקוד הנוכחי ינותק מיד. להנפיק קוד חדש?") &&
                  (savePlan({ portal_code: newPortalCode(), portal_code_ver: ver + 1, portal_token: newPortalToken() }), toast("נוצר קוד חדש. צריך לשלוח אותו לזוג"), refresh())
                }
              >
                קוד חדש
              </button>
            </div>
          </>
        )}
        {!settings.contact_phone && can("settings") && (
          <div className="banner" style={{ marginTop: 10 }}>
            כדי שללקוח יופיעו כפתורי וואטסאפ ושיחה לאיש הקשר, הגדירו "טלפון לפניות לקוחות" בהגדרות.
          </div>
        )}
        <h2 style={{ marginTop: 18 }}>מה הלקוח רואה</h2>
        {PORTAL_SECTIONS.map((s) => (
          <div key={s.id} className="trow">
            <span>
              {s.label} {s.hint && <span className="muted" style={{ fontSize: 13 }}>({s.hint})</span>}
            </span>
            <label className="switch ml">
              <input type="checkbox" checked={sections[s.id]} onChange={(e) => (savePlan({ portal_sections: JSON.stringify({ ...sections, [s.id]: e.target.checked }) }), refresh())} />
              <span />
            </label>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>✨ שלבים שהלקוח רואה</h2>
        {CHECKS.map((c) => (
          <div key={c.id} className="trow">
            <span className={steps.includes(c.id) ? "" : "muted"}>
              {v.checklist[c.id] ? "✓" : "⏳"} {CLIENT_STEP_LABELS[c.id] ?? c.label}
            </span>
            <label className="switch ml">
              <input
                type="checkbox"
                checked={steps.includes(c.id)}
                onChange={(e) => (savePlan({ client_steps: JSON.stringify(e.target.checked ? [...steps, c.id] : steps.filter((x) => x !== c.id)) }), refresh())}
              />
              <span />
            </label>
          </div>
        ))}
        <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
          מה שמסומן ✓ נקבע בצ'קליסט בלשונית "הכנה". ספקים, שורות לו"ז ומסמכים נבחרים בלשוניות שלהם (מתג "ללקוח").
        </div>
      </div>

      <div className="phone-wrap">
        <div className="muted" style={{ fontSize: 13.5, fontWeight: 600 }}>תצוגה מקדימה · כך זה נראה אצל הלקוח</div>
        {enabled ? (
          <div className="phone">
            <iframe key={frame} src={url} title="תצוגה מקדימה" />
          </div>
        ) : (
          <div className="phone phone-off">הקישור כבוי</div>
        )}
      </div>
    </div>
  );
}

/** "1930" / "19.30" / "9:5" → "19:30" / "09:05" */
function normTime(raw: string) {
  const d = raw.replace(/[^\d]/g, "");
  if (!d) return "";
  const [h, m] = raw.includes(":") || raw.includes(".") ? raw.split(/[:.]/).map((x) => x.replace(/\D/g, "")) : d.length <= 2 ? [d, "0"] : [d.slice(0, -2), d.slice(-2)];
  const hh = Math.min(23, Number(h || 0)),
    mm = Math.min(59, Number(m || 0));
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function AddLine({ placeholder, onAdd }: { placeholder: string; onAdd: (x: string) => void }) {
  const [x, setX] = useState("");
  return (
    <form
      className="row"
      style={{ marginTop: 8 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (x.trim()) onAdd(x.trim());
        setX("");
      }}
    >
      <input className="search" style={{ minWidth: 0, flex: 1, height: 38 }} placeholder={placeholder} value={x} onChange={(e) => setX(e.target.value)} />
    </form>
  );
}
