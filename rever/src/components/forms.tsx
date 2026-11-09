"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Field, Modal } from "./ui";
import type { CalendarItem, CalendarKind, Doc, DocStatus, DocType, Expense, Lead, Payment, PaymentKind } from "@/lib/types";
import { DOC_STATUS, DOC_TYPES, EVENT_TYPES, EXPENSE_CATEGORIES, PAYMENT_KINDS, PAYMENT_METHODS, SOURCES, STATUSES } from "@/lib/types";
import { fromLocalInput, nis, toLocalInput, todayYmd, uid } from "@/lib/format";

const num = (v: string) => (v === "" ? undefined : Number(v));

/* ---------------- ליד ---------------- */
export function LeadModal({ lead, onClose, onSaved }: { lead?: Lead; onClose: () => void; onSaved?: (l: Lead) => void }) {
  const { db, save, log, can, me } = useStore();
  const [f, setF] = useState<Lead>(
    lead ?? {
      id: uid(),
      name: "",
      phone: "",
      event_type: "חתונה",
      source: "פייסבוק",
      status: "new",
      created_at: new Date().toISOString(),
      next_followup: new Date().toISOString(),
      followup_note: "לשלוח הודעת היכרות",
      assigned_to: me?.role === "team" ? me.id : undefined,
    },
  );
  const set = (p: Partial<Lead>) => setF((x) => ({ ...x, ...p }));
  return (
    <Modal title={lead ? "עריכת ליד" : "ליד חדש"} onClose={onClose}>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await save("leads", f);
          if (!lead) await log(f.id, "created", `ליד חדש נוסף (${f.source})`);
          onSaved?.(f);
          onClose();
        }}
      >
        <Field label="שם *" full>
          <input required value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="למשל: דנה ויובל" />
        </Field>
        <Field label="טלפון *">
          <input required value={f.phone} onChange={(e) => set({ phone: e.target.value })} dir="ltr" inputMode="tel" />
        </Field>
        <Field label="אימייל">
          <input type="email" value={f.email ?? ""} onChange={(e) => set({ email: e.target.value || undefined })} dir="ltr" />
        </Field>
        <Field label="סוג אירוע">
          <select value={f.event_type} onChange={(e) => set({ event_type: e.target.value })}>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="תאריך אירוע">
          <input type="date" value={f.event_date ?? ""} onChange={(e) => set({ event_date: e.target.value || undefined })} />
        </Field>
        <Field label="מספר מוזמנים">
          <input type="number" min={0} value={f.guests ?? ""} onChange={(e) => set({ guests: num(e.target.value) })} />
        </Field>
        <Field label="מקום">
          <input value={f.venue ?? ""} onChange={(e) => set({ venue: e.target.value || undefined })} />
        </Field>
        <Field label="הגיעו דרך">
          <select value={f.source} onChange={(e) => set({ source: e.target.value })}>
            {SOURCES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="מי מטפל">
          <select value={f.assigned_to ?? ""} onChange={(e) => set({ assigned_to: e.target.value || undefined })}>
            <option value="">— לא משויך</option>
            {db.members
              .filter((m) => m.active)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
          </select>
        </Field>
        <Field label="סטטוס">
          <select value={f.status} onChange={(e) => set({ status: e.target.value as Lead["status"] })}>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        {can("prices") && (
          <Field label="מחיר (₪)">
            <input type="number" min={0} value={f.price ?? ""} onChange={(e) => set({ price: num(e.target.value) })} />
          </Field>
        )}
        <Field label="פולואפ הבא">
          <input type="datetime-local" value={toLocalInput(f.next_followup)} onChange={(e) => set({ next_followup: fromLocalInput(e.target.value) })} />
        </Field>
        <Field label="מה לעשות בפולואפ" full>
          <input value={f.followup_note ?? ""} onChange={(e) => set({ followup_note: e.target.value || undefined })} />
        </Field>
        <Field label="הערות" full>
          <textarea value={f.notes ?? ""} onChange={(e) => set({ notes: e.target.value || undefined })} />
        </Field>
        <div className="mfoot full">
          <button className="btn pri">שמירה</button>
          <button type="button" className="btn" onClick={onClose}>
            ביטול
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------------- פולואפ ---------------- */
export function FollowupModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const { updateLead } = useStore();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const [when, setWhen] = useState(toLocalInput(lead.next_followup ?? tomorrow.toISOString()));
  const [note, setNote] = useState(lead.followup_note ?? "");
  const quick = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(10, 0, 0, 0);
    setWhen(toLocalInput(d.toISOString()));
  };
  return (
    <Modal title={`פולואפ: ${lead.name}`} onClose={onClose}>
      <div className="row" style={{ flexWrap: "wrap" }}>
        {[
          ["מחר", 1],
          ["בעוד יומיים", 2],
          ["בעוד 3 ימים", 3],
          ["בעוד שבוע", 7],
        ].map(([l, d]) => (
          <button key={l} type="button" className="btn sm" onClick={() => quick(d as number)}>
            {l}
          </button>
        ))}
      </div>
      <Field label="מתי">
        <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
      </Field>
      <Field label="מה לעשות">
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="למשל: לבדוק אם ראו את ההצעה" />
      </Field>
      <div className="mfoot">
        <button
          className="btn pri"
          onClick={async () => {
            await updateLead(lead, { next_followup: fromLocalInput(when), followup_note: note || undefined });
            onClose();
          }}
        >
          שמירה
        </button>
        <button
          className="btn"
          onClick={async () => {
            await updateLead(lead, { next_followup: undefined, followup_note: undefined, pending_message: undefined });
            onClose();
          }}
        >
          ללא פולואפ
        </button>
      </div>
    </Modal>
  );
}

/* ---------------- פריט ביומן ---------------- */
export function CalendarModal({
  item,
  date,
  leadId,
  defaultKind = "meeting",
  onClose,
}: {
  item?: CalendarItem;
  date?: string;
  leadId?: string;
  defaultKind?: CalendarKind;
  onClose: () => void;
}) {
  const { db, save, remove, lead, log, setStatus, can } = useStore();
  const start0 = date ? new Date(date + "T18:00:00").toISOString() : new Date().toISOString();
  const l0 = lead(leadId);
  const [f, setF] = useState<CalendarItem>(
    item ?? { id: uid(), kind: defaultKind, title: l0 ? `פגישה: ${l0.name}` : "", start: start0, lead_id: leadId },
  );
  const set = (p: Partial<CalendarItem>) => setF((x) => ({ ...x, ...p }));
  return (
    <Modal title={item ? "עריכת פריט ביומן" : "הוספה ליומן"} onClose={onClose}>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await save("calendar_items", f);
          const l = lead(f.lead_id);
          if (!item && l && f.kind === "meeting") {
            await log(l.id, "meeting", `נקבעה פגישה${f.location ? " (" + f.location + ")" : ""}`);
            if (["new", "talk"].includes(l.status)) await setStatus(l, "meeting");
          }
          onClose();
        }}
      >
        <Field label="סוג">
          <select value={f.kind} onChange={(e) => set({ kind: e.target.value as CalendarKind })}>
            <option value="meeting">פגישה</option>
            <option value="event">אירוע</option>
            <option value="followup">תזכורת / פולואפ</option>
          </select>
        </Field>
        <Field label="מתי">
          <input type="datetime-local" required value={toLocalInput(f.start)} onChange={(e) => set({ start: fromLocalInput(e.target.value)! })} />
        </Field>
        <Field label="כותרת *" full>
          <input required value={f.title} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="מקום / זום">
          <input value={f.location ?? ""} onChange={(e) => set({ location: e.target.value || undefined })} />
        </Field>
        <Field label="ליד קשור">
          <select value={f.lead_id ?? ""} onChange={(e) => set({ lead_id: e.target.value || undefined })}>
            <option value="">—</option>
            {db.leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="mfoot full">
          <button className="btn pri">שמירה</button>
          {item && can("delete") && (
            <button
              type="button"
              className="btn danger"
              onClick={async () => {
                await remove("calendar_items", item.id);
                onClose();
              }}
            >
              מחיקה
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

/* ---------------- תשלום ---------------- */
export function PaymentModal({ leadId, payment, onClose }: { leadId?: string; payment?: Payment; onClose: () => void }) {
  const { db, save, remove, log, lead, can } = useStore();
  const won = db.leads.filter((l) => l.status === "won" || l.id === leadId);
  const [f, setF] = useState<Payment>(
    payment ?? { id: uid(), lead_id: leadId ?? won[0]?.id ?? "", kind: "payment", amount: 0, date: todayYmd(), method: PAYMENT_METHODS[0] },
  );
  const set = (p: Partial<Payment>) => setF((x) => ({ ...x, ...p }));
  return (
    <Modal title={payment ? "עריכת תשלום" : "רישום תשלום"} onClose={onClose}>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await save("payments", f);
          if (!payment) await log(f.lead_id, "payment", `התקבל${f.kind === "deposit" ? "ה מקדמה" : " תשלום"} ${nis(f.amount)} (${f.method})`);
          onClose();
        }}
      >
        <Field label="לקוח *" full>
          <select required value={f.lead_id} onChange={(e) => set({ lead_id: e.target.value })}>
            <option value="">—</option>
            {won.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="סוג">
          <select value={f.kind} onChange={(e) => set({ kind: e.target.value as PaymentKind })}>
            {Object.entries(PAYMENT_KINDS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="סכום (₪) *">
          <input type="number" required min={1} value={f.amount || ""} onChange={(e) => set({ amount: Number(e.target.value) })} />
        </Field>
        <Field label="תאריך">
          <input type="date" required value={f.date} onChange={(e) => set({ date: e.target.value })} />
        </Field>
        <Field label="אמצעי תשלום">
          <select value={f.method} onChange={(e) => set({ method: e.target.value })}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="הערה" full>
          <input value={f.note ?? ""} onChange={(e) => set({ note: e.target.value || undefined })} />
        </Field>
        {lead(f.lead_id)?.price && (
          <div className="full muted" style={{ fontSize: 14 }}>
            מחיר העסקה: {nis(lead(f.lead_id)!.price)}
          </div>
        )}
        <div className="mfoot full">
          <button className="btn pri">שמירה</button>
          {payment && can("delete") && (
            <button type="button" className="btn danger" onClick={async () => (await remove("payments", payment.id), onClose())}>
              מחיקה
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

/* ---------------- הוצאה ---------------- */
export function ExpenseModal({ expense, onClose }: { expense?: Expense; onClose: () => void }) {
  const { db, save, remove, can } = useStore();
  const [f, setF] = useState<Expense>(expense ?? { id: uid(), date: todayYmd(), amount: 0, category: EXPENSE_CATEGORIES[0], supplier: "" });
  const set = (p: Partial<Expense>) => setF((x) => ({ ...x, ...p }));
  return (
    <Modal title={expense ? "עריכת הוצאה" : "הוצאה חדשה"} onClose={onClose}>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await save("expenses", f);
          onClose();
        }}
      >
        <Field label="ספק / למי *" full>
          <input required value={f.supplier} onChange={(e) => set({ supplier: e.target.value })} />
        </Field>
        <Field label="סכום (₪) *">
          <input type="number" required min={1} value={f.amount || ""} onChange={(e) => set({ amount: Number(e.target.value) })} />
        </Field>
        <Field label="תאריך">
          <input type="date" required value={f.date} onChange={(e) => set({ date: e.target.value })} />
        </Field>
        <Field label="קטגוריה">
          <select value={f.category} onChange={(e) => set({ category: e.target.value })}>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="שייך לאירוע">
          <select value={f.lead_id ?? ""} onChange={(e) => set({ lead_id: e.target.value || undefined })}>
            <option value="">— כללי</option>
            {db.leads
              .filter((l) => l.status === "won")
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>
        </Field>
        <Field label="הערה" full>
          <input value={f.note ?? ""} onChange={(e) => set({ note: e.target.value || undefined })} />
        </Field>
        <div className="mfoot full">
          <button className="btn pri">שמירה</button>
          {expense && can("delete") && (
            <button type="button" className="btn danger" onClick={async () => (await remove("expenses", expense.id), onClose())}>
              מחיקה
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

/* ---------------- מסמך (הצעת מחיר / חשבונית) ---------------- */
export function DocModal({ doc, leadId, onClose }: { doc?: Doc; leadId?: string; onClose: () => void }) {
  const { db, save, remove, log, lead, setStatus, can } = useStore();
  const nextNo = (t: DocType) => {
    const prefix = t === "quote" ? "Q-" : t === "invoice" ? "INV-" : "R-";
    const nums = db.docs.filter((d) => d.type === t).map((d) => parseInt(d.number.replace(/\D/g, "")) || 0);
    return prefix + (Math.max(t === "quote" ? 1000 : t === "invoice" ? 2200 : 3100, ...nums) + 1);
  };
  const l0 = lead(leadId);
  const [f, setF] = useState<Doc>(
    doc ?? { id: uid(), lead_id: leadId ?? "", type: "quote", number: nextNo("quote"), amount: l0?.price ?? 0, date: todayYmd(), status: "draft" },
  );
  const set = (p: Partial<Doc>) => setF((x) => ({ ...x, ...p }));
  return (
    <Modal title={doc ? "עריכת מסמך" : "מסמך חדש"} onClose={onClose}>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await save("docs", f);
          const l = lead(f.lead_id);
          if (!doc && l) {
            await log(l.id, "note", `${DOC_TYPES[f.type]} ${f.number}: ${nis(f.amount)}`);
            if (f.type === "quote" && f.status === "sent" && ["new", "talk", "meeting"].includes(l.status)) await setStatus(l, "quote");
          }
          onClose();
        }}
      >
        <Field label="סוג">
          <select value={f.type} onChange={(e) => set({ type: e.target.value as DocType, number: doc ? f.number : nextNo(e.target.value as DocType) })}>
            {Object.entries(DOC_TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="מספר">
          <input value={f.number} onChange={(e) => set({ number: e.target.value })} dir="ltr" />
        </Field>
        <Field label="לקוח *" full>
          <select required value={f.lead_id} onChange={(e) => set({ lead_id: e.target.value, amount: f.amount || lead(e.target.value)?.price || 0 })}>
            <option value="">—</option>
            {db.leads
              .filter((l) => l.status !== "lost")
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>
        </Field>
        <Field label="סכום (₪) *">
          <input type="number" required min={1} value={f.amount || ""} onChange={(e) => set({ amount: Number(e.target.value) })} />
        </Field>
        <Field label="תאריך">
          <input type="date" required value={f.date} onChange={(e) => set({ date: e.target.value })} />
        </Field>
        <Field label="סטטוס" full>
          <select value={f.status} onChange={(e) => set({ status: e.target.value as DocStatus })}>
            {Object.entries(DOC_STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <div className="full muted" style={{ fontSize: 13.5 }}>
          המסמך נרשם כאן למעקב. הפקת חשבונית רשמית נעשית במורנינג / iCount (חיבור ישיר – בשלב הבא).
        </div>
        <div className="mfoot full">
          <button className="btn pri">שמירה</button>
          {doc && can("delete") && (
            <button type="button" className="btn danger" onClick={async () => (await remove("docs", doc.id), onClose())}>
              מחיקה
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
