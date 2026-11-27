"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { addDays, agendaItems, calendarCats, catOf, layoutDay, stepCursor, viewDays, weekStart, type AgendaItem, type CalView } from "@/lib/agenda";
import { DAYS, MONTHS, sameDay, time, ymd } from "@/lib/format";
import { CalendarModal } from "@/components/forms";
import { CategoriesModal } from "@/components/CalendarCats";

const VIEWS: { id: CalView; label: string }[] = [
  { id: "day", label: "יום" },
  { id: "week", label: "שבוע" },
  { id: "month", label: "חודש" },
];
const VIEW_KEY = "rever-cal-view";
const HOUR_PX = 48;

/** יומן: תצוגת יום, שבוע וחודש, עם צבע לכל קטגוריה. לחיצה על משבצת ריקה מוסיפה פריט באותו יום ושעה. */
export default function CalendarPage() {
  const { db, settings, can } = useStore();
  const router = useRouter();
  const now = new Date();
  const [view, setView] = useState<CalView>("month");
  const [cursor, setCursor] = useState(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const [modal, setModal] = useState<null | { date?: string; hour?: number; itemId?: string }>(null);
  const [catsOpen, setCatsOpen] = useState(false);
  const narrow = useNarrow();

  useEffect(() => {
    try {
      const v = localStorage.getItem(VIEW_KEY) as CalView | null;
      if (v && VIEWS.some((x) => x.id === v)) setView(v);
    } catch {}
  }, []);
  const pickView = (v: CalView) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {}
  };

  const cats = calendarCats(settings);
  const items = agendaItems(db);
  const days = viewDays(view, cursor);
  const byDay = (d: Date) => items.filter((a) => sameDay(new Date(a.start), d));
  const color = (a: AgendaItem) => "c-" + catOf(cats, a.cat, a.kind).color;
  const onItem = (e: React.MouseEvent, a: AgendaItem) => {
    e.stopPropagation();
    if (a.item_id) setModal({ itemId: a.item_id });
    else if (a.lead_id) router.push(a.kind === "event" ? `/events/view?id=${a.lead_id}` : `/leads/view?id=${a.lead_id}`);
  };
  const editing = modal?.itemId ? db.calendar_items.find((c) => c.id === modal.itemId) : undefined;
  const label = (a: AgendaItem) => a.title.replace(/^(פגישה|פולואפ): /, "");

  const title =
    view === "month"
      ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
      : view === "week"
        ? weekTitle(weekStart(cursor))
        : `יום ${DAYS[cursor.getDay()]}, ${cursor.getDate()} ב${MONTHS[cursor.getMonth()]}`;

  return (
    <>
      <div className="top cal-top">
        <div>
          <h1>{title}</h1>
          <div className="sub">פגישות, אירועים של לקוחות סגורים ופולואפים במקום אחד</div>
        </div>
        <div className="seg cal-views" role="tablist" aria-label="תצוגה">
          {VIEWS.map((v) => (
            <button key={v.id} role="tab" aria-selected={view === v.id} className={view === v.id ? "on" : ""} onClick={() => pickView(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn" onClick={() => setCursor(stepCursor(view, cursor, -1))} aria-label="הקודם">
            ›
          </button>
          <button className="btn" onClick={() => setCursor(new Date(now.getFullYear(), now.getMonth(), now.getDate()))}>
            היום
          </button>
          <button className="btn" onClick={() => setCursor(stepCursor(view, cursor, 1))} aria-label="הבא">
            ‹
          </button>
        </div>
        <button className="btn pri" onClick={() => setModal({ date: ymd(view === "month" ? now : cursor) })}>
          + הוספה
        </button>
      </div>

      <div className="legend cal-legend">
        {cats.map((c) => (
          <span key={c.id}>
            <i className={"c-" + c.color} />
            {c.label}
          </span>
        ))}
        {can("settings") && (
          <button className="link" onClick={() => setCatsOpen(true)}>
            🎨 עריכת קטגוריות
          </button>
        )}
      </div>

      {view === "month" && (
        <div className="cal">
          {DAYS.map((d) => (
            <div key={d} className="h">
              {narrow ? d[0] : d}
            </div>
          ))}
          {days.map((d) => {
            const list = byDay(d);
            const out = d.getMonth() !== cursor.getMonth();
            return (
              <div key={ymd(d)} className={"d" + (out ? " out" : "") + (sameDay(d, now) ? " today" : "")} onClick={() => setModal({ date: ymd(d) })}>
                <button
                  className="num"
                  onClick={(e) => (e.stopPropagation(), setCursor(d), pickView("day"))}
                  aria-label={`תצוגת יום: ${d.getDate()}`}
                >
                  {d.getDate()}
                </button>
                {list.slice(0, 4).map((a) => (
                  <button key={a.key} className={"ev " + color(a)} onClick={(e) => onItem(e, a)} title={a.title}>
                    {a.allDay ? "" : time(a.start) + " "}
                    {label(a)}
                  </button>
                ))}
                {list.length > 4 && <span className="muted" style={{ fontSize: 12 }}>+{list.length - 4} נוספים</span>}
              </div>
            );
          })}
        </div>
      )}

      {view === "week" && narrow && (
        // בטלפון: שבוע כרשימה לפי ימים (7 עמודות צרות מדי)
        <div className="cal-list">
          {days.map((d) => {
            const list = byDay(d);
            return (
              <div key={ymd(d)} className={"cal-lday" + (sameDay(d, now) ? " today" : "")}>
                <button className="cal-lhead" onClick={() => (setCursor(d), pickView("day"))}>
                  <b>{DAYS[d.getDay()]}</b> <span>{d.getDate()}.{d.getMonth() + 1}</span>
                </button>
                {list.map((a) => (
                  <button key={a.key} className={"ev big " + color(a)} onClick={(e) => onItem(e, a)}>
                    <span className="t">{a.allDay ? "כל היום" : time(a.start)}</span> {label(a)}
                  </button>
                ))}
                <button className="cal-ladd" onClick={() => setModal({ date: ymd(d) })} aria-label={`הוספה ליום ${DAYS[d.getDay()]}`}>
                  +
                </button>
              </div>
            );
          })}
        </div>
      )}

      {(view === "day" || (view === "week" && !narrow)) && (
        <TimeGrid days={days} items={items} now={now} color={color} label={label} onItem={onItem} onSlot={(d, h) => setModal({ date: ymd(d), hour: h })} onDay={(d) => (setCursor(d), pickView("day"))} />
      )}

      {modal && <CalendarModal item={editing} date={modal.date} hour={modal.hour} onClose={() => setModal(null)} />}
      {catsOpen && <CategoriesModal onClose={() => setCatsOpen(false)} />}
    </>
  );
}

/** תצוגת שעות (יום או שבוע): שורת "כל היום" למעלה, ופריטים חופפים זה לצד זה */
function TimeGrid(p: {
  days: Date[];
  items: AgendaItem[];
  now: Date;
  color(a: AgendaItem): string;
  label(a: AgendaItem): string;
  onItem(e: React.MouseEvent, a: AgendaItem): void;
  onSlot(d: Date, hour: number): void;
  onDay(d: Date): void;
}) {
  const inDays = p.items.filter((a) => p.days.some((d) => sameDay(new Date(a.start), d)));
  const timed = inDays.filter((a) => !a.allDay);
  const earliest = Math.min(8, ...timed.map((a) => new Date(a.start).getHours()));
  const from = Math.max(0, earliest);
  const hours = Array.from({ length: 24 - from }, (_, i) => from + i);
  const cols = `52px repeat(${p.days.length}, minmax(0, 1fr))`;
  const single = p.days.length === 1;
  // גוללים ישר לפריט הראשון (או לשעה הנוכחית אם היום מוצג), כדי שלא יצטרכו לחפש
  const body = useRef<HTMLDivElement>(null);
  const showsToday = p.days.some((d) => sameDay(d, p.now));
  const firstMin = timed.length ? Math.min(...timed.map((a) => new Date(a.start).getHours() * 60 + new Date(a.start).getMinutes())) : null;
  const target = showsToday ? Math.min(firstMin ?? 1e9, p.now.getHours() * 60) : (firstMin ?? from * 60);
  const dayKey = p.days.map(ymd).join();
  useEffect(() => {
    if (body.current) body.current.scrollTop = Math.max(0, ((target - from * 60) / 60 - 0.5) * HOUR_PX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayKey]);

  return (
    <div className={"tg" + (single ? " single" : "")}>
      <div className="tg-head" style={{ gridTemplateColumns: cols }}>
        <div />
        {p.days.map((d) => (
          <button key={ymd(d)} className={"tg-day" + (sameDay(d, p.now) ? " today" : "")} onClick={() => p.onDay(d)} disabled={single}>
            <small>{DAYS[d.getDay()]}</small>
            <b>{d.getDate()}</b>
          </button>
        ))}
      </div>
      <div className="tg-all" style={{ gridTemplateColumns: cols }}>
        <div className="tg-lbl">כל היום</div>
        {p.days.map((d) => (
          <div key={ymd(d)} className="tg-allcell">
            {inDays
              .filter((a) => a.allDay && sameDay(new Date(a.start), d))
              .map((a) => (
                <button key={a.key} className={"ev " + p.color(a)} onClick={(e) => p.onItem(e, a)} title={a.title}>
                  {p.label(a)}
                </button>
              ))}
          </div>
        ))}
      </div>
      <div className="tg-body" ref={body} style={{ gridTemplateColumns: cols }}>
        <div className="tg-hours">
          {hours.map((h) => (
            <div key={h} style={{ height: HOUR_PX }}>
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>
        {p.days.map((d) => {
          const placed = layoutDay(timed.filter((a) => sameDay(new Date(a.start), d)), d);
          const nowMin = sameDay(d, p.now) ? p.now.getHours() * 60 + p.now.getMinutes() : -1;
          return (
            <div key={ymd(d)} className="tg-col" style={{ height: hours.length * HOUR_PX }}>
              {hours.map((h) => (
                <button key={h} className="tg-slot" style={{ height: HOUR_PX }} onClick={() => p.onSlot(d, h)} aria-label={`הוספה ב-${h}:00`} />
              ))}
              {nowMin >= from * 60 && <div className="tg-now" style={{ top: ((nowMin - from * 60) / 60) * HOUR_PX }} />}
              {placed.map(({ it, top, bottom, col, cols: n }) => (
                <button
                  key={it.key}
                  className={"tg-ev " + p.color(it)}
                  style={{ top: ((top - from * 60) / 60) * HOUR_PX, height: Math.max(22, ((bottom - top) / 60) * HOUR_PX - 2), insetInlineStart: `calc(${(col / n) * 100}% + 2px)`, width: `calc(${100 / n}% - 4px)` }}
                  onClick={(e) => p.onItem(e, it)}
                  title={it.title}
                >
                  <b>{time(it.start)}</b> {p.label(it)}
                  {single && it.sub && <small>{it.sub}</small>}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function weekTitle(start: Date) {
  const end = addDays(start, 6);
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()}–${end.getDate()} ב${MONTHS[start.getMonth()]}`
    : `${start.getDate()} ב${MONTHS[start.getMonth()]} – ${end.getDate()} ב${MONTHS[end.getMonth()]}`;
}

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 720px)");
    const f = () => setNarrow(m.matches);
    f();
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return narrow;
}
