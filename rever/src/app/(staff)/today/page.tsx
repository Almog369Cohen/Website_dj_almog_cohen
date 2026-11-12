"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { STATUSES } from "@/lib/types";
import type { Lead } from "@/lib/types";
import { DAYS, MONTHS, endOfDay, initials, isDueToday, isOverdue, relDay, shortDate, startOfDay, time } from "@/lib/format";
import { Avatar, Owner, StatusTag } from "@/components/ui";
import { FollowupModal, LeadModal } from "@/components/forms";
import { stuckLeads } from "@/lib/leads";
import { usePullSheet } from "@/components/ImportSheet";
import { agendaItems } from "@/lib/agenda";
import { eventTodos } from "@/lib/events";
import { DemoGuide } from "@/components/DemoGuide";

export default function TodayPage() {
  const { db, settings, me, can } = useStore();
  // תזכורת תשלום כוללת סכום ונשענת על התשלומים: רק למי שרואה מחירים וגם כספים
  const todos = eventTodos(db).filter((t) => t.kind !== "payment" || (can("prices") && can("finance")));
  const [scope, setScope] = useState<"mine" | "all">(me?.role === "team" ? "mine" : "all");
  const nameOf = (id?: string) => db.members.find((m) => m.id === id)?.name;
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [pulling, setPulling] = useState(false);
  const pull = usePullSheet();
  const now = new Date();

  const open = db.leads.filter((l) => !["won", "lost"].includes(l.status));
  const due = open
    .filter((l) => scope === "all" || l.assigned_to === me?.id)
    .filter((l) => isDueToday(l.next_followup))
    .sort((a, b) => +new Date(a.next_followup!) - +new Date(b.next_followup!));

  const stuck = stuckLeads(db).filter((s) => scope === "all" || s.lead.assigned_to === me?.id);
  const [scheduling, setScheduling] = useState<Lead | null>(null);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of STATUSES) c[s.id] = 0;
    for (const l of db.leads) {
      // נסגר / לא רלוונטי: רק מהחודש
      if (["won", "lost"].includes(l.status) && new Date(l.last_contact ?? l.created_at) < monthStart) continue;
      c[l.status]++;
    }
    return c;
  }, [db.leads, monthStart]);

  const tomorrowEnd = endOfDay(new Date(now.getTime() + 86400000));
  const agenda = agendaItems(db).filter((a) => new Date(a.start) >= startOfDay() && new Date(a.start) <= tomorrowEnd);
  const meetingsToday = agenda.filter((a) => a.kind === "meeting" && new Date(a.start) <= endOfDay()).length;
  const hour = now.getHours();
  const hello = hour < 12 ? "בוקר טוב" : hour < 17 ? "צהריים טובים" : "ערב טוב";

  return (
    <>
      <div className="top">
        <div>
          <h1>
            {hello}
            {settings.owner_name ? `, ${settings.owner_name}` : ""}
          </h1>
          <div className="sub">
            יום {DAYS[now.getDay()]}, {now.getDate()} ב{MONTHS[now.getMonth()]} · {due.length} פולואפים להיום · {meetingsToday} פגישות
          </div>
        </div>
        {db.settings[0]?.sheet_url && (
          <button className="btn ml" disabled={pulling} onClick={async () => (setPulling(true), await pull(), setPulling(false))}>
            {pulling ? "מושך…" : "🔄 משוך לידים מהגיליון"}
          </button>
        )}
        <button className={"btn pri" + (db.settings[0]?.sheet_url ? "" : " ml")} onClick={() => setAdding(true)}>
          + ליד חדש
        </button>
      </div>
      <DemoGuide />

      <div className="statuses">
        {STATUSES.map((s) => (
          <Link key={s.id} href={`/leads?status=${s.id}`} className="st" style={{ borderTopColor: s.color }}>
            <div className="l">{s.label}</div>
            <div className="n">{counts[s.id]}</div>
            <small>{["won", "lost"].includes(s.id) ? "החודש" : s.hint}</small>
          </Link>
        ))}
      </div>

      <div className="grid2">
        <div className="card">
          <h2>
            📌 פולואפים להיום <span className="tag s-lost">{due.length}</span>
            <span className="seg">
              <button className={scope === "mine" ? "on" : ""} onClick={() => setScope("mine")}>
                שלי
              </button>
              <button className={scope === "all" ? "on" : ""} onClick={() => setScope("all")}>
                כולם
              </button>
            </span>
            <Link href="/leads" className="r link">
              לכל הלידים ←
            </Link>
          </h2>
          {due.length === 0 && <div className="empty">אין פולואפים להיום 🎉</div>}
          {due.map((l) => (
            <FollowupRow key={l.id} l={l} owner={nameOf(l.assigned_to)} mine={l.assigned_to === me?.id} onOpen={() => router.push(`/leads/view?id=${l.id}`)} />
          ))}
        </div>
        <div className="card">
          <h2>
            📅 היום ומחר
            <Link href="/calendar" className="r link">
              ליומן ←
            </Link>
          </h2>
          {agenda.length === 0 && <div className="empty">אין כלום ביומן להיום ומחר</div>}
          {agenda.map((a) => (
            <div
              className="ag"
              key={a.key}
              style={{ cursor: a.lead_id ? "pointer" : undefined }}
              onClick={() => a.lead_id && router.push(a.kind === "event" ? `/events/view?id=${a.lead_id}` : `/leads/view?id=${a.lead_id}`)}
            >
              <div className="tm">
                {a.allDay ? "—" : time(a.start)}
                <small>{new Date(a.start) <= endOfDay() ? "היום" : "מחר"}</small>
              </div>
              <div className="bar" style={{ background: a.kind === "event" ? "var(--green)" : a.kind === "meeting" ? "var(--violet)" : "var(--orange)" }} />
              <div>
                <b>{a.title}</b>
                <span>{a.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {stuck.length > 0 && (
        <div className="card">
          <h2>
            ⚠ נופלים בין הכיסאות <span className="tag s-lost">{stuck.length}</span>
            <span className="r muted" style={{ fontSize: 13, fontWeight: 500 }}>
              לידים פתוחים בלי פולואפ
            </span>
          </h2>
          {stuck.map(({ lead: l, reason, text }) => (
            <div key={l.id} className="ag stuck">
              <div className="tm" style={{ fontSize: 20 }}>{reason === "new_untouched" ? "🆕" : reason === "quote_silent" ? "📄" : "⏸"}</div>
              <div className="bar" style={{ background: reason === "no_followup" ? "var(--orange)" : "var(--red)" }} />
              <button className="stuck-body" onClick={() => router.push(`/leads/view?id=${l.id}`)}>
                <b>{l.name}</b>
                <span>
                  {text}
                  {nameOf(l.assigned_to) ? ` · ${nameOf(l.assigned_to)}` : " · לא משויך"}
                </span>
              </button>
              <button className="btn sm ml" onClick={() => setScheduling(l)}>
                📌 לקבוע פולואפ
              </button>
            </div>
          ))}
        </div>
      )}
      {scheduling && <FollowupModal lead={scheduling} onClose={() => setScheduling(null)} />}
      {todos.length > 0 && (
        <div className="card">
          <h2>
            📋 אירועים שדורשים טיפול
            <Link href="/events" className="r link">
              לכל האירועים ←
            </Link>
          </h2>
          {todos.map((t, i) => (
            <button key={t.kind + t.lead.id + i} className="ag" style={{ width: "100%", textAlign: "right" }} onClick={() => router.push(`/events/view?id=${t.lead.id}${t.kind === "couple_task" ? "#tasks" : ""}`)}>
              <div className="tm" style={{ fontSize: 20 }}>{t.kind === "review" ? "⭐" : t.kind === "payment" ? "💳" : t.kind === "couple_task" ? "📝" : "🗓️"}</div>
              <div className="bar" style={{ background: t.kind === "review" ? "var(--gold)" : t.kind === "payment" ? "var(--red)" : "var(--orange)" }} />
              <div>
                <b>{t.text}</b>
                <span>{t.sub}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      {adding && <LeadModal onClose={() => setAdding(false)} onSaved={(l) => router.push(`/leads/view?id=${l.id}`)} />}
    </>
  );
}

function FollowupRow({ l, owner, mine, onOpen }: { l: Lead; owner?: string; mine?: boolean; onOpen: () => void }) {
  const late = isOverdue(l.next_followup);
  return (
    <div className="fu">
      <button onClick={onOpen} className="row" style={{ textAlign: "right" }}>
        <Avatar text={initials(l.name)} s={l.status} late={late} />
        <div className="who">
          <b>{l.name}</b>
          <span>
            {l.event_type}
            {l.event_date ? " · " + shortDate(l.event_date) : l.guests ? ` · ${l.guests} איש` : ""}
          </span>
        </div>
      </button>
      <div className="why">
        {late && <span className="late">באיחור ({relDay(l.next_followup, false)}) · </span>}
        {l.followup_note || "לחזור ללקוח"}
        {l.pending_message && <span className="tag t-gold" style={{ marginRight: 6 }}>הודעה מוכנה</span>}
        <small>
          {!late && "פולואפ: " + relDay(l.next_followup) + " · "}
          קשר אחרון: {l.last_contact ? relDay(l.last_contact, false) : "עוד לא"}
        </small>
      </div>
      <div className="col-tags">
        <StatusTag s={l.status} />
        <Owner name={owner} mine={mine} />
      </div>
      <div className="acts">
        <a className="ib" href={`tel:${l.phone}`} title="שיחה">
          📞
        </a>
        <Link className="ib wa" href={`/leads/view?id=${l.id}#wa`} title="וואטסאפ">
          💬
        </Link>
      </div>
    </div>
  );
}
