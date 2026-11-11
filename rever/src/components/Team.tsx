"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { PERMS } from "@/lib/types";
import type { Member, Role } from "@/lib/types";
import { initials, uid } from "@/lib/format";
import { Field, Modal } from "./ui";

const FLAG = { prices: "can_prices", finance: "can_finance", delete: "can_delete", templates: "can_templates", portal: "can_portal" } as const;

async function setPinOnServer(staffId: string, pin: string) {
  const r = await fetch("/api/staff/pin", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ staff_id: staffId, pin }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "שמירת הקוד נכשלה");
}

export default function Team() {
  const { db, save, remove, me, toast, mode, reload, setPin } = useStore();
  const pinOnServer = (id: string, pin: string) => (setPin ? setPin(id, pin) : setPinOnServer(id, pin));
  const [adding, setAdding] = useState(false);
  const [pinFor, setPinFor] = useState<Member | null>(null);
  const admins = db.members.filter((m) => m.role === "admin" && m.active);
  const list = [...db.members].sort((a, b) => (a.role === b.role ? 0 : a.role === "admin" ? -1 : 1));

  const update = async (m: Member, patch: Partial<Member>) => {
    const next = { ...m, ...patch };
    if (m.id === me?.id && (next.role !== "admin" || !next.active)) return toast("אי אפשר להוריד לעצמך הרשאת מאסטר");
    if (m.role === "admin" && (next.role !== "admin" || !next.active) && admins.length <= 1) return toast("חייב להישאר לפחות מאסטר אחד");
    await save("members", next);
  };

  const savePin = async (m: Member, pin: string) => {
    if (mode === "demo") await save("members", { ...m, pin, has_pin: true });
    else {
      await pinOnServer(m.id, pin);
      await reload();
    }
    toast(`הקוד של ${m.name} נשמר`);
  };

  return (
    <div className="card">
      <h2>
        👥 צוות והרשאות
        <button className="btn sm pri r" onClick={() => setAdding(true)}>
          + הוספת עובד
        </button>
      </h2>
      <p className="muted" style={{ fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>
        כולם נכנסים עם חשבון הגוגל של רבר, ואז כל אחד בוחר את עצמו ומקיש <b>קוד אישי</b>. <b>מאסטר</b> רואה ועושה הכל.
        לעובדים סוגרים או פותחים כל דבר: מחירים, כספים, מחיקה, עריכת תבניות. בלי הרשאה, המספרים בכלל לא נשלחים אליהם.
      </p>
      <div className="tablewrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>עובד</th>
              <th>הרשאה</th>
              {PERMS.map((p) => (
                <th key={p.id} title={p.hint}>
                  {p.label}
                </th>
              ))}
              <th>פעיל</th>
              <th>קוד</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => {
              const admin = m.role === "admin";
              return (
                <tr key={m.id} style={{ opacity: m.active ? 1 : 0.5 }}>
                  <td>
                    <div className="row">
                      <div className="av" style={{ width: 34, height: 34, fontSize: 13, background: admin ? "var(--goldbg)" : "#f0f1f3", color: admin ? "var(--gold)" : "var(--muted)" }}>
                        {initials(m.name)}
                      </div>
                      <div>
                        <b>
                          {m.name}
                          {m.id === me?.id ? " (את/ה)" : ""}
                        </b>
                        <input
                          className="titleinput"
                          defaultValue={m.title ?? ""}
                          placeholder="תפקיד"
                          onBlur={(e) => e.target.value !== (m.title ?? "") && update(m, { title: e.target.value || undefined })}
                        />
                        <input
                          className="titleinput"
                          dir="ltr"
                          style={{ textAlign: "right" }}
                          defaultValue={m.phone ?? ""}
                          placeholder="טלפון (מוצג ללקוחות שלו)"
                          onBlur={(e) => e.target.value !== (m.phone ?? "") && update(m, { phone: e.target.value || undefined })}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className={"tag " + (admin ? "t-gold" : "t-gray")}
                      style={{ border: "none", cursor: "pointer" }}
                      value={m.role}
                      onChange={(e) => update(m, { role: e.target.value as Role })}
                    >
                      <option value="admin">מאסטר</option>
                      <option value="team">עובד</option>
                    </select>
                  </td>
                  {PERMS.map((p) => (
                    <td key={p.id}>
                      <label className="switch" title={admin ? "למאסטר יש הכל" : p.hint}>
                        <input type="checkbox" disabled={admin} checked={admin || m[FLAG[p.id]]} onChange={(e) => update(m, { [FLAG[p.id]]: e.target.checked })} />
                        <span />
                      </label>
                    </td>
                  ))}
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={m.active} disabled={m.id === me?.id} onChange={(e) => update(m, { active: e.target.checked })} />
                      <span />
                    </label>
                  </td>
                  <td>
                    <button className="btn sm" onClick={() => setPinFor(m)}>
                      {m.has_pin ? "🔑 החלפה" : "🔑 קביעה"}
                    </button>
                  </td>
                  <td>
                    {m.id !== me?.id && (
                      <button
                        className="btn sm danger"
                        onClick={async () => {
                          if (admin && admins.length <= 1) return toast("חייב להישאר לפחות מאסטר אחד");
                          if (confirm(`להסיר את ${m.name}?`)) await remove("members", m.id);
                        }}
                      >
                        הסרה
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {adding && (
        <AddMember
          onClose={() => setAdding(false)}
          onCreate={async (m, pin) => {
            await save("members", mode === "demo" ? { ...m, pin, has_pin: true } : m);
            if (mode !== "demo") {
              await pinOnServer(m.id, pin);
              await reload();
            }
            toast(`${m.name} נוסף/ה עם קוד אישי`);
          }}
        />
      )}
      {pinFor && <PinModal m={pinFor} onClose={() => setPinFor(null)} onSave={(pin) => savePin(pinFor, pin)} />}
    </div>
  );
}

function PinInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <Field label={label}>
      <input
        required
        inputMode="numeric"
        pattern="\d{4,8}"
        minLength={4}
        maxLength={8}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
        placeholder="4-8 ספרות"
      />
    </Field>
  );
}

function PinModal({ m, onClose, onSave }: { m: Member; onClose: () => void; onSave: (pin: string) => Promise<void> }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  return (
    <Modal title={`קוד אישי: ${m.name}`} onClose={onClose}>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await onSave(pin);
            onClose();
          } catch (x) {
            setErr(x instanceof Error ? x.message : String(x));
          }
        }}
      >
        <div className="full">
          <PinInput label="קוד חדש" value={pin} onChange={setPin} />
        </div>
        <div className="full muted" style={{ fontSize: 13.5 }}>
          תמסרו את הקוד ל{m.name} בעל-פה או בהודעה פרטית. אחרי 5 ניסיונות שגויים הקוד ננעל ל-10 דקות.
        </div>
        {err && <div className="banner err full">{err}</div>}
        <div className="mfoot full">
          <button className="btn pri">שמירה</button>
        </div>
      </form>
    </Modal>
  );
}

function AddMember({ onClose, onCreate }: { onClose: () => void; onCreate: (m: Member, pin: string) => Promise<void> }) {
  const [f, setF] = useState<Member>({
    id: uid(), name: "", title: "", role: "team", can_prices: false, can_finance: false, can_delete: false, can_templates: false, can_portal: false, active: true,
  });
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  return (
    <Modal title="הוספת עובד" onClose={onClose}>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await onCreate({ ...f, title: f.title || undefined, phone: f.phone || undefined, created_at: new Date().toISOString() }, pin);
            onClose();
          } catch (x) {
            setErr(x instanceof Error ? x.message : String(x));
          }
        }}
      >
        <Field label="שם *">
          <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </Field>
        <Field label="תפקיד">
          <input value={f.title ?? ""} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="מזכירה / תפעול / שירות לקוחות" />
        </Field>
        <Field label="טלפון (מוצג ללקוח בקישור לאירוע)">
          <input dir="ltr" value={f.phone ?? ""} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="050-0000000" />
        </Field>
        <PinInput label="קוד אישי *" value={pin} onChange={setPin} />
        <Field label="הרשאה">
          <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role })}>
            <option value="team">עובד: לפי מה שמסמנים</option>
            <option value="admin">מאסטר: הכל</option>
          </select>
        </Field>
        {f.role === "team" &&
          PERMS.map((p) => (
            <label key={p.id} className="full row" style={{ justifyContent: "space-between", cursor: "pointer" }}>
              <span>
                <b>{p.label}</b> <span className="muted" style={{ fontSize: 13.5 }}>· {p.hint}</span>
              </span>
              <span className="switch">
                <input type="checkbox" checked={f[FLAG[p.id]]} onChange={(e) => setF({ ...f, [FLAG[p.id]]: e.target.checked })} />
                <span />
              </span>
            </label>
          ))}
        {err && <div className="banner err full">{err}</div>}
        <div className="mfoot full">
          <button className="btn pri">הוספה</button>
        </div>
      </form>
    </Modal>
  );
}
