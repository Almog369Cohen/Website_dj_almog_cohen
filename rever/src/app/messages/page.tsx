"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Template } from "@/lib/types";
import { uid } from "@/lib/format";
import { Field, Modal } from "@/components/ui";

const VARS = ["{שם}", "{תאריך}", "{אירוע}", "{פגישה}", "{מחיר}", "{עסק}", "{בעלים}"];

export default function MessagesPage() {
  const { db, save, remove } = useStore();
  const [edit, setEdit] = useState<Template | null>(null);
  const templates = [...db.templates].sort((a, b) => a.sort - b.sort);

  return (
    <>
      <div className="top">
        <div>
          <h1>תבניות הודעה</h1>
          <div className="sub">הודעות מוכנות לוואטסאפ. בשליחה המשתנים מתמלאים לבד לפי הליד.</div>
        </div>
        <button
          className="btn pri ml"
          onClick={() => setEdit({ id: uid(), name: "", description: "", body: "", sort: (templates.at(-1)?.sort ?? 0) + 1 })}
        >
          + תבנית חדשה
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
        {templates.map((t) => (
          <button key={t.id} className="card" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 8 }} onClick={() => setEdit(t)}>
            <b style={{ fontSize: 17 }}>{t.name}</b>
            <span className="muted" style={{ fontSize: 14 }}>{t.description}</span>
            <div className="bubble" style={{ maxWidth: "100%", fontSize: 14 }}>{t.body}</div>
          </button>
        ))}
      </div>
      {edit && (
        <Modal title={db.templates.some((t) => t.id === edit.id) ? "עריכת תבנית" : "תבנית חדשה"} onClose={() => setEdit(null)}>
          <form
            className="form"
            onSubmit={async (e) => {
              e.preventDefault();
              await save("templates", edit);
              setEdit(null);
            }}
          >
            <Field label="שם *">
              <input required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="🔁 פולואפ" />
            </Field>
            <Field label="מתי משתמשים">
              <input value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
            </Field>
            <Field label="ההודעה *" full>
              <textarea required rows={6} value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} />
            </Field>
            <div className="full row" style={{ flexWrap: "wrap", gap: 6 }}>
              <span className="muted" style={{ fontSize: 13 }}>להוספה:</span>
              {VARS.map((v) => (
                <button type="button" key={v} className="btn sm" onClick={() => setEdit({ ...edit, body: edit.body + v })}>
                  {v}
                </button>
              ))}
            </div>
            <div className="mfoot full">
              <button className="btn pri">שמירה</button>
              {db.templates.some((t) => t.id === edit.id) && (
                <button
                  type="button"
                  className="btn danger"
                  onClick={async () => {
                    await remove("templates", edit.id);
                    setEdit(null);
                  }}
                >
                  מחיקה
                </button>
              )}
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
