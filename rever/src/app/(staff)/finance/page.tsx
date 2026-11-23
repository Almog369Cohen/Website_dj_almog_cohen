"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { MONTHS, nis, shortDate } from "@/lib/format";
import { byMonth, duePays, moneyOf } from "@/lib/money";
import { pipeline } from "@/lib/leads";
import { waLink } from "@/lib/whatsapp";

/**
 * כספים: תמונה מסכמת של כרטיסי הלקוחות. בלי הנהלת חשבונות, בלי הוצאות של העסק.
 * כל מספר כאן מחושב מהסכומים ומתוכנית התשלומים שבכרטיס של כל לקוח.
 */
export default function FinancePage() {
  const { db } = useStore();
  const router = useRouter();
  const won = db.leads.filter((l) => l.status === "won");
  const rows = won
    .map((l) => ({ l, m: moneyOf(l) }))
    .sort((a, b) => (a.l.event_date ?? "9").localeCompare(b.l.event_date ?? "9"));
  const total = rows.reduce((s, r) => s + r.m.total, 0);
  const paid = rows.reduce((s, r) => s + r.m.paid, 0);
  const due = duePays(won, 14);
  const dueSum = due.reduce((s, d) => s + (Number(d.pay.amount) || 0), 0);
  const months = byMonth(db.leads);
  const maxMonth = Math.max(1, ...months.map((m) => m.total));
  const pipe = pipeline(db.leads);
  const quotes = db.leads.filter((l) => l.status === "quote").sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  const monthLabel = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(2, 4)}`;

  return (
    <>
      <div className="top">
        <div>
          <h1>כספים</h1>
          <div className="sub">מחושב מכרטיסי הלקוחות: כמה בכל אירוע, מה שולם ומה מגיע</div>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="l">סה״כ באירועים סגורים</div>
          <div className="v">{nis(total)}</div>
          <small>{won.length} אירועים</small>
        </div>
        <div className="kpi">
          <div className="l">שולם</div>
          <div className="v" style={{ color: "var(--green)" }}>{nis(paid)}</div>
          <small>{total ? Math.round((paid / total) * 100) : 0}% מהסכום</small>
        </div>
        <div className="kpi">
          <div className="l">נותר לגבייה</div>
          <div className="v">{nis(Math.max(0, total - paid))}</div>
          <small>{rows.filter((r) => r.m.remaining > 0).length} לקוחות עם יתרה</small>
        </div>
        <div className="kpi">
          <div className="l">מגיע בשבועיים</div>
          <div className="v" style={{ color: due.some((d) => d.late) ? "var(--red)" : undefined }}>{nis(dueSum)}</div>
          <small>{due.filter((d) => d.late).length ? `${due.filter((d) => d.late).length} באיחור` : `${due.length} תשלומים`}</small>
        </div>
      </div>

      <div className="grid2" style={{ alignItems: "start" }}>
        <div className="card" style={{ padding: 0 }}>
          <h2 style={{ padding: "18px 20px 0" }}>👥 לקוחות וסכומים</h2>
          <div className="tablewrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>לקוח</th>
                  <th>אירוע</th>
                  <th>סה״כ</th>
                  <th>שולם</th>
                  <th>נותר</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="muted">
                      עוד אין אירועים סגורים.
                    </td>
                  </tr>
                )}
                {rows.map(({ l, m }) => (
                  <tr key={l.id} className="click" onClick={() => router.push(`/events/view?id=${l.id}#payments`)}>
                    <td>
                      <b>{l.name}</b>
                      <div className="muted" style={{ fontSize: 13 }}>{l.event_type}</div>
                    </td>
                    <td className="num">{shortDate(l.event_date)}</td>
                    <td className="num">{nis(m.total)}</td>
                    <td className="num" style={{ color: "var(--green)" }}>{nis(m.paid)}</td>
                    <td className="num">
                      <b className={m.remaining > 0 ? "late" : ""}>{nis(m.remaining)}</b>
                      {m.late > 0 && <div className="late" style={{ fontSize: 12 }}>{m.late} באיחור</div>}
                    </td>
                    <td style={{ minWidth: 90 }}>
                      <div className="progress">
                        <span style={{ width: `${m.total ? Math.min(100, (m.paid / m.total) * 100) : 0}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <h2>
              💳 תשלומים שמגיעים
              <span className="r muted" style={{ fontSize: 13, fontWeight: 500 }}>
                שבועיים קרובים ובאיחור
              </span>
            </h2>
            {due.length === 0 && <div className="muted" style={{ fontSize: 14 }}>אין תשלומים שמגיעים בשבועיים הקרובים.</div>}
            {due.map(({ lead, pay, days, late }) => (
              <div key={lead.id + pay.id} className="trow">
                <span>
                  <Link className="link" href={`/events/view?id=${lead.id}#payments`}>
                    {lead.name}
                  </Link>{" "}
                  · {pay.name || "תשלום"}
                  {pay.to ? <span className="muted"> · ל{pay.to}</span> : null}
                </span>
                <span className="ml">{late ? <span className="tag t-red">באיחור {-days} ימים</span> : <span className="tag t-gold">{days === 0 ? "היום" : `עד ${shortDate(pay.due)}`}</span>}</span>
                <b className="num">{nis(pay.amount)}</b>
                <a
                  className="ib wa"
                  style={{ width: 34, height: 34 }}
                  target="_blank"
                  rel="noreferrer"
                  title="תזכורת בוואטסאפ"
                  href={waLink(lead.phone, `היי ${lead.name}, תזכורת קטנה: ${pay.name || "התשלום"} על סך ${nis(pay.amount)} ${late ? "היה אמור להשתלם" : "צריך להשתלם"} עד ${shortDate(pay.due)}. תודה! 🙏`)}
                >
                  💬
                </a>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>📅 לפי חודש האירוע</h2>
            {months.length === 0 && <div className="muted" style={{ fontSize: 14 }}>אין אירועים עם תאריך.</div>}
            {months.map((m) => (
              <div key={m.month} className="month-row">
                <span className="mm">{monthLabel(m.month)}</span>
                <div className="mbar" title={`שולם ${nis(m.paid)} מתוך ${nis(m.total)}`}>
                  <span className="t" style={{ width: `${(m.total / maxMonth) * 100}%` }}>
                    <span className="p" style={{ width: `${m.total ? (m.paid / m.total) * 100 : 0}%` }} />
                  </span>
                </div>
                <span className="mv">
                  <b>{nis(m.total)}</b>
                  <small>
                    {m.events} אירועים · שולם {nis(m.paid)}
                  </small>
                </span>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>
              📄 הצעות מחיר פתוחות
              <span className="r muted" style={{ fontSize: 13, fontWeight: 500 }}>
                {nis(pipe.total)} · {pipe.count}
              </span>
            </h2>
            {quotes.length === 0 && <div className="muted" style={{ fontSize: 14 }}>אין הצעות מחיר פתוחות.</div>}
            {quotes.map((l) => (
              <div key={l.id} className="trow">
                <Link className="link" href={`/leads/view?id=${l.id}`}>
                  {l.name}
                </Link>
                <span className="muted" style={{ fontSize: 13 }}>
                  {l.event_type}
                  {l.event_date ? ` · ${shortDate(l.event_date)}` : ""}
                </span>
                <b className="ml num">{l.price ? nis(l.price) : "—"}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
