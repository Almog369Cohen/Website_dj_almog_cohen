"use client";
import { useEffect, useRef, useState } from "react";
import "./tasklist.css";
import {
  STATUSES,
  TASK_CATEGORIES,
  TASK_LIMITS,
  categoryOf,
  newTask,
  ownerInitials,
  ownerLabel,
  progress,
  sortTasks,
  suggestions,
  whenText,
  type ClientTask,
  type TaskOwner,
} from "@/lib/tasks";

export type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * רשימת המשימות של הזוג. רכיב אחד לדף הלקוח ולכרטיס האירוע אצל הצוות.
 * כל שינוי עובר ב-onChange (רשימה מלאה + הצעות שנסגרו); השמירה עצמה אצל ההורה.
 */
export function TaskList(props: {
  tasks: ClientTask[];
  dismissed: string[];
  partners: { a: string; b: string };
  eventType: string;
  eventDate?: string;
  onChange(tasks: ClientTask[], dismissed: string[]): void;
  save?: SaveState;
  onRetry?(): void;
  readOnly?: boolean;
  variant?: "portal" | "staff";
}) {
  const { tasks, dismissed, partners, readOnly } = props;
  const [filter, setFilter] = useState<"all" | TaskOwner>("all");
  const [edit, setEdit] = useState<ClientTask | null>(null);
  const [isNew, setIsNew] = useState(false);
  const p = progress(tasks);
  const shown = (t: ClientTask) => filter === "all" || t.owner === filter || (filter !== "both" && t.owner === "both");
  const { before, after } = sortTasks(tasks.filter(shown));
  const openBefore = before.filter((t) => !t.done);
  const doneBefore = before.filter((t) => t.done);
  const sugg = readOnly ? [] : suggestions(props.eventType, tasks, dismissed);
  const maxOrder = () => tasks.reduce((m, t) => Math.max(m, t.order), -1) + 1;

  const change = (next: ClientTask[], d = dismissed) => !readOnly && props.onChange(next, d);
  const toggle = (t: ClientTask) => change(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
  const saveEdit = (t: ClientTask) => {
    const clean = { ...t, title: t.title.trim().slice(0, TASK_LIMITS.title), note: t.note?.trim() || undefined };
    if (!clean.title) return;
    change(isNew ? [...tasks, clean] : tasks.map((x) => (x.id === clean.id ? clean : x)));
    setEdit(null);
  };
  const reorder = (ids: string[]) => {
    const pos = new Map(ids.map((id, i) => [id, i]));
    change(tasks.map((t) => (pos.has(t.id) ? { ...t, order: pos.get(t.id)! } : t)));
  };

  return (
    <div className={"tk tk-" + (props.variant ?? "portal")}>
      <div className="tk-prog">
        <span>
          <b>{p.done}</b> מתוך {p.total} בוצעו
        </span>
        <span className="tk-save" aria-live="polite">
          {props.save === "saving" && "שומר…"}
          {props.save === "saved" && "נשמר ✓"}
          {props.save === "error" && (
            <button className="tk-err" onClick={props.onRetry}>
              לא נשמר · לנסות שוב
            </button>
          )}
          {(!props.save || props.save === "idle") && `${p.pct}%`}
        </span>
      </div>
      <div className="tk-bar">
        <span style={{ width: `${p.pct}%` }} />
      </div>

      {tasks.length > 0 && (
        <div className="tk-filters" role="tablist">
          {(
            [
              ["all", "הכל"],
              ["a", partners.a],
              ["b", partners.b],
              ["both", "שנינו"],
            ] as ["all" | TaskOwner, string][]
          ).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>
              {label}
            </button>
          ))}
        </div>
      )}

      {tasks.length === 0 && <div className="tk-empty">עוד אין משימות. מוסיפים את הראשונה, או בוחרים מההצעות למטה.</div>}

      <Sortable items={openBefore} disabled={readOnly || filter !== "all"} onReorder={reorder}>
        {(t, grip) => <Row key={t.id} t={t} partners={partners} grip={grip} onToggle={() => toggle(t)} onOpen={() => (setIsNew(false), setEdit(t))} readOnly={readOnly} />}
      </Sortable>

      {sugg.length > 0 && (
        <div className="tk-sugg">
          <div className="tk-sugg-h">💡 דברים שזוגות נוטים לשכוח</div>
          {sugg.map((s) => (
            <div key={s.key} className="tk-sug">
              <div>
                <b>{s.title}</b>
                <span>הצעה · {categoryOf(s.category).label}</span>
              </div>
              <button className="tk-plus" aria-label={`להוסיף: ${s.title}`} onClick={() => change([...tasks, s.make(props.eventDate, maxOrder())])}>
                +
              </button>
              <button className="tk-x" aria-label="לא רלוונטי" onClick={() => change(tasks, [...dismissed, s.key])}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {doneBefore.map((t) => (
        <Row key={t.id} t={t} partners={partners} onToggle={() => toggle(t)} onOpen={() => (setIsNew(false), setEdit(t))} readOnly={readOnly} />
      ))}

      {(after.length > 0 || !readOnly) && <div className="tk-divider">אחרי האירוע</div>}
      {after.map((t) => (
        <Row key={t.id} t={t} partners={partners} onToggle={() => toggle(t)} onOpen={() => (setIsNew(false), setEdit(t))} readOnly={readOnly} />
      ))}

      {!readOnly && (
        <button className="tk-add" onClick={() => (setIsNew(true), setEdit(newTask(maxOrder())))}>
          + משימה
        </button>
      )}

      {edit && (
        <Editor
          task={edit}
          isNew={isNew}
          partners={partners}
          onClose={() => setEdit(null)}
          onSave={saveEdit}
          onDelete={() => (change(tasks.filter((x) => x.id !== edit.id)), setEdit(null))}
        />
      )}
    </div>
  );
}

function Row({ t, partners, grip, onToggle, onOpen, readOnly }: { t: ClientTask; partners: { a: string; b: string }; grip?: React.ReactNode; onToggle(): void; onOpen(): void; readOnly?: boolean }) {
  const w = whenText(t);
  const st = STATUSES.find((s) => s.id === t.status)!;
  const c = categoryOf(t.category);
  return (
    <div className={"tk-task" + (t.done ? " done" : "")} data-id={t.id}>
      <button className="tk-chk" role="checkbox" aria-checked={t.done} aria-label={t.done ? `לבטל סימון: ${t.title}` : `סימון כבוצע: ${t.title}`} onClick={onToggle} disabled={readOnly}>
        {t.done ? "✓" : ""}
      </button>
      <button className="tk-body" onClick={onOpen} disabled={readOnly}>
        <span className="tk-title">{t.title}</span>
        {!t.done && (
          <span className="tk-meta">
            <span className={"tk-tag s-" + t.status}>{st.label}</span>
            <span className="tk-tag">
              {c.icon} {c.label}
            </span>
            {w.text && <span className={"tk-when" + (w.late ? " late" : "")}>{w.text}</span>}
          </span>
        )}
      </button>
      <span className={"tk-av o-" + t.owner} title={ownerLabel(t.owner, partners)}>
        {ownerInitials(t.owner, partners)}
      </span>
      {grip}
    </div>
  );
}

/** גרירה לשינוי סדר: מחזיקים את הידית (⋮⋮) וגוררים. עובד גם במגע. */
function Sortable({ items, disabled, onReorder, children }: { items: ClientTask[]; disabled?: boolean; onReorder(ids: string[]): void; children(t: ClientTask, grip?: React.ReactNode): React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ id: string; y0: number; dy: number } | null>(null);
  const [order, setOrder] = useState<string[] | null>(null);
  useEffect(() => setOrder(null), [items]);
  const ids = order ?? items.map((t) => t.id);

  const move = (e: React.PointerEvent) => {
    if (!drag || !box.current) return;
    const dy = e.clientY - drag.y0;
    setDrag({ ...drag, dy });
    const rows = [...box.current.querySelectorAll<HTMLElement>("[data-sort]")];
    const mid = e.clientY;
    const without = ids.filter((x) => x !== drag.id);
    let at = without.length;
    for (let i = 0; i < rows.length; i++) {
      const id = rows[i].dataset.sort!;
      if (id === drag.id) continue;
      const r = rows[i].getBoundingClientRect();
      if (mid < r.top + r.height / 2) {
        at = without.indexOf(id);
        break;
      }
    }
    const next = [...without.slice(0, at), drag.id, ...without.slice(at)];
    if (next.join() !== ids.join()) setOrder(next);
  };
  const end = () => {
    if (drag && order) onReorder(order);
    setDrag(null);
  };

  return (
    <div ref={box} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
      {ids.map((id) => {
        const t = items.find((x) => x.id === id);
        if (!t) return null;
        const grip = disabled ? undefined : (
          <span
            className="tk-grip"
            aria-label="גרירה לשינוי סדר"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture?.(e.pointerId);
              setDrag({ id, y0: e.clientY, dy: 0 });
            }}
            onPointerMove={move}
            onPointerUp={end}
          >
            ⋮⋮
          </span>
        );
        return (
          <div key={id} data-sort={id} className={drag?.id === id ? "tk-dragging" : ""}>
            {children(t, grip)}
          </div>
        );
      })}
    </div>
  );
}

function Editor({ task, isNew, partners, onClose, onSave, onDelete }: { task: ClientTask; isNew: boolean; partners: { a: string; b: string }; onClose(): void; onSave(t: ClientTask): void; onDelete(): void }) {
  const [t, setT] = useState(task);
  const set = (p: Partial<ClientTask>) => setT((x) => ({ ...x, ...p }));
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="tk-dim" onClick={onClose}>
      <form
        className="tk-sheet"
        role="dialog"
        aria-label={isNew ? "משימה חדשה" : "עריכת משימה"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSave(t);
        }}
      >
        <div className="tk-handle" />
        <input className="tk-in tk-in-title" autoFocus={isNew} required maxLength={TASK_LIMITS.title} value={t.title} placeholder="מה צריך לעשות?" onChange={(e) => set({ title: e.target.value })} />
        <div className="tk-f">
          <label>מי אחראי</label>
          <div className="tk-seg">
            {(["a", "b", "both", "none"] as TaskOwner[]).map((o) => (
              <button type="button" key={o} className={t.owner === o ? "on" : ""} onClick={() => set({ owner: o })}>
                {ownerLabel(o, partners)}
              </button>
            ))}
          </div>
        </div>
        <div className="tk-f">
          <label>סטטוס</label>
          <div className="tk-seg">
            {STATUSES.map((s) => (
              <button type="button" key={s.id} className={t.status === s.id ? "on" : ""} onClick={() => set({ status: s.id })}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="tk-row2">
          <div className="tk-f">
            <label>קטגוריה</label>
            <select className="tk-in" value={t.category} onChange={(e) => set({ category: e.target.value })}>
              {TASK_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="tk-f">
            <label>מתי להתחיל</label>
            <input className="tk-in" type="date" value={t.start ?? ""} onChange={(e) => set({ start: e.target.value || undefined })} />
          </div>
        </div>
        <div className="tk-f">
          <label>מתי</label>
          <div className="tk-seg">
            <button type="button" className={t.section !== "after" ? "on" : ""} onClick={() => set({ section: "before" })}>
              לפני האירוע
            </button>
            <button type="button" className={t.section === "after" ? "on" : ""} onClick={() => set({ section: "after" })}>
              אחרי האירוע
            </button>
          </div>
        </div>
        <div className="tk-f">
          <label>הערה</label>
          <textarea className="tk-in" maxLength={TASK_LIMITS.note} value={t.note ?? ""} placeholder="פרטים, טלפון, מה להביא…" onChange={(e) => set({ note: e.target.value })} />
        </div>
        <div className="tk-btns">
          {!isNew && (
            <button type="button" className="tk-del" onClick={() => confirm("למחוק את המשימה?") && onDelete()}>
              מחיקה
            </button>
          )}
          <button type="button" className="tk-cancel" onClick={onClose}>
            ביטול
          </button>
          <button type="submit" className="tk-ok">
            {isNew ? "הוספה" : "שמירה"}
          </button>
        </div>
      </form>
    </div>
  );
}
