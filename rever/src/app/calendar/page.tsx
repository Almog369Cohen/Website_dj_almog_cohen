"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { agendaItems, type AgendaItem } from "@/lib/agenda";
import { DAYS, MONTHS, sameDay, time, ymd } from "@/lib/format";
import { CalendarModal } from "@/components/forms";

export default function CalendarPage() {
  const { db } = useStore();
  const router = useRouter();
  const now = new Date();
  const [cursor, setCursor] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [modal, setModal] = useState<null | { date?: string; itemId?: string }>(null);

  const items = agendaItems(db);
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = new Date(first);
  gridStart.setDate(1 - first.getDay());
  const lastOfMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const weeks = Math.ceil((first.getDay() + lastOfMonth.getDate()) / 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
  const byDay = (d: Date) => items.filter((a) => sameDay(new Date(a.start), d));

  const move = (n: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));
  const onItem = (e: React.MouseEvent, a: AgendaItem) => {
    e.stopPropagation();
    if (a.item_id) setModal({ itemId: a.item_id });
    else if (a.lead_id) router.push(a.kind === "event" ? `/events/view?id=${a.lead_id}` : `/leads/view?id=${a.lead_id}`);
  };
  const editing = modal?.itemId ? db.calendar_items.find((c) => c.id === modal.itemId) : undefined;

  return (
    <>
      <div className="top">
        <div>
          <h1>
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </h1>
          <div className="sub">פגישות, אירועים של לקוחות סגורים ופולואפים במקום אחד</div>
        </div>
        <div className="legend ml">
          <span>
            <i style={{ background: "var(--green)" }} />
            אירוע
          </span>
          <span>
            <i style={{ background: "var(--violet)" }} />
            פגישה
          </span>
          <span>
            <i style={{ background: "var(--orange)" }} />
            פולואפ
          </span>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn" onClick={() => move(-1)} aria-label="חודש קודם">
            ›
          </button>
          <button className="btn" onClick={() => setCursor(new Date(now.getFullYear(), now.getMonth(), 1))}>
            היום
          </button>
          <button className="btn" onClick={() => move(1)} aria-label="חודש הבא">
            ‹
          </button>
        </div>
        <button className="btn pri" onClick={() => setModal({ date: ymd(now) })}>
          + הוספה
        </button>
      </div>
      <div className="cal">
        {DAYS.map((d) => (
          <div key={d} className="h">
            {d}
          </div>
        ))}
        {days.map((d) => {
          const list = byDay(d);
          const out = d.getMonth() !== cursor.getMonth();
          return (
            <div key={ymd(d)} className={"d" + (out ? " out" : "") + (sameDay(d, now) ? " today" : "")} onClick={() => setModal({ date: ymd(d) })}>
              <span className="num">{d.getDate()}</span>
              {list.slice(0, 4).map((a) => (
                <button key={a.key} className={"ev " + a.kind} onClick={(e) => onItem(e, a)} title={a.title}>
                  {a.allDay ? "" : time(a.start) + " "}
                  {a.title.replace(/^(פגישה|פולואפ): /, "")}
                </button>
              ))}
              {list.length > 4 && <span className="muted" style={{ fontSize: 12 }}>+{list.length - 4} נוספים</span>}
            </div>
          );
        })}
      </div>
      {modal && <CalendarModal item={editing} date={modal.date} onClose={() => setModal(null)} />}
    </>
  );
}
