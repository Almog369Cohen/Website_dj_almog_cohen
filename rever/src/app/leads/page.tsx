"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useStore } from "@/lib/store";
import { STATUSES } from "@/lib/types";
import type { LeadStatus } from "@/lib/types";
import { isOverdue, relDay, shortDate } from "@/lib/format";
import { StatusTag } from "@/components/ui";
import { LeadModal } from "@/components/forms";

export default function LeadsPage() {
  return (
    <Suspense>
      <Leads />
    </Suspense>
  );
}

function Leads() {
  const { db } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const status = (params.get("status") as LeadStatus | null) ?? "all";
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);

  const active = db.leads.filter((l) => !["won", "lost"].includes(l.status)).length;
  const rows = db.leads
    .filter((l) => (status === "all" ? l.status !== "lost" : l.status === status))
    .filter((l) => !q || (l.name + l.phone + (l.event_type ?? "") + (l.venue ?? "")).includes(q.trim()))
    .sort((a, b) => {
      // קודם מי שצריך לחזור אליו, לפי זמן פולואפ
      const fa = a.next_followup && !["won", "lost"].includes(a.status) ? +new Date(a.next_followup) : Infinity;
      const fb = b.next_followup && !["won", "lost"].includes(b.status) ? +new Date(b.next_followup) : Infinity;
      if (fa !== fb) return fa - fb;
      return +new Date(b.created_at) - +new Date(a.created_at);
    });

  const setStatus = (s: string) => router.replace(s === "all" ? "/leads" : `/leads?status=${s}`);

  return (
    <>
      <div className="top">
        <div>
          <h1>לידים</h1>
          <div className="sub">{active} לידים פעילים</div>
        </div>
        <input className="search ml" placeholder="🔍 חיפוש שם, טלפון, מקום…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn pri" onClick={() => setAdding(true)}>
          + ליד חדש
        </button>
      </div>
      <div className="filters">
        <button className={"fl" + (status === "all" ? " on" : "")} onClick={() => setStatus("all")}>
          הכל<i>{db.leads.filter((l) => l.status !== "lost").length}</i>
        </button>
        {STATUSES.map((s) => (
          <button key={s.id} className={"fl" + (status === s.id ? " on" : "")} onClick={() => setStatus(s.id)}>
            {s.label}
            <i>{db.leads.filter((l) => l.status === s.id).length}</i>
          </button>
        ))}
      </div>
      <div className="card tablewrap" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>שם</th>
              <th>סוג אירוע</th>
              <th>תאריך אירוע</th>
              <th>טלפון</th>
              <th>סטטוס</th>
              <th>פולואפ הבא</th>
              <th>קשר אחרון</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => {
              const openLead = !["won", "lost"].includes(l.status);
              return (
                <tr key={l.id} className="click" onClick={() => router.push(`/leads/${l.id}`)}>
                  <td>
                    <b>{l.name}</b>
                  </td>
                  <td>
                    {l.event_type}
                    {l.guests ? ` · ${l.guests}` : ""}
                  </td>
                  <td className="num">{shortDate(l.event_date)}</td>
                  <td className="num" dir="ltr" style={{ textAlign: "right" }}>
                    {l.phone}
                  </td>
                  <td>
                    <StatusTag s={l.status} />
                  </td>
                  <td>
                    {openLead && l.next_followup ? (
                      isOverdue(l.next_followup) ? (
                        <span className="late">{relDay(l.next_followup, false)} ⚠</span>
                      ) : (
                        <b style={{ fontWeight: relDay(l.next_followup).startsWith("היום") ? 700 : 400 }}>{relDay(l.next_followup)}</b>
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{l.last_contact ? relDay(l.last_contact, false) : "—"}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="row" style={{ gap: 6 }}>
                      <a className="ib" href={`tel:${l.phone}`} title="שיחה">
                        📞
                      </a>
                      <Link className="ib wa" href={`/leads/${l.id}#wa`} title="וואטסאפ">
                        💬
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <div className="empty">אין לידים להצגה</div>}
      </div>
      {adding && <LeadModal onClose={() => setAdding(false)} onSaved={(l) => router.push(`/leads/${l.id}`)} />}
    </>
  );
}
