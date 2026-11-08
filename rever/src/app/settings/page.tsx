"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import type { Settings } from "@/lib/types";
import { Field } from "@/components/ui";
import { supabase } from "@/lib/repo";
import Team from "@/components/Team";

export default function SettingsPage() {
  const { db, settings, save, mode, resetDemo, toast } = useStore();
  const [f, setF] = useState<Settings>(db.settings[0] ?? settings);
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const set = (p: Partial<Settings>) => setF((x) => ({ ...x, ...p }));

  return (
    <>
      <div className="top">
        <div>
          <h1>הגדרות</h1>
          <div className="sub">צוות והרשאות, פרטי העסק וחיבורים</div>
        </div>
      </div>
      <Team />
      <div className="grid2" style={{ alignItems: "start" }}>
        <form
          className="card form"
          onSubmit={async (e) => {
            e.preventDefault();
            await save("settings", f);
            toast("ההגדרות נשמרו");
          }}
        >
          <h2 className="full">פרטי העסק</h2>
          <Field label="שם העסק">
            <input value={f.business_name} onChange={(e) => set({ business_name: e.target.value })} />
          </Field>
          <Field label='מע"מ (%)'>
            <input type="number" value={f.vat_rate} onChange={(e) => set({ vat_rate: Number(e.target.value) })} />
          </Field>

          <h2 className="full" style={{ marginTop: 10 }}>שליחת וואטסאפ</h2>
          <div className="full" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label className="radio">
              <input type="radio" checked={f.whatsapp_mode === "link"} onChange={() => set({ whatsapp_mode: "link" })} />
              <span>
                <b>פתיחת וואטסאפ עם הודעה מוכנה</b>
                <span className="muted"> · עובד מיד, בלי שום חיבור. לוחצים "שליחה" בוואטסאפ.</span>
              </span>
            </label>
            <label className="radio">
              <input type="radio" checked={f.whatsapp_mode === "webhook"} onChange={() => set({ whatsapp_mode: "webhook" })} />
              <span>
                <b>שליחה אוטומטית דרך Make</b>
                <span className="muted"> · Make מעביר ל-WhatsApp API / ManyChat. כולל תזמון.</span>
              </span>
            </label>
          </div>
          {f.whatsapp_mode === "webhook" && (
            <Field label="כתובת Webhook של Make" full>
              <input
                dir="ltr"
                value={f.make_webhook_url ?? ""}
                onChange={(e) => set({ make_webhook_url: e.target.value || undefined })}
                placeholder="https://hook.eu1.make.com/…"
              />
            </Field>
          )}
          <div className="mfoot full">
            <button className="btn pri">שמירה</button>
          </div>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <h2>חיבורים</h2>
            <div className="field">
              <span>מסד נתונים</span>
              <b>{mode === "supabase" ? <span className="tag t-green">Supabase מחובר</span> : <span className="tag t-gold">מצב דמו (דפדפן)</span>}</b>
            </div>
            <div className="field">
              <span>וואטסאפ</span>
              <b>
                {settings.whatsapp_mode === "webhook" && settings.make_webhook_url ? (
                  <span className="tag t-green">דרך Make</span>
                ) : (
                  <span className="tag t-gray">קישור wa.me</span>
                )}
              </b>
            </div>
            <div className="field">
              <span>יומן גוגל</span>
              <b><span className="tag t-gray">בשלב הבא</span></b>
            </div>
            <div className="field" style={{ border: "none" }}>
              <span>מורנינג / iCount</span>
              <b><span className="tag t-gray">בשלב הבא</span></b>
            </div>
          </div>

          <div className="card">
            <h2>קליטת לידים אוטומטית</h2>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
              ב-Make: תרחיש שמקבל ליד מ-Meta Lead Ads / ManyChat / טופס באתר, ושולח בקשת POST לכתובת הזו. הליד נכנס למערכת עם פולואפ להיום.
            </p>
            <div className="f" style={{ marginTop: 10 }}>
              <label>כתובת</label>
              <input readOnly dir="ltr" value={`${origin}/api/leads`} onFocus={(e) => e.target.select()} />
            </div>
            <pre dir="ltr" style={{ background: "#f5f6f8", borderRadius: 10, padding: 12, fontSize: 12.5, marginTop: 10, overflowX: "auto" }}>
{`POST /api/leads
Header: x-webhook-secret: <LEADS_WEBHOOK_SECRET>
{ "name": "דנה ויובל", "phone": "0524418823",
  "event_type": "חתונה", "event_date": "2027-09-09",
  "guests": 280, "source": "פייסבוק" }`}
            </pre>
            {!supabase() && <div className="banner" style={{ marginTop: 10 }}>זמין אחרי חיבור Supabase (במצב דמו אין שרת לשמור אליו).</div>}
          </div>

          {mode === "demo" && resetDemo && (
            <div className="card">
              <h2>נתוני דמו</h2>
              <button className="btn" onClick={() => confirm("לאפס את כל הנתונים לדמו המקורי?") && resetDemo()}>
                איפוס נתוני הדמו
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
