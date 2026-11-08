"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { PERMS } from "@/lib/types";
import type { Member, Role } from "@/lib/types";
import { initials } from "@/lib/format";
import { Field, Modal } from "./ui";

const FLAG = { finance: "can_finance", delete: "can_delete", templates: "can_templates" } as const;

export default function Team() {
  const { db, save, remove, me, toast } = useStore();
  const [adding, setAdding] = useState(false);
  const admins = db.members.filter((m) => m.role === "admin" && m.active);
  const list = [...db.members].sort((a, b) => (a.role === b.role ? a.name.localeCompare(b.name) : a.role === "admin" ? -1 : 1));

  const update = async (m: Member, patch: Partial<Member>) => {
    const next = { ...m, ...patch };
    // לא משאירים את המערכת בלי מנהל פעיל
    if (m.role === "admin" && (next.role !== "admin" || !next.active) && admins.length <= 1) {
      toast("חייב להישאר לפחות מנהל אחד פעיל");
      return;
    }
    await save("members", next);
  };

  return (
    <div className="card">
      <h2>
        👥 צוות והרשאות
        <button className="btn sm pri r" onClick={() => setAdding(true)}>
          + הוספת משתמש
        </button>
      </h2>
      <p className="muted" style={{ fontSize: 14, marginBottom: 6 }}>
        כל אחד נכנס עם חשבון הגוגל שלו. <b>מנהל</b> רואה ועושה הכל. ל<b>צוות</b> יש לידים, יומן והודעות, ומה שמסמנים כאן.
      </p>
      <div className="tablewrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>משתמש</th>
              <th>תפקיד</th>
              {PERMS.map((p) => (
                <th key={p.id} title={p.hint}>
                  {p.label}
                </th>
              ))}
              <th>פעיל</th>
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
                        <div className="muted" dir="ltr" style={{ fontSize: 12.5, textAlign: "right" }}>
                          {m.id}
                        </div>
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
                      <option value="admin">מנהל</option>
                      <option value="team">צוות</option>
                    </select>
                  </td>
                  {PERMS.map((p) => (
                    <td key={p.id}>
                      <label className="switch" title={admin ? "למנהל יש הכל" : p.hint}>
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
                    {m.id !== me?.id && (
                      <button
                        className="btn sm danger"
                        onClick={async () => {
                          if (admin && admins.length <= 1) return toast("חייב להישאר לפחות מנהל אחד");
                          if (confirm(`להסיר את ${m.name} מהמערכת?`)) await remove("members", m.id);
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
      {adding && <AddMember onClose={() => setAdding(false)} />}
    </div>
  );
}

function AddMember({ onClose }: { onClose: () => void }) {
  const { db, save, toast } = useStore();
  const [f, setF] = useState<Member>({ id: "", name: "", role: "team", can_finance: false, can_delete: false, can_templates: false, active: true });
  return (
    <Modal title="הוספת משתמש" onClose={onClose}>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          const id = f.id.trim().toLowerCase();
          if (db.members.some((m) => m.id === id)) return toast("המשתמש כבר קיים");
          await save("members", { ...f, id, created_at: new Date().toISOString() });
          toast(`${f.name} נוסף/ה. אפשר להיכנס עם ${id}`);
          onClose();
        }}
      >
        <Field label="שם *">
          <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </Field>
        <Field label="אימייל של חשבון הגוגל *">
          <input required type="email" dir="ltr" value={f.id} onChange={(e) => setF({ ...f, id: e.target.value })} placeholder="name@gmail.com" />
        </Field>
        <Field label="תפקיד" full>
          <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role })}>
            <option value="team">צוות: הרשאות לפי מה שמסמנים</option>
            <option value="admin">מנהל: הכל</option>
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
        <div className="mfoot full">
          <button className="btn pri">הוספה</button>
        </div>
      </form>
    </Modal>
  );
}
