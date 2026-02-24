"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { hebrewAuthError } from "@/lib/auth/errors-he";

export default function StaffLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    }>
      <StaffLoginForm />
    </Suspense>
  );
}

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/backoffice";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Restore last-used email from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("compakt-staff-email");
      if (saved) setEmail(saved);
    } catch { }
  }, []);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6 && !loading;
  }, [email, password, loading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSent(false);
    setLoading(true);

    try {
      // All auth + profile read happens server-side (bypasses RLS)
      const res = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const rawText = await res.text();
      let body: any = null;
      if (rawText) {
        try {
          body = JSON.parse(rawText) as any;
        } catch {
          body = null;
        }
      }

      if (!res.ok) {
        if (body?.error === "NOT_STAFF") {
          setError("NOT_STAFF");
        } else {
          const serverMsg = body?.error ? hebrewAuthError(body.error) : null;
          const msg = serverMsg ?? `שגיאת שרת (${res.status}) — נסו שוב`;
          setError(msg);
        }
        return;
      }

      // Save email for next visit
      try { localStorage.setItem("compakt-staff-email", email.trim()); } catch { }

      // Set the session on the client so subsequent pages work
      if (!supabase) {
        setError("שגיאת תצורה — Supabase לא מוגדר");
        return;
      }

      if (!body?.session?.access_token || !body?.session?.refresh_token) {
        setError("שגיאה — לא התקבל session מהשרת");
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: body.session.access_token,
        refresh_token: body.session.refresh_token,
      });

      if (sessionError) {
        setError("שגיאה בשמירת ההתחברות: " + sessionError.message);
        return;
      }

      // Verify session actually persisted before navigating
      const { data: check } = await supabase.auth.getSession();
      if (!check.session) {
        setError("ההתחברות לא נשמרה — נסה שוב");
        return;
      }

      // Use window.location for a full navigation to ensure StaffGuard picks up the new session
      window.location.href = redirectTo;
    } catch (err) {
      setError("שגיאה לא צפויה — " + (err instanceof Error ? err.message : "נסה שוב"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim() || !supabase) {
      setError("הזן אימייל קודם");
      return;
    }

    setError(null);
    setResetSent(false);
    setResetLoading(true);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${origin}/admin/reset-password` }
      );

      if (resetError) {
        setError(hebrewAuthError(resetError.message));
      } else {
        setResetSent(true);
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
          style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }}
        >
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold mb-2">כניסה לצוות</h1>
        <p className="text-sm text-secondary mb-6">התחבר כדי להיכנס ל־Backoffice</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">סיסמה</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error === "NOT_STAFF" && (
            <div className="rounded-xl border border-glass p-4 text-center space-y-3" style={{ background: "rgba(255,68,102,0.08)" }}>
              <p className="text-sm font-semibold">משתמש יקר, כניסה זו לצוות בלבד</p>
              <p className="text-xs text-secondary">נסה להתחבר דרך כניסת ה־DJ / אדמין</p>
              <a
                href="/admin"
                className="btn-primary inline-block px-6 py-2.5 text-sm"
              >
                כניסה לאדמין DJ
              </a>
            </div>
          )}

          {error && error !== "NOT_STAFF" && (
            <div className="text-sm" style={{ color: "var(--accent-danger)" }}>
              {error}
            </div>
          )}

          {resetSent && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--accent-success, #03b28c)" }}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              נשלח מייל לאיפוס סיסמה — בדוק את תיבת המייל
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            התחבר
          </button>

          <button
            type="button"
            onClick={handleResetPassword}
            disabled={resetLoading || !email.trim()}
            className="w-full text-sm text-secondary hover:text-foreground transition-colors flex items-center justify-center gap-2 py-2"
          >
            {resetLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            שכחתי סיסמה
          </button>
        </form>
      </motion.div>
    </div>
  );
}
