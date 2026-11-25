"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Modal } from "@/components/ui";
import { moneyOf, planRevealsHidden } from "@/lib/money";
import { nis, shortDate, uid } from "@/lib/format";
import { PAY_METHODS, type Lead, type MoneyItem, type MoneyPaid, type MoneyPay, type PayMethod } from "@/lib/types";

/**
 * הכסף של לקוח אחד: הסכומים שרבר מציגים לו + תוכנית תשלומים עם רישום "מה שולם, מתי, כמה ואיך".
 * רישום בלבד (בלי סליקה ובלי הנהלת חשבונות). מסך "כספים" מסכם את כל הכרטיסים.
 */
export function MoneyPanel({ l }: { l: Lead }) {
  const { updateLead, log, can, toast } = useStore();
  const m = moneyOf(l);
  const [paying, setPaying] = useState<MoneyPay | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const canMark = can("finance");

  const saveItems = (items: MoneyItem[]) => {
    const total = items.reduce((s, i) => s + (Number(i.price) || 0), 0);
    return updateLead(l, { money_items: items.length ? JSON.stringify(items) : undefined, price: items.length ? total : l.price });
  };
  const savePlan = (plan: MoneyPay[]) => updateLead(l, { money_plan: plan.length ? JSON.stringify(plan) : undefined });
  const setItem = (id: string, p: Partial<MoneyItem>) => saveItems(m.items.map((i) => (i.id === id ? { ...i, ...p } : i)));
  const setPay = (id: string, p: Partial<MoneyPay>) => savePlan(m.plan.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const suppliers = [...new Set(m.items.map((i) => i.supplier).filter(Boolean))] as string[];

  return (
    <div className="money-panel">
      <div className="money3">
        <div>
          <small>סה״כ ללקוח</small>
          <b>{nis(m.total)}</b>
        </div>
        <div>
          <small>שולם</small>
          <b style={{ color: "var(--green)" }}>{nis(m.paid)}</b>
        </div>
        <div>
          <small>נותר לתשלום</small>
          <b className={m.remaining > 0 ? "late" : ""}>{nis(m.remaining)}</b>
        </div>
      </div>

      <div className="card">
        <h2>
          🧾 הסכומים שמוצגים ללקוח
          <span className="r muted" style={{ fontSize: 13, fontWeight: 500 }}>
            שירות · ספק · מחיר (המחיר הסופי ללקוח)
          </span>
        </h2>
        <div className="tablewrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>שירות</th>
                <th>ספק</th>
                <th>מחיר</th>
                <th title="להציג בדף הלקוח">ללקוח</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {m.items.map((i) => (
                <tr key={i.id}>
                  <td>
                    <input className="cell" defaultValue={i.service} placeholder="למשל: צילום" onBlur={(e) => e.target.value !== i.service && setItem(i.id, { service: e.target.value })} />
                  </td>
                  <td>
                    <input className="cell" defaultValue={i.supplier ?? ""} placeholder="שם הספק" onBlur={(e) => e.target.value !== (i.supplier ?? "") && setItem(i.id, { supplier: e.target.value || undefined })} />
                  </td>
                  <td>
                    <input className="cell" type="number" inputMode="numeric" defaultValue={i.price || ""} onBlur={(e) => Number(e.target.value || 0) !== i.price && setItem(i.id, { price: Number(e.target.value) || 0 })} />
                  </td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={i.show_client !== false} onChange={(e) => setItem(i.id, { show_client: e.target.checked })} />
                      <span />
                    </label>
                  </td>
                  <td>
                    <button className="muted" aria-label={`הסרת ${i.service}`} onClick={() => saveItems(m.items.filter((x) => x.id !== i.id))}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {m.items.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2}>
                    <b>סה״כ</b>
                  </td>
                  <td>
                    <b>{nis(m.total)}</b>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <button className="link" style={{ marginTop: 10 }} onClick={() => saveItems([...m.items, { id: uid(), service: "", price: 0, show_client: true }])}>
          + שורה
        </button>
        {m.items.length === 0 && l.price ? <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>כרגע הסכום הוא מחיר הליד ({nis(l.price)}). אפשר לפרט אותו כאן לשורות.</div> : null}
      </div>

      {planRevealsHidden(l) && (
        <div className="banner err" role="alert" style={{ marginBottom: 12 }}>
          ⚠️ שימו לב: הזוג רואה את תוכנית התשלומים. היא לא תואמת לסכום הגלוי, ואפשר להסיק ממנה את השורה המוסתרת.
        </div>
      )}
      <div className="card">
        <h2>
          💳 תוכנית תשלומים ומה שולם
          <span className="r muted" style={{ fontSize: 13, fontWeight: 500 }}>
            {m.planned !== m.total && m.plan.length > 0 ? <span className="late">התוכנית: {nis(m.planned)} · הסכום: {nis(m.total)}</span> : "רישום בלבד, בלי סליקה"}
          </span>
        </h2>
        <div className="tablewrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>מה</th>
                <th>למי</th>
                <th>סכום</th>
                <th>עד</th>
                <th>מצב</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {m.plan.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input className="cell" defaultValue={p.name} placeholder="מקדמה / פעימה / סופי" onBlur={(e) => e.target.value !== p.name && setPay(p.id, { name: e.target.value })} />
                  </td>
                  <td>
                    <select className="cell" value={p.to ?? ""} onChange={(e) => setPay(p.id, { to: e.target.value || undefined })}>
                      <option value="">רבר</option>
                      {suppliers.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input className="cell" type="number" inputMode="numeric" defaultValue={p.amount || ""} onBlur={(e) => Number(e.target.value || 0) !== p.amount && setPay(p.id, { amount: Number(e.target.value) || 0 })} />
                  </td>
                  <td>
                    <input className="cell" type="date" defaultValue={p.due ?? ""} onBlur={(e) => e.target.value !== (p.due ?? "") && setPay(p.id, { due: e.target.value || undefined })} />
                  </td>
                  <td>
                    {p.paid ? (
                      <span className="tag t-green" title={p.paid.note}>
                        שולם {shortDate(p.paid.date)} · {PAY_METHODS[p.paid.method]}
                        {Number(p.paid.amount) !== Number(p.amount) ? ` · ${nis(p.paid.amount)}` : ""}
                      </span>
                    ) : p.due && p.due < today ? (
                      <span className="tag t-red">באיחור</span>
                    ) : (
                      <span className="tag t-gold">ממתין</span>
                    )}
                  </td>
                  <td>
                    <div className="row" style={{ gap: 6 }}>
                      {canMark && !p.paid && (
                        <button className="btn sm" onClick={() => setPaying(p)}>
                          ✓ סימון כשולם
                        </button>
                      )}
                      {canMark && p.paid && (
                        <button className="link" onClick={() => setPaying(p)}>
                          עריכה
                        </button>
                      )}
                      <button className="muted" aria-label={`הסרת ${p.name}`} onClick={() => (!p.paid || confirm("השורה מסומנת כשולמה. למחוק בכל זאת?")) && savePlan(m.plan.filter((x) => x.id !== p.id))}>
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row" style={{ marginTop: 10, gap: 14, flexWrap: "wrap" }}>
          <button className="link" onClick={() => savePlan([...m.plan, { id: uid(), name: "", amount: 0 }])}>
            + שלב תשלום
          </button>
          {m.plan.length === 0 && m.total > 0 && (
            <button
              className="link"
              onClick={() => {
                const third = Math.round(m.total / 3 / 100) * 100;
                savePlan([
                  { id: uid(), name: "מקדמה", amount: third, due: today },
                  { id: uid(), name: "תשלום ביניים", amount: third },
                  { id: uid(), name: "תשלום סופי", amount: m.total - third * 2, due: l.event_date },
                ]);
              }}
            >
              לחלק ל-3 תשלומים
            </button>
          )}
        </div>
      </div>

      {paying && (
        <PaidModal
          pay={paying}
          onClose={() => setPaying(null)}
          onSave={async (paid) => {
            await setPay(paying.id, { paid: paid ?? undefined });
            if (paid) await log(l.id, "payment", `💳 נרשם תשלום: ${paying.name || "תשלום"} ${nis(paid.amount)} (${PAY_METHODS[paid.method]})`);
            toast(paid ? "התשלום נרשם ✓" : "הסימון בוטל");
            setPaying(null);
          }}
        />
      )}
    </div>
  );
}

function PaidModal({ pay, onClose, onSave }: { pay: MoneyPay; onClose(): void; onSave(paid: MoneyPaid | null): void }) {
  const [f, setF] = useState<MoneyPaid>(pay.paid ?? { date: new Date().toISOString().slice(0, 10), amount: Number(pay.amount) || 0, method: "transfer" });
  return (
    <Modal title={`✓ ${pay.paid ? "עריכת תשלום" : "סימון כשולם"}: ${pay.name || "תשלום"}`} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...f, note: f.note?.trim() || undefined });
        }}
      >
        <div className="form">
          <div className="f">
            <label>מתי שולם</label>
            <input type="date" required value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          </div>
          <div className="f">
            <label>כמה</label>
            <input type="number" inputMode="numeric" required value={f.amount || ""} onChange={(e) => setF({ ...f, amount: Number(e.target.value) || 0 })} />
          </div>
          <div className="f full">
            <label>איך</label>
            <div className="seg" style={{ flexWrap: "wrap" }}>
              {(Object.keys(PAY_METHODS) as PayMethod[]).map((k) => (
                <button type="button" key={k} className={f.method === k ? "on" : ""} onClick={() => setF({ ...f, method: k })}>
                  {PAY_METHODS[k]}
                </button>
              ))}
            </div>
          </div>
          <div className="f full">
            <label>הערה (לא מוצג ללקוח)</label>
            <input value={f.note ?? ""} placeholder="למשל: אסמכתא, מי העביר" onChange={(e) => setF({ ...f, note: e.target.value })} />
          </div>
        </div>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn pri">שמירה</button>
          <button type="button" className="btn" onClick={onClose}>
            ביטול
          </button>
          {pay.paid && (
            <button type="button" className="btn danger ml" onClick={() => onSave(null)}>
              ביטול הסימון
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
