"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { DOC_STATUS, DOC_TYPES, PAYMENT_KINDS } from "@/lib/types";
import type { Doc, Expense, Payment } from "@/lib/types";
import { MONTHS, nis, shortDate, todayYmd } from "@/lib/format";
import { DocModal, ExpenseModal, PaymentModal } from "@/components/forms";
import { duePayments, planOf } from "@/lib/events";
import { waLink } from "@/lib/whatsapp";

type Tab = "events" | "payments" | "expenses" | "docs";
const signed = (p: Payment) => (p.kind === "refund" ? -p.amount : p.amount);
const monthKey = (ymd: string) => ymd.slice(0, 7);

export default function FinancePage() {
  const { db, me } = useStore();
  const isMaster = me?.role === "admin";
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("events");
  const [modal, setModal] = useState<
    null | { t: "payment"; p?: Payment; leadId?: string } | { t: "expense"; e?: Expense } | { t: "doc"; d?: Doc }
  >(null);

  const now = new Date();
  const thisMonth = todayYmd().slice(0, 7);
  const name = (id?: string) => db.leads.find((l) => l.id === id)?.name ?? "—";

  // הכנסות / הוצאות לפי חודש (6 חודשים אחרונים)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      key,
      label: MONTHS[d.getMonth()],
      income: db.payments.filter((p) => monthKey(p.date) === key).reduce((s, p) => s + signed(p), 0),
      expense: db.expenses.filter((e) => monthKey(e.date) === key).reduce((s, e) => s + e.amount, 0),
    };
  });
  const cur = months[5];
  const prev = months[4];
  const max = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]));

  // אירועים סגורים + יתרות
  const deals = db.leads
    .filter((l) => l.status === "won")
    .map((l) => {
      const paid = db.payments.filter((p) => p.lead_id === l.id).reduce((s, p) => s + signed(p), 0);
      const price = l.price ?? 0;
      const supCost = planOf(db, l).suppliers.reduce((s, x) => s + (x.cost || 0), 0);
      // תשלום לספק שנרשם כהוצאה כבר כלול בעלות הספק בכרטיס האירוע
      const linked = db.expenses.filter((e) => e.lead_id === l.id && e.category !== "ספקים").reduce((s, e) => s + e.amount, 0);
      return { l, price, paid, cost: supCost + linked, profit: price - supCost - linked, balance: price - paid, days: l.event_date ? Math.ceil((+new Date(l.event_date) - +now) / 86400000) : null };
    })
    .sort((a, b) => (a.l.event_date ?? "9").localeCompare(b.l.event_date ?? "9"));
  const openBalance = deals.reduce((s, d) => s + Math.max(0, d.balance), 0);
  const urgent = deals.filter((d) => d.balance > 0 && d.days !== null && d.days <= 14);
  const pastDue = deals.filter((d) => d.balance > 0 && d.days !== null && d.days < 0);
  const due = deals.flatMap((d) => duePayments(db, d.l, 14).map((x) => ({ ...x, l: d.l }))).sort((a, b) => a.due.localeCompare(b.due));
  const openQuotes = db.docs.filter((d) => d.type === "quote" && d.status === "sent");

  const status = (d: (typeof deals)[number]) => {
    if (d.price === 0) return <span className="tag t-gray">אין מחיר</span>;
    if (d.balance < 0) return <span className="tag t-gold">שולם ביתר {nis(-d.balance)}</span>;
    if (d.balance === 0) return <span className="tag t-green">שולם במלואו</span>;
    if (d.paid > 0) return <span className="tag t-gold">שולמה מקדמה</span>;
    return <span className="tag t-red">לא שולם</span>;
  };

  return (
    <>
      <div className="top">
        <div>
          <h1>כספים</h1>
          <div className="sub">כמה נכנס, כמה עוד צריך להיכנס, ולאן הכסף הולך</div>
        </div>
        <button className="btn ml" onClick={() => setModal({ t: "expense" })}>
          + הוצאה
        </button>
        <button className="btn" onClick={() => setModal({ t: "doc" })}>
          + הצעת מחיר / חשבונית
        </button>
        <button className="btn pri" onClick={() => setModal({ t: "payment" })}>
          + רישום תשלום
        </button>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="l">נכנס החודש</div>
          <div className="v" style={{ color: "var(--green)" }}>{nis(cur.income)}</div>
          <small>חודש שעבר: {nis(prev.income)}</small>
        </div>
        <div className="kpi">
          <div className="l">צפוי להיכנס</div>
          <div className="v">{nis(openBalance)}</div>
          <small>יתרות פתוחות של {deals.filter((d) => d.balance > 0).length} אירועים</small>
        </div>
        <div className="kpi">
          <div className="l">הוצאות החודש</div>
          <div className="v">{nis(cur.expense)}</div>
          <small>חודש שעבר: {nis(prev.expense)}</small>
        </div>
        <div className="kpi">
          <div className="l">רווח החודש</div>
          <div className="v" style={{ color: cur.income - cur.expense >= 0 ? "var(--text)" : "var(--red)" }}>{nis(cur.income - cur.expense)}</div>
          <small>הכנסות פחות הוצאות</small>
        </div>
        <div className="kpi">
          <div className="l">הצעות מחיר פתוחות</div>
          <div className="v">{nis(openQuotes.reduce((s, d) => s + d.amount, 0))}</div>
          <small>{openQuotes.length} הצעות ממתינות לתשובה</small>
        </div>
      </div>

      {(urgent.length > 0 || pastDue.length > 0) && (
        <div className="banner err">
          ⚠ {pastDue.length > 0 && <>{pastDue.length} אירועים שכבר עברו ועדיין יש יתרה פתוחה. </>}
          {urgent.filter((d) => (d.days ?? 0) >= 0).length > 0 && (
            <>
              {urgent.filter((d) => (d.days ?? 0) >= 0).length} אירועים בשבועיים הקרובים עם יתרה פתוחה (
              {urgent
                .filter((d) => (d.days ?? 0) >= 0)
                .map((d) => d.l.name)
                .join(", ")}
              ).
            </>
          )}
        </div>
      )}

      {due.length > 0 && (
        <div className="card">
          <h2>
            💳 תשלומים לפי תוכנית · שבועיים קרובים ובאיחור
            <span className="r muted" style={{ fontSize: 14, fontWeight: 500 }}>{nis(due.reduce((s, x) => s + x.amount, 0))}</span>
          </h2>
          {due.map((x, i) => (
            <div key={i} className="trow">
              <span>
                <Link className="link" href={`/events/view?id=${x.l.id}#payments`}>{x.l.name}</Link> · {x.name}
              </span>
              <span className="ml">{x.late ? <span className="tag t-red">באיחור {-x.days} ימים</span> : <span className="tag t-gold">{x.days === 0 ? "היום" : `עד ${shortDate(x.due)}`}</span>}</span>
              <b className="num">{nis(x.amount)}</b>
              <a
                className="ib wa"
                style={{ width: 34, height: 34 }}
                target="_blank"
                rel="noreferrer"
                title="תזכורת בוואטסאפ"
                href={waLink(x.l.phone, `היי ${x.l.name}, תזכורת קטנה: ${x.name} על סך ${nis(x.amount)} ${x.late ? "היה אמור להשתלם" : "צריך להשתלם"} עד ${shortDate(x.due)}. תודה! 🙏`)}
              >
                💬
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h2>
          הכנסות מול הוצאות · 6 חודשים
          <span className="r legend" style={{ fontSize: 13 }}>
            <span>
              <i style={{ background: "var(--green)" }} />
              הכנסות
            </span>
            <span>
              <i style={{ background: "#d5d9e0" }} />
              הוצאות
            </span>
          </span>
        </h2>
        <div className="bars">
          {months.map((m) => (
            <div className="m" key={m.key}>
              <div className="val">{m.income ? nis(m.income) : ""}</div>
              <div className="pair">
                <div className="b" style={{ height: `${(m.income / max) * 100}%`, background: m.key === thisMonth ? "var(--green)" : "#7fcca6" }} title={`הכנסות ${nis(m.income)}`} />
                <div className="b" style={{ height: `${(m.expense / max) * 100}%`, background: "#d5d9e0" }} title={`הוצאות ${nis(m.expense)}`} />
              </div>
              <div className="lbl" style={{ fontWeight: m.key === thisMonth ? 700 : 400 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: "12px 0 0" }}>
        <div className="tabs" style={{ padding: "0 14px" }}>
          {(
            [
              ["events", "אירועים ויתרות"],
              ["payments", "תשלומים"],
              ["expenses", "הוצאות"],
              ["docs", "הצעות מחיר וחשבוניות"],
            ] as [Tab, string][]
          ).map(([k, v]) => (
            <button key={k} className={"tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>
              {v}
            </button>
          ))}
        </div>
        <div className="tablewrap">
          {tab === "events" && (
            <table className="tbl">
              <thead>
                <tr>
                  <th>לקוח</th>
                  <th>תאריך אירוע</th>
                  <th>מחיר</th>
                  <th>שולם</th>
                  <th>יתרה</th>
                  {isMaster && <th title="מחיר פחות עלויות הספקים בכרטיס האירוע ופחות הוצאות אחרות שמשויכות לאירוע">רווח 🔒</th>}
                  <th></th>
                  <th>מצב</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {deals.map((d) => (
                  <tr key={d.l.id} className="click" onClick={() => router.push(`/leads/view?id=${d.l.id}`)}>
                    <td>
                      <b>{d.l.name}</b>
                      <div className="muted" style={{ fontSize: 13 }}>{d.l.event_type}</div>
                    </td>
                    <td className="num">
                      {shortDate(d.l.event_date)}
                      {d.days !== null && d.days >= 0 && d.days <= 14 && <div className="late" style={{ fontSize: 12.5 }}>בעוד {d.days} ימים</div>}
                    </td>
                    <td className="num">{nis(d.price)}</td>
                    <td className="num" style={{ color: "var(--green)" }}>{nis(d.paid)}</td>
                    <td className="num">
                      <b className={d.balance > 0 ? "late" : ""}>{nis(Math.max(0, d.balance))}</b>
                    </td>
                    {isMaster && (
                      <td className="num" title={`עלויות: ${nis(d.cost)}`}>
                        <b style={{ color: d.profit >= 0 ? "var(--green)" : "var(--red)" }}>{d.price ? nis(d.profit) : "—"}</b>
                        {d.price > 0 && <div className="muted" style={{ fontSize: 12.5 }}>{Math.round((d.profit / d.price) * 100)}%</div>}
                      </td>
                    )}
                    <td>
                      <div className="progress">
                        <span style={{ width: `${d.price ? Math.min(100, (d.paid / d.price) * 100) : 0}%` }} />
                      </div>
                    </td>
                    <td>{status(d)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="row" style={{ gap: 6 }}>
                        <button className="btn sm" onClick={() => setModal({ t: "payment", leadId: d.l.id })}>
                          + תשלום
                        </button>
                        {d.balance > 0 && (
                          <Link className="ib wa" href={`/leads/view?id=${d.l.id}#wa`} title="תזכורת תשלום בוואטסאפ" style={{ width: 36, height: 36 }}>
                            💬
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "payments" && (
            <table className="tbl">
              <thead>
                <tr>
                  <th>תאריך</th>
                  <th>לקוח</th>
                  <th>סוג</th>
                  <th>אמצעי</th>
                  <th>סכום</th>
                  <th>הערה</th>
                </tr>
              </thead>
              <tbody>
                {[...db.payments]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((p) => (
                    <tr key={p.id} className="click" onClick={() => setModal({ t: "payment", p })}>
                      <td className="num">{shortDate(p.date)}</td>
                      <td>
                        <b>{name(p.lead_id)}</b>
                      </td>
                      <td>{PAYMENT_KINDS[p.kind]}</td>
                      <td>{p.method}</td>
                      <td className="num" style={{ color: p.kind === "refund" ? "var(--red)" : "var(--green)", fontWeight: 700 }}>
                        {p.kind === "refund" ? "-" : ""}
                        {nis(p.amount)}
                      </td>
                      <td className="muted">{p.note}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          {tab === "expenses" && (
            <table className="tbl">
              <thead>
                <tr>
                  <th>תאריך</th>
                  <th>ספק</th>
                  <th>קטגוריה</th>
                  <th>אירוע</th>
                  <th>סכום</th>
                </tr>
              </thead>
              <tbody>
                {[...db.expenses]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((e) => (
                    <tr key={e.id} className="click" onClick={() => setModal({ t: "expense", e })}>
                      <td className="num">{shortDate(e.date)}</td>
                      <td>
                        <b>{e.supplier}</b>
                      </td>
                      <td>{e.category}</td>
                      <td>{e.lead_id ? name(e.lead_id) : <span className="muted">כללי</span>}</td>
                      <td className="num" style={{ fontWeight: 700 }}>{nis(e.amount)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          {tab === "docs" && (
            <table className="tbl">
              <thead>
                <tr>
                  <th>מספר</th>
                  <th>סוג</th>
                  <th>לקוח</th>
                  <th>תאריך</th>
                  <th>סכום</th>
                  <th>סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {[...db.docs]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((d) => (
                    <tr key={d.id} className="click" onClick={() => setModal({ t: "doc", d })}>
                      <td className="num" dir="ltr" style={{ textAlign: "right" }}>{d.number}</td>
                      <td>{DOC_TYPES[d.type]}</td>
                      <td>
                        <b>{name(d.lead_id)}</b>
                      </td>
                      <td className="num">{shortDate(d.date)}</td>
                      <td className="num" style={{ fontWeight: 700 }}>{nis(d.amount)}</td>
                      <td>
                        <span className={"tag " + (d.status === "paid" ? "t-green" : d.status === "sent" ? "t-gold" : "t-gray")}>{DOC_STATUS[d.status]}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          {((tab === "events" && !deals.length) || (tab === "payments" && !db.payments.length) || (tab === "expenses" && !db.expenses.length) || (tab === "docs" && !db.docs.length)) && (
            <div className="empty">אין עדיין נתונים כאן</div>
          )}
        </div>
      </div>

      {modal?.t === "payment" && <PaymentModal payment={modal.p} leadId={modal.leadId} onClose={() => setModal(null)} />}
      {modal?.t === "expense" && <ExpenseModal expense={modal.e} onClose={() => setModal(null)} />}
      {modal?.t === "doc" && <DocModal doc={modal.d} onClose={() => setModal(null)} />}
    </>
  );
}
