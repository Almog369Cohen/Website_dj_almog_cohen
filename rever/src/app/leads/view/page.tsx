"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { DOC_STATUS, DOC_TYPES, LOST_REASONS, PAYMENT_KINDS, STATUSES } from "@/lib/types";
import type { ActivityKind, Lead, LeadStatus } from "@/lib/types";
import { fromLocalInput, isOverdue, nis, relDay, shortDate, toLocalInput } from "@/lib/format";
import { fillTemplate, sendWhatsApp } from "@/lib/whatsapp";
import { CalendarModal, DocModal, FollowupModal, LeadModal, PaymentModal } from "@/components/forms";

const DOT: Record<ActivityKind, string> = {
  created: "var(--blue)",
  message: "var(--wa)",
  call: "var(--text)",
  status: "var(--gold)",
  note: "var(--muted)",
  meeting: "var(--violet)",
  payment: "var(--green)",
};

export default function LeadPage() {
  return (
    <Suspense>
      <LeadById />
    </Suspense>
  );
}

function LeadById() {
  const id = useSearchParams().get("id") ?? "";
  const { lead } = useStore();
  const l = lead(id);
  if (!l)
    return (
      <div className="empty">
        הליד לא נמצא. <Link href="/leads" className="link">חזרה ללידים</Link>
      </div>
    );
  return <LeadView l={l} />;
}

function LeadView({ l }: { l: Lead }) {
  const { db, settings, setStatus, updateLead, log, remove, toast, can } = useStore();
  const router = useRouter();
  const [modal, setModal] = useState<null | "edit" | "followup" | "meeting" | "payment" | "doc">(null);
  const [tplId, setTplId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [when, setWhen] = useState<"now" | "later">("now");
  const [laterAt, setLaterAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return toLocalInput(d.toISOString());
  });
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const waRef = useRef<HTMLDivElement>(null);

  const templates = [...db.templates].sort((a, b) => a.sort - b.sort);
  const acts = db.activities.filter((a) => a.lead_id === l.id && (a.kind !== "payment" || can("prices"))).sort((a, b) => +new Date(b.at) - +new Date(a.at));
  const messages = [...acts].filter((a) => a.kind === "message").reverse();
  const meeting = db.calendar_items
    .filter((c) => c.lead_id === l.id && c.kind === "meeting" && new Date(c.start) >= new Date())
    .sort((a, b) => +new Date(a.start) - +new Date(b.start))[0];
  const payments = db.payments.filter((p) => p.lead_id === l.id).sort((a, b) => a.date.localeCompare(b.date));
  const paid = payments.reduce((s, p) => s + (p.kind === "refund" ? -p.amount : p.amount), 0);
  const docs = db.docs.filter((d) => d.lead_id === l.id);

  // תבנית מוצעת לפי מצב הליד
  const suggested = useMemo(() => {
    const byName = (s: string) => templates.find((t) => t.name.includes(s));
    if (l.status === "new" && !messages.length) return byName("היכרות");
    if (l.status === "meeting") return byName("אישור פגישה");
    if (l.status === "quote") return byName("הצעת מחיר");
    if (l.status === "won") return byName("מקדמה");
    return byName("לא ענו");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [l.id, l.status, messages.length, db.templates]);

  useEffect(() => {
    if (l.pending_message) {
      setText(l.pending_message);
      setTplId(null);
    } else if (suggested) {
      setTplId(suggested.id);
      setText(fillTemplate(suggested.body, can("prices") ? l : { ...l, price: undefined }, settings, meeting));
    }
    if (typeof window !== "undefined" && window.location.hash === "#wa") setTimeout(() => waRef.current?.scrollIntoView({ block: "start" }), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [l.id]);

  const pick = (id: string) => {
    const t = templates.find((x) => x.id === id)!;
    setTplId(id);
    setText(fillTemplate(t.body, can("prices") ? l : { ...l, price: undefined }, settings, meeting));
  };

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const sendAt = when === "later" ? fromLocalInput(laterAt) : undefined;
    try {
      if (when === "later" && settings.whatsapp_mode !== "webhook") {
        // בלי חיבור API: שומרים את ההודעה ומזכירים לשלוח אותה בזמן שנקבע
        await updateLead(l, { pending_message: text, next_followup: sendAt, followup_note: "לשלוח הודעה מתוזמנת" });
        await log(l.id, "note", `הודעה תוזמנה ל${relDay(sendAt)}`);
        toast(`ההודעה נשמרה. תופיע בפולואפים של ${relDay(sendAt)} ותישלח בלחיצה אחת`);
        return;
      }
      const r = await sendWhatsApp(l, text, settings, sendAt);
      if (!r.ok) {
        toast("השליחה נכשלה: " + r.error);
        return;
      }
      const isOpen = !["won", "lost"].includes(l.status);
      const followup = new Date();
      followup.setDate(followup.getDate() + 2);
      followup.setHours(10, 0, 0, 0);
      await updateLead(l, {
        last_contact: new Date().toISOString(),
        pending_message: undefined,
        status: l.status === "new" ? "talk" : l.status,
        ...(isOpen ? { next_followup: followup.toISOString(), followup_note: "לבדוק אם ענו להודעה" } : { next_followup: undefined, followup_note: undefined }),
      });
      await log(l.id, "message", text);
      if (l.status === "new") await log(l.id, "status", 'סטטוס שונה ל"בשיחה"');
      toast(
        r.via === "webhook"
          ? when === "later"
            ? "ההודעה תוזמנה ונשלחה ל-Make"
            : "ההודעה נשלחה ✓"
          : "וואטסאפ נפתח עם ההודעה. לחצו שם על שליחה" + (isOpen ? " · פולואפ נקבע לעוד יומיים" : ""),
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="top">
        <div>
          <div className="crumb">
            <Link href="/leads">לידים</Link> ‹ כרטיס לקוח
          </div>
          <h1 className="row" style={{ flexWrap: "wrap" }}>
            {l.name}
            <select
              className={"tag s-" + l.status}
              style={{ border: "none", fontSize: 15, cursor: "pointer", outline: "none" }}
              value={l.status}
              onChange={(e) => setStatus(l, e.target.value as LeadStatus)}
              aria-label="סטטוס"
            >
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </h1>
        </div>
        <a className="btn ml" href={`tel:${l.phone}`} onClick={() => log(l.id, "call", "שיחת טלפון").then(() => updateLead(l, { last_contact: new Date().toISOString() }))}>
          📞 להתקשר
        </a>
        <button className="btn" onClick={() => setModal("meeting")}>
          📅 לקבוע פגישה
        </button>
        {l.status === "won" && (
          <Link className="btn pri" href={`/events/view?id=${l.id}`}>
            📋 כרטיס אירוע
          </Link>
        )}
        <button className="btn" onClick={() => setModal("edit")}>
          ✏️ עריכה
        </button>
      </div>

      <div className="leadgrid">
        {/* ---- פרטים ---- */}
        <div className="card">
          <h2>פרטים</h2>
          <div className="field">
            <span>טלפון</span>
            <b dir="ltr">{l.phone}</b>
          </div>
          {l.email && (
            <div className="field">
              <span>אימייל</span>
              <b dir="ltr">{l.email}</b>
            </div>
          )}
          <div className="field">
            <span>סוג אירוע</span>
            <b>{l.event_type}</b>
          </div>
          <div className="field">
            <span>תאריך</span>
            <b>{shortDate(l.event_date)}</b>
          </div>
          <div className="field">
            <span>מוזמנים</span>
            <b>{l.guests ?? "—"}</b>
          </div>
          <div className="field">
            <span>מקום</span>
            <b>{l.venue ?? "טרם נבחר"}</b>
          </div>
          <div className="field">
            <span>הגיעו דרך</span>
            <b>{l.source}</b>
          </div>
          <div className="field">
            <span>מי מטפל</span>
            <select
              className="inline-select"
              value={l.assigned_to ?? ""}
              onChange={async (e) => {
                const to = e.target.value || undefined;
                await updateLead(l, { assigned_to: to });
                await log(l.id, "note", to ? `שויך ל${db.members.find((m) => m.id === to)?.name}` : "השיוך הוסר");
              }}
            >
              <option value="">— לא משויך</option>
              {db.members
                .filter((m) => m.active)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
            </select>
          </div>
          {l.status === "lost" && (
            <div className="field">
              <span>למה לא סגרנו</span>
              <select className="inline-select" value={l.lost_reason ?? ""} onChange={(e) => updateLead(l, { lost_reason: e.target.value || undefined })}>
                <option value="">— לבחור</option>
                {LOST_REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          )}
          {l.price && can("prices") ? (
            <div className="field">
              <span>מחיר</span>
              <b>{nis(l.price)}</b>
            </div>
          ) : null}
          <div className="field" style={{ border: "none" }}>
            <span>פולואפ הבא</span>
            <button onClick={() => setModal("followup")} style={{ textAlign: "left" }}>
              {l.next_followup ? (
                <b className={isOverdue(l.next_followup) || relDay(l.next_followup).startsWith("היום") ? "late" : ""}>
                  {relDay(l.next_followup)} {isOverdue(l.next_followup) ? "⚠" : ""} ✏️
                </b>
              ) : (
                <span className="link">+ לקבוע</span>
              )}
            </button>
          </div>
          {l.followup_note && l.next_followup && <div className="muted" style={{ fontSize: 13.5, marginTop: -4 }}>{l.followup_note}</div>}

          {l.status === "won" && can("finance") && (
            <>
              <h2 style={{ marginTop: 20 }}>
                💰 תשלומים
                <button className="r link" onClick={() => setModal("payment")}>
                  + תשלום
                </button>
              </h2>
              <div className="field">
                <span>שולם</span>
                <b style={{ color: "var(--green)" }}>{nis(paid)}</b>
              </div>
              <div className="field">
                <span>יתרה</span>
                <b className={(l.price ?? 0) - paid > 0 ? "late" : ""}>{nis((l.price ?? 0) - paid)}</b>
              </div>
              {payments.map((p) => (
                <div key={p.id} className="tli">
                  <span className="dt" style={{ background: "var(--green)" }} />
                  <div>
                    {PAYMENT_KINDS[p.kind]} {nis(p.amount)}
                    <small>
                      {shortDate(p.date)} · {p.method}
                    </small>
                  </div>
                </div>
              ))}
            </>
          )}

          {can("finance") && (<>
          <h2 style={{ marginTop: 20 }}>
            מסמכים
            <button className="r link" onClick={() => setModal("doc")}>
              + מסמך
            </button>
          </h2>
          {docs.length === 0 && <div className="muted" style={{ fontSize: 14 }}>אין עדיין הצעת מחיר או חשבונית</div>}
          {docs.map((d) => (
            <div key={d.id} className="field">
              <span>
                {DOC_TYPES[d.type]} {d.number}
              </span>
              <b>
                {nis(d.amount)} · <span className="muted" style={{ fontWeight: 400 }}>{DOC_STATUS[d.status]}</span>
              </b>
            </div>
          ))}

          </>)}
          <h2 style={{ marginTop: 20 }}>היסטוריה</h2>
          <form
            className="row"
            style={{ marginBottom: 6 }}
            onSubmit={async (e) => {
              e.preventDefault();
              if (!note.trim()) return;
              await log(l.id, "note", note.trim());
              setNote("");
            }}
          >
            <input className="search" style={{ minWidth: 0, flex: 1, height: 38 }} placeholder="הוספת הערה…" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn sm">הוסף</button>
          </form>
          {acts.map((a) => (
            <div key={a.id} className="tli">
              <span className="dt" style={{ background: DOT[a.kind] }} />
              <div style={{ minWidth: 0 }}>
                {a.kind === "message" ? "נשלחה הודעת וואטסאפ" : can("prices") ? a.text : a.text.replace(/₪[\d,]+/g, "₪•••")}
                <small>
                  {new Date(a.at).toLocaleString("he-IL", { weekday: "long", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}
                  {a.by && <span className="by"> · {db.members.find((m) => m.id === a.by)?.name ?? "עובד שהוסר"}</span>}
                </small>
              </div>
            </div>
          ))}
          {can("delete") && <button
            className="btn sm danger"
            style={{ marginTop: 14 }}
            onClick={async () => {
              if (!confirm(`למחוק את ${l.name}?`)) return;
              await remove("leads", l.id);
              router.push("/leads");
            }}
          >
            מחיקת ליד
          </button>}
        </div>

        {/* ---- וואטסאפ ---- */}
        <div className="card" id="wa" ref={waRef} style={{ display: "flex", flexDirection: "column" }}>
          <h2>
            💬 וואטסאפ
            <span className="r muted" style={{ fontSize: 13, fontWeight: 400 }}>
              {settings.whatsapp_mode === "webhook" && settings.make_webhook_url ? "נשלח דרך Make" : "נפתח בוואטסאפ לשליחה"}
            </span>
          </h2>
          <div className="chat">
            {messages.length === 0 && <div className="muted" style={{ textAlign: "center", fontSize: 14 }}>עוד לא נשלחו הודעות</div>}
            {messages.map((m) => (
              <div key={m.id} className="bubble">
                {m.text}
                <small>{new Date(m.at).toLocaleString("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}
                  {m.by ? ` · ${db.members.find((x) => x.id === m.by)?.name ?? ""}` : ""} ✓✓
                </small>
              </div>
            ))}
            {l.pending_message && <div className="banner">יש הודעה מתוזמנת ל{relDay(l.next_followup)}. היא מוכנה למטה, רק לשלוח.</div>}
            <textarea className="compose" value={text} onChange={(e) => setText(e.target.value)} placeholder="כתבו הודעה או בחרו תבנית…" />
            <div className="row" style={{ flexWrap: "wrap", gap: 14 }}>
              <label className="radio">
                <input type="radio" checked={when === "now"} onChange={() => setWhen("now")} />
                לשלוח עכשיו
              </label>
              <label className="radio">
                <input type="radio" checked={when === "later"} onChange={() => setWhen("later")} />
                לתזמן:
                <input
                  type="datetime-local"
                  value={laterAt}
                  onChange={(e) => (setLaterAt(e.target.value), setWhen("later"))}
                  style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "4px 8px", background: "#fff", minWidth: 190, height: 34 }}
                />
              </label>
              <button className="btn wa ml" disabled={sending || !text.trim()} onClick={send}>
                {when === "later" ? "תזמון ⏰" : "שליחה ➤"}
              </button>
            </div>
          </div>
        </div>

        {/* ---- תבניות ---- */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h2>
            תבניות הודעה
            {can("templates") && (
              <Link href="/messages" className="r link">
                עריכה
              </Link>
            )}
          </h2>
          {templates.map((t) => (
            <button key={t.id} className={"tpl" + (tplId === t.id ? " on" : "")} onClick={() => pick(t.id)}>
              <b>{t.name}</b>
              <span>{t.description}</span>
            </button>
          ))}
        </div>
      </div>

      {modal === "edit" && <LeadModal lead={l} onClose={() => setModal(null)} />}
      {modal === "followup" && <FollowupModal lead={l} onClose={() => setModal(null)} />}
      {modal === "meeting" && <CalendarModal leadId={l.id} onClose={() => setModal(null)} />}
      {modal === "payment" && <PaymentModal leadId={l.id} onClose={() => setModal(null)} />}
      {modal === "doc" && <DocModal leadId={l.id} onClose={() => setModal(null)} />}
    </>
  );
}
