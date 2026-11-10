"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useStore } from "@/lib/store";
import type { EventPlan, Lead, Supplier, TimelineItem } from "@/lib/types";
import { nis, shortDate, uid } from "@/lib/format";
import { AFTER_STEPS, CHECKS, MOMENTS, byTime, daysUntil, equipmentList, planOf, readiness, timelineTemplate, timelineText, type PlanView } from "@/lib/events";
import { fillTemplate } from "@/lib/whatsapp";
import { waLink } from "@/lib/whatsapp";

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

function EventCard({ l }: { l: Lead }) {
  const { db, save, can, toast, settings } = useStore();
  const v = planOf(db, l);
  const r = readiness(v);
  const days = daysUntil(l.event_date);
  const paid = db.payments.filter((p) => p.lead_id === l.id).reduce((s, p) => s + (p.kind === "refund" ? -p.amount : p.amount), 0);

  const savePlan = (patch: Partial<EventPlan>) => save("event_plans", { ...v.plan, ...patch, updated_at: new Date().toISOString() });
  const setTimeline = (t: TimelineItem[]) => savePlan({ timeline: JSON.stringify(t) });
  const setSuppliers = (s: Supplier[]) => savePlan({ suppliers: JSON.stringify(s) });
  const toggle = (k: string) => savePlan({ checklist: JSON.stringify({ ...v.checklist, [k]: !v.checklist[k] }) });

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
            {l.guests ? ` · 👥 ${l.guests} איש` : ""}
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
        <button className="btn" onClick={() => window.print()}>
          🖨 הדפסה
        </button>
      </div>

      <div className="eventgrid">
        <Timeline l={l} v={v} onChange={setTimeline} toast={toast} />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
            <AddLine
              placeholder="+ פריט נוסף לרשימה"
              onAdd={(x) => !v.extra.includes(x) && savePlan({ extra_checks: JSON.stringify([...v.extra, x]) })}
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
                <label>בקשות מיוחדות</label>
                <textarea defaultValue={v.plan.requests ?? ""} onBlur={(e) => e.target.value !== (v.plan.requests ?? "") && savePlan({ requests: e.target.value || undefined })} />
              </div>
              <div className="f full">
                <label>הערות</label>
                <textarea defaultValue={v.plan.notes ?? ""} onBlur={(e) => e.target.value !== (v.plan.notes ?? "") && savePlan({ notes: e.target.value || undefined })} />
              </div>
            </div>
            {can("prices") && l.price ? (
              <div className="muted" style={{ fontSize: 14, marginTop: 12 }}>
                💰 מחיר {nis(l.price)} · שולם {nis(paid)} · יתרה <b className={l.price - paid > 0 ? "late" : ""}>{nis(Math.max(0, l.price - paid))}</b>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Suppliers v={v} onChange={setSuppliers} showCost={can("prices")} />

      <div className="eventgrid">
        <div className="card">
          <h2>
            🎵 שירים ורגעים
            <span className="r muted" style={{ fontSize: 14, fontWeight: 500 }}>
              {v.songs.length} שירים
            </span>
          </h2>
          <div className="moments">
            {MOMENTS.map((m) => (
              <div className="f" key={m.id}>
                <label>{m.label}</label>
                <input
                  defaultValue={v.moments[m.id] ?? ""}
                  placeholder="שם השיר"
                  onBlur={(e) => e.target.value.trim() !== (v.moments[m.id] ?? "") && savePlan({ moments: JSON.stringify({ ...v.moments, [m.id]: e.target.value.trim() }) })}
                />
              </div>
            ))}
          </div>
          <div className="form" style={{ marginTop: 12 }}>
            <div className="f">
              <label>שירי חובה (שיר בכל שורה)</label>
              <textarea defaultValue={v.plan.must_songs ?? ""} placeholder="למשל: אם לא את – התאומים" onBlur={(e) => e.target.value !== (v.plan.must_songs ?? "") && savePlan({ must_songs: e.target.value || undefined })} />
            </div>
            <div className="f">
              <label>אסור לנגן</label>
              <textarea defaultValue={v.plan.no_songs ?? ""} placeholder="שיר בכל שורה" onBlur={(e) => e.target.value !== (v.plan.no_songs ?? "") && savePlan({ no_songs: e.target.value || undefined })} />
            </div>
          </div>
        </div>

        <div className="card">
          {(() => {
            const items = equipmentList(v);
            const done = items.filter((x) => v.equipment[x]).length;
            return (
              <>
                <h2>
                  🎛️ ציוד לפני היציאה
                  <span className="r muted" style={{ fontSize: 14, fontWeight: 500 }}>
                    {done}/{items.length}
                  </span>
                </h2>
                {items.map((x) => (
                  <label key={x} className="check">
                    <input type="checkbox" checked={!!v.equipment[x]} onChange={() => savePlan({ equipment: JSON.stringify({ ...v.equipment, [x]: !v.equipment[x] }) })} />
                    <span>{x}</span>
                  </label>
                ))}
                <AddLine placeholder="+ פריט ציוד" onAdd={(x) => savePlan({ equipment: JSON.stringify({ ...v.equipment, [x]: false }) })} />
              </>
            );
          })()}
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
    </>
  );
}

/* ---------------- לו"ז ---------------- */
function Timeline({ l, v, onChange, toast }: { l: Lead; v: PlanView; onChange: (t: TimelineItem[]) => void; toast: (m: string) => void }) {
  const rows = [...v.timeline].sort(byTime);
  const set = (id: string, patch: Partial<TimelineItem>) => onChange(v.timeline.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  return (
    <div className="card">
      <h2>
        🕒 לו"ז האירוע
        <span className="r row" style={{ gap: 6 }}>
          {rows.length > 0 && (
            <>
              <a className="btn sm wa" href={waLink("", timelineText(l, v))} target="_blank" rel="noreferrer" title="שליחה בוואטסאפ: בוחרים למי בוואטסאפ">
                💬 שליחת לו"ז
              </a>
              <button className="btn sm" onClick={() => navigator.clipboard?.writeText(timelineText(l, v)).then(() => toast("הלו\"ז הועתק"))}>
                📋 העתקה
              </button>
            </>
          )}
        </span>
      </h2>
      {rows.length === 0 && (
        <div className="empty" style={{ padding: "18px 0" }}>
          עוד אין לו"ז.{" "}
          <button className="link" onClick={() => onChange(timelineTemplate(l.event_type))}>
            להתחיל מתבנית של {l.event_type}
          </button>
        </div>
      )}
      {rows.map((t) => (
        <div key={t.id} className="tl-row">
          <input
            className="tl-time"
            inputMode="numeric"
            placeholder="19:30"
            maxLength={5}
            dir="ltr"
            defaultValue={t.time}
            onBlur={(e) => {
              const v = normTime(e.target.value);
              e.target.value = v;
              if (v !== t.time) set(t.id, { time: v });
            }}
          />
          <input className="tl-title" defaultValue={t.title} placeholder="מה קורה" onBlur={(e) => e.target.value !== t.title && set(t.id, { title: e.target.value })} />
          <input className="tl-who" defaultValue={t.who ?? ""} placeholder="מי אחראי" onBlur={(e) => e.target.value !== (t.who ?? "") && set(t.id, { who: e.target.value })} />
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
function Suppliers({ v, onChange, showCost }: { v: PlanView; onChange: (s: Supplier[]) => void; showCost: boolean }) {
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
              <th>תפקיד</th>
              <th>שם</th>
              <th>טלפון</th>
              {showCost && <th>עלות</th>}
              <th>אישר</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {v.suppliers.map((s) => (
              <tr key={s.id}>
                <td>
                  <input className="cell" defaultValue={s.role} placeholder="DJ / צלם / אולם" onBlur={(e) => e.target.value !== s.role && set(s.id, { role: e.target.value })} />
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
        <button className="link" onClick={() => onChange([...v.suppliers, { id: uid(), role: "", name: "", confirmed: false }])}>
          + ספק
        </button>
      </div>
    </div>
  );
}

/** "1930" / "19.30" / "9:5" → "19:30" / "09:05" */
function normTime(raw: string) {
  const d = raw.replace(/[^\d]/g, "");
  if (!d) return "";
  const [h, m] = raw.includes(":") || raw.includes(".") ? raw.split(/[:.]/).map((x) => x.replace(/\D/g, "")) : d.length <= 2 ? [d, "0"] : [d.slice(0, -2), d.slice(-2)];
  const hh = Math.min(23, Number(h || 0)), mm = Math.min(59, Number(m || 0));
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
