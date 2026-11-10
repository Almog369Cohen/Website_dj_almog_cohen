"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import type { Settings } from "@/lib/types";
import { Field } from "@/components/ui";
import { supabase } from "@/lib/repo";
import Team from "@/components/Team";
import ImportSheet from "@/components/ImportSheet";
import { relDay } from "@/lib/format";
import type { DB } from "@/lib/types";

export default function SettingsPage() {
  const { db, settings, save, mode, resetDemo, cleanDemo, restoreDemo, toast } = useStore();
  const [importing, setImporting] = useState(false);
  const sheet = db.settings[0];
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
              <b>
                {mode === "supabase" ? (
                  <span className="tag t-green">Supabase מחובר</span>
                ) : mode === "sheets" ? (
                  <span className="tag t-green">גוגל שיטס מחובר</span>
                ) : (
                  <span className="tag t-gold">מצב דמו (דפדפן)</span>
                )}
              </b>
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

          <div className="card">
            <h2>📗 גוגל שיטס</h2>
            {sheet?.sheet_url ? (
              <>
                <div className="field">
                  <span>גיליון מחובר</span>
                  <a className="link" href={sheet.sheet_url} target="_blank" rel="noreferrer">
                    פתיחה ↗
                  </a>
                </div>
                <div className="field">
                  <span>משיכה אחרונה</span>
                  <b>{sheet.sheet_last_pull ? relDay(sheet.sheet_last_pull) : "—"}</b>
                </div>
                <label className="radio" style={{ padding: "10px 0" }}>
                  <input type="checkbox" checked={!!sheet.sheet_auto} onChange={(e) => save("settings", { ...sheet, sheet_auto: e.target.checked })} />
                  למשוך לידים חדשים אוטומטית בכל כניסה
                </label>
                <div className="row">
                  <button className="btn sm" onClick={() => setImporting(true)}>
                    החלפת גיליון / עמודות
                  </button>
                  <button className="btn sm danger" onClick={() => save("settings", { ...sheet, sheet_url: undefined, sheet_map: undefined, sheet_auto: false })}>
                    ניתוק
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>
                  מחברים את גיליון הלידים פעם אחת. אחרי זה לידים חדשים נמשכים בלחיצה, או אוטומטית בכל כניסה. בלי כפילויות.
                </p>
                <button className="btn pri" onClick={() => setImporting(true)}>
                  ⬇ חיבור גיליון
                </button>
              </>
            )}
          </div>

          <div className="card">
            <h2>💾 הנתונים</h2>
            {mode === "demo" && (
              <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 10 }}>
                כרגע הנתונים נשמרים בדפדפן של המכשיר הזה בלבד. מומלץ לשמור גיבוי פעם ביום.
              </p>
            )}
            <div className="row" style={{ flexWrap: "wrap" }}>
              <button
                className="btn sm"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(db, null, 1)], { type: "application/json" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = `rever-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
              >
                ⬇ שמירת גיבוי
              </button>
              {restoreDemo && (
                <label className="btn sm" style={{ cursor: "pointer" }}>
                  ⬆ שחזור מגיבוי
                  <input
                    type="file"
                    accept=".json,application/json"
                    hidden
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f || !confirm("השחזור מחליף את כל הנתונים הנוכחיים. להמשיך?")) return;
                      try {
                        await restoreDemo(JSON.parse(await f.text()) as DB);
                      } catch (x) {
                        toast("השחזור נכשל: " + (x instanceof Error ? x.message : x));
                      }
                    }}
                  />
                </label>
              )}
            </div>
            {mode === "demo" && cleanDemo && resetDemo && (
              <div className="row" style={{ flexWrap: "wrap", marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line2)" }}>
                <button
                  className="btn sm pri"
                  onClick={() => confirm("למחוק את כל נתוני הדוגמה (לידים, יומן, כספים) ולהתחיל לעבוד עם נתונים אמיתיים? הצוות, הקודים והתבניות נשארים.") && cleanDemo()}
                >
                  🧹 התחלה נקייה לעבודה אמיתית
                </button>
                <button className="btn sm" onClick={() => confirm("להחזיר את נתוני הדוגמה? כל מה שהוזן יימחק.") && resetDemo()}>
                  החזרת נתוני דוגמה
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {importing && <ImportSheet onClose={() => setImporting(false)} />}
    </>
  );
}
