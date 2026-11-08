"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./repo";
import { DEMO_MEMBERS } from "./seed";

interface Auth {
  email: string | null; // אימייל המשתמש המחובר (באותיות קטנות)
  demo: boolean;
  signOut(): Promise<void>;
  setDemoUser(email: string): void;
}
const Ctx = createContext<Auth | null>(null);
const DEMO_KEY = "rever-demo-user";

/** כניסה עם חשבון גוגל (Supabase Auth). במצב דמו: בחירת משתמש לדוגמה כדי לראות הרשאות. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const sb = supabase();
  const [state, setState] = useState<"loading" | "in" | "out">(sb ? "loading" : "in");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sb) {
      let e = DEMO_MEMBERS[0].id;
      try {
        e = localStorage.getItem(DEMO_KEY) || e;
      } catch {}
      setEmail(e);
      return;
    }
    const apply = (s: { user: { email?: string } } | null) => {
      setEmail(s?.user.email?.toLowerCase() ?? null);
      setState(s ? "in" : "out");
    };
    sb.auth.getSession().then(({ data }) => apply(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => apply(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  const value: Auth = {
    email,
    demo: !sb,
    signOut: async () => {
      if (sb) await sb.auth.signOut();
    },
    setDemoUser: (e) => {
      try {
        localStorage.setItem(DEMO_KEY, e);
      } catch {}
      setEmail(e);
    },
  };

  if (state === "loading" || (state === "in" && !email)) return <div className="empty">טוען…</div>;
  if (state === "out") return <Login />;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const a = useContext(Ctx);
  if (!a) throw new Error("useAuth outside provider");
  return a;
};

function Login() {
  const sb = supabase()!;
  const [err, setErr] = useState("");
  return (
    <div className="loginwrap">
      <div className="modal" style={{ boxShadow: "0 10px 40px rgba(0,0,0,.08)", width: "min(420px,100%)", alignItems: "center", textAlign: "center", gap: 18 }}>
        <div className="logo" style={{ width: 56, height: 56, fontSize: 26 }}>ר</div>
        <div>
          <h3>רבר הפקות</h3>
          <div className="muted" style={{ marginTop: 4 }}>מערכת ניהול · כניסה לצוות</div>
        </div>
        <button
          className="btn gbtn"
          onClick={async () => {
            setErr("");
            const { error } = await sb.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: window.location.origin + "/today", queryParams: { prompt: "select_account" } },
            });
            if (error) setErr(error.message);
          }}
        >
          <GoogleIcon /> כניסה עם Google
        </button>
        {err && <div className="banner err">{err}</div>}
        <div className="muted" style={{ fontSize: 13 }}>הכניסה מותרת רק למשתמשים שגל או ליאל הוסיפו למערכת.</div>
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);
