"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { shortDate } from "@/lib/format";
import { CHECKS, daysUntil, planOf, readiness } from "@/lib/events";

export default function EventsPage() {
  const { db } = useStore();
  const router = useRouter();
  const [past, setPast] = useState(false);

  const events = db.leads
    .filter((l) => l.status === "won" && l.event_date)
    .map((l) => {
      const v = planOf(db, l);
      return { l, v, r: readiness(v), days: daysUntil(l.event_date)! };
    })
    .filter((e) => (past ? e.days < 0 : e.days >= 0))
    .sort((a, b) => (past ? b.days - a.days : a.days - b.days));

  return (
    <>
      <div className="top">
        <div>
          <h1>אירועים</h1>
          <div className="sub">כל אירוע שנסגר מקבל כרטיס אירוע: לו"ז, ספקים וצ'קליסט הכנה</div>
        </div>
        <span className="seg ml">
          <button className={!past ? "on" : ""} onClick={() => setPast(false)}>
            קרובים
          </button>
          <button className={past ? "on" : ""} onClick={() => setPast(true)}>
            עברו
          </button>
        </span>
      </div>
      {events.length === 0 && <div className="card empty">{past ? "אין אירועים שעברו" : "אין אירועים קרובים. ליד שמסומן \"נסגר\" עם תאריך יופיע כאן."}</div>}
      <div className="evlist">
        {events.map(({ l, v, r, days }) => {
          const missing = CHECKS.filter((c) => !v.checklist[c.id]).slice(0, 3);
          const urgent = !past && days <= 14 && r.pct < 100;
          return (
            <button key={l.id} className="card evcard" onClick={() => router.push(`/events/view?id=${l.id}`)}>
              <div className="row" style={{ alignItems: "flex-start" }}>
                <div className="evdate">
                  <b>{new Date(l.event_date + "T00:00:00").getDate()}</b>
                  <small>{shortDate(l.event_date).slice(3)}</small>
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
                  <b style={{ fontSize: 17 }}>{l.name}</b>
                  <div className="muted" style={{ fontSize: 13.5 }}>
                    {l.event_type}
                    {l.venue ? ` · ${l.venue}` : ""}
                    {l.guests ? ` · ${l.guests} איש` : ""}
                  </div>
                </div>
                <span className={"tag " + (past ? "t-gray" : urgent ? "t-red" : "t-gold")}>{past ? "עבר" : days === 0 ? "היום!" : `בעוד ${days} ימים`}</span>
              </div>
              <div className="row" style={{ marginTop: 12, gap: 10 }}>
                <div className="progress" style={{ flex: 1, width: "auto" }}>
                  <span style={{ width: `${r.pct}%`, background: r.pct === 100 ? "var(--green)" : r.pct >= 50 ? "var(--gold)" : "var(--orange)" }} />
                </div>
                <b style={{ fontSize: 13.5 }}>{r.pct}%</b>
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 8, textAlign: "right" }}>
                {r.pct === 100 ? "✓ הכל מוכן" : "חסר: " + missing.map((c) => c.label).join(" · ")}
                {" · "}לו"ז: {v.timeline.length ? `${v.timeline.length} שורות` : "אין"} · ספקים: {v.suppliers.filter((s) => s.confirmed).length}/{v.suppliers.length}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
