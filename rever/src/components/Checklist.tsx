"use client";
import { useEffect, useRef, useState } from "react";
import type { EventPlan } from "@/lib/types";
import { checkItems, checkLate, checkOps, readiness, todayISO, CHECK_LIMITS, type CheckItem, type CheckSection, type PlanView } from "@/lib/events";
import { shortDate } from "@/lib/format";

const SECTIONS: { id: CheckSection; title: string }[] = [
  { id: "before", title: "לפני האירוע" },
  { id: "after", title: "אחרי האירוע" },
];

/**
 * צ'קליסט הכנה שאפשר לערוך: בוצע/לא בוצע, תאריך יעד, הערה, גרירה לשינוי סדר, חלוקה ל"לפני" ו"אחרי".
 * לחיצה על שם הפריט פותחת עריכה. פריטים קבועים אפשר לשנות אבל לא למחוק.
 */
export function Checklist({ v, fresh, savePlan }: { v: PlanView; fresh: () => PlanView; savePlan: (p: Partial<EventPlan>) => void }) {
  const items = checkItems(v);
  const r = readiness(v);
  const today = todayISO();
  const [open, setOpen] = useState<string | null>(null);
  // כל פעולה נבנית מהגרסה האחרונה (fresh), לא מהתצוגה, כדי ששתי עריכות רצופות לא ידרסו זו את זו
  const toggle = (id: string) => {
    const c = fresh().checklist;
    savePlan({ checklist: JSON.stringify({ ...c, [id]: !c[id] }) });
  };

  return (
    <div className="card">
      <h2>
        ✅ צ'קליסט הכנה
        <span className="r muted" style={{ fontSize: 14, fontWeight: 500 }}>
          {r.done}/{r.total}
        </span>
      </h2>
      {SECTIONS.map((s) => {
        const list = items.filter((i) => i.section === s.id);
        return (
          <div key={s.id} className="ck-sec">
            <div className="ck-title">
              {s.title} <span className="muted">· {list.filter((i) => i.done).length}/{list.length}</span>
            </div>
            <Sortable ids={list.map((i) => i.id)} onReorder={(ids) => savePlan(checkOps.reorder(fresh(), s.id, ids))}>
              {(id, grip) => {
                const it = list.find((i) => i.id === id)!;
                return (
                  <Row
                    it={it}
                    late={checkLate(it, today)}
                    grip={grip}
                    open={open === id}
                    onOpen={() => setOpen(open === id ? null : id)}
                    onToggle={() => toggle(id)}
                    onChange={(patch) => savePlan(checkOps.update(fresh(), id, patch))}
                    onMove={() => (savePlan(checkOps.move(fresh(), id, it.section === "before" ? "after" : "before")), setOpen(null))}
                    onRemove={() => confirm(`למחוק את "${it.label}"?`) && (savePlan(checkOps.remove(fresh(), id)), setOpen(null))}
                  />
                );
              }}
            </Sortable>
            {!list.length && <div className="muted ck-empty">אין פריטים</div>}
            <AddLine placeholder={`+ פריט ${s.id === "before" ? "לפני" : "אחרי"} האירוע`} onAdd={(x) => savePlan(checkOps.add(fresh(), x, s.id))} />
          </div>
        );
      })}
    </div>
  );
}

function Row(p: {
  it: CheckItem;
  late: boolean;
  grip: React.ReactNode;
  open: boolean;
  onOpen(): void;
  onToggle(): void;
  onChange(patch: { label?: string; due?: string; note?: string }): void;
  onMove(): void;
  onRemove(): void;
}) {
  const { it } = p;
  return (
    <div className={"ck-row" + (it.done ? " done" : "") + (p.open ? " open" : "")}>
      <div className="ck-line">
        <input type="checkbox" checked={it.done} onChange={p.onToggle} aria-label={it.label} />
        <button className="ck-label" onClick={p.onOpen} aria-expanded={p.open}>
          <span>{it.label}</span>
          {it.note && <span className="ck-note" title={it.note}>📝</span>}
        </button>
        {it.due && <span className={"ck-due" + (p.late ? " late" : "")}>{p.late ? "⏰ " : ""}{shortDate(it.due)}</span>}
        {p.grip}
      </div>
      {p.open && (
        <div className="ck-edit">
          <label>
            שם
            <input defaultValue={it.label} maxLength={CHECK_LIMITS.label} onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== it.label && p.onChange({ label: e.target.value })} />
          </label>
          <label>
            תאריך יעד
            <input type="date" dir="ltr" defaultValue={it.due ?? ""} onChange={(e) => p.onChange({ due: e.target.value || undefined })} />
          </label>
          <label className="wide">
            הערות
            <textarea defaultValue={it.note ?? ""} maxLength={CHECK_LIMITS.note} rows={2} placeholder="למשל: לבקש מהאולם את מספר הספק" onBlur={(e) => e.target.value !== (it.note ?? "") && p.onChange({ note: e.target.value })} />
          </label>
          <div className="ck-actions wide">
            <button className="btn sm" onClick={p.onMove}>
              {it.section === "before" ? "↓ להעביר ל'אחרי האירוע'" : "↑ להעביר ל'לפני האירוע'"}
            </button>
            {it.builtin ? (
              <span className="muted" style={{ fontSize: 12.5 }}>פריט קבוע (אפשר לשנות, לא למחוק)</span>
            ) : (
              <button className="btn sm danger" onClick={p.onRemove}>
                מחיקה
              </button>
            )}
            <button className="btn sm ml" onClick={p.onOpen}>
              סגירה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** גרירה לשינוי סדר: מחזיקים את הידית (⋮⋮) וגוררים. עובד גם במגע. */
function Sortable({ ids: items, onReorder, children }: { ids: string[]; onReorder(ids: string[]): void; children(id: string, grip: React.ReactNode): React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const [order, setOrder] = useState<string[] | null>(null);
  const key = items.join();
  useEffect(() => setOrder(null), [key]);
  const ids = order ?? items;
  const ended = useRef(false);

  const move = (e: React.PointerEvent) => {
    if (!drag || !box.current) return;
    const rows = [...box.current.querySelectorAll<HTMLElement>("[data-sort]")];
    const without = ids.filter((x) => x !== drag);
    let at = without.length;
    for (const row of rows) {
      const id = row.dataset.sort!;
      if (id === drag) continue;
      const r = row.getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) {
        at = without.indexOf(id);
        break;
      }
    }
    const next = [...without.slice(0, at), drag, ...without.slice(at)];
    if (next.join() !== ids.join()) setOrder(next);
  };
  const end = () => {
    if (!drag || ended.current) return;
    ended.current = true;
    if (order && order.join() !== key) onReorder(order);
    setDrag(null);
  };

  return (
    <div ref={box} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
      {ids.map((id) => {
        if (!items.includes(id)) return null;
        const grip = (
          <span
            className="ck-grip"
            role="button"
            aria-label="גרירה לשינוי סדר"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture?.(e.pointerId);
              ended.current = false;
              setDrag(id);
            }}
          >
            ⋮⋮
          </span>
        );
        return (
          <div key={id} data-sort={id} className={drag === id ? "ck-dragging" : ""}>
            {children(id, grip)}
          </div>
        );
      })}
    </div>
  );
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
      <input className="search" style={{ minWidth: 0, flex: 1, height: 38 }} placeholder={placeholder} maxLength={CHECK_LIMITS.label} value={x} onChange={(e) => setX(e.target.value)} />
    </form>
  );
}
