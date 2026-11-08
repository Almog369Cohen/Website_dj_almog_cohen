"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/repo";
import { isDueToday } from "@/lib/format";

const NAV = [
  { href: "/today", e: "☀️", label: "היום" },
  { href: "/leads", e: "👥", label: "לידים" },
  { href: "/calendar", e: "📅", label: "יומן" },
  { href: "/finance", e: "💰", label: "כספים" },
  { href: "/messages", e: "💬", label: "הודעות" },
  { href: "/settings", e: "⚙️", label: "הגדרות" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { db, settings, mode, toastMsg, error, ready } = useStore();
  const due = db.leads.filter((l) => !["won", "lost"].includes(l.status) && isDueToday(l.next_followup)).length;

  return (
    <AuthGate>
      <div className="app">
        <aside className="side">
          <div className="brand">
            <div className="logo">{(settings.business_name || "R").trim()[0]}</div>
            <div>
              <b>{settings.business_name || "העסק שלי"}</b>
              <small>ניהול לידים</small>
            </div>
          </div>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={"nav" + (path.startsWith(n.href) ? " on" : "")}>
              <span className="e">{n.e}</span>
              {n.label}
              {n.href === "/today" && due > 0 && <span className="cnt">{due}</span>}
            </Link>
          ))}
          <div className="foot">
            {mode === "demo" && <span className="mode">מצב דמו · הנתונים נשמרים בדפדפן</span>}
            <span>{settings.owner_name}</span>
          </div>
        </aside>
        <main className="main">
          {error && <div className="banner err">לא הצלחתי לטעון נתונים: {error}</div>}
          {ready ? children : <div className="empty">טוען…</div>}
        </main>
      </div>
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </AuthGate>
  );
}

/** במצב Supabase: כניסה עם קישור למייל. במצב דמו: אין כניסה. */
function AuthGate({ children }: { children: React.ReactNode }) {
  const sb = supabase();
  const [state, setState] = useState<"loading" | "in" | "out">(sb ? "loading" : "in");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setState(data.session ? "in" : "out"));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setState(s ? "in" : "out"));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  if (state === "in") return <>{children}</>;
  if (state === "loading") return <div className="empty">טוען…</div>;
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <form
        className="modal"
        style={{ boxShadow: "0 10px 40px rgba(0,0,0,.08)" }}
        onSubmit={async (e) => {
          e.preventDefault();
          setErr("");
          const { error } = await sb!.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
          if (error) setErr(error.message);
          else setSent(true);
        }}
      >
        <div className="row">
          <div className="logo">R</div>
          <h3>כניסה למערכת</h3>
        </div>
        {sent ? (
          <p>שלחנו קישור כניסה ל-{email}. פתחו את המייל ולחצו עליו.</p>
        ) : (
          <>
            <div className="f">
              <label>אימייל</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
            </div>
            {err && <div className="banner err">{err}</div>}
            <button className="btn pri">שלחו לי קישור כניסה</button>
          </>
        )}
      </form>
    </div>
  );
}
