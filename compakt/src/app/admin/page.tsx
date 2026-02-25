"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPostLoginRedirect } from "@/lib/auth/roles";
import { useAdminStore } from "@/stores/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Music, HelpCircle, Sparkles, LogOut, ChevronLeft, BarChart3, Eye, EyeOff, Loader2, Crown, Calendar, Settings } from "lucide-react";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { hebrewAuthError } from "@/lib/auth/errors-he";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useEventStore } from "@/stores/eventStore";
import { SongManager } from "@/components/admin/SongManager";
import { QuestionManager } from "@/components/admin/QuestionManager";
import { UpsellManager } from "@/components/admin/UpsellManager";
import { Dashboard } from "@/components/admin/Dashboard";
import { EventManager } from "@/components/admin/EventManager";
import { ProfileSettings } from "@/components/admin/ProfileSettings";
import { SetupChecklist } from "@/components/admin/SetupChecklist";
import { useAuthService } from "@/services";
import { useAdminSync } from "@/hooks/useAdminSync";
import { supabase } from "@/lib/supabase/client";
import { useDJStore } from "@/stores/djStore";
import { hasPermission, type AdminPermission } from "@/lib/permissions";
import Link from "next/link";

type AdminTab = "events" | "dashboard" | "songs" | "questions" | "upsells" | "settings";

const ALL_TABS: { id: AdminTab; label: string; icon: React.ReactNode; permission: AdminPermission | null }[] = [
  { id: "events", label: "אירועים", icon: <Calendar className="w-4 h-4" />, permission: "events.read" },
  { id: "dashboard", label: "דשבורד", icon: <BarChart3 className="w-4 h-4" />, permission: null },
  { id: "songs", label: "שירים", icon: <Music className="w-4 h-4" />, permission: "songs.manage" },
  { id: "questions", label: "שאלות", icon: <HelpCircle className="w-4 h-4" />, permission: "questions.manage" },
  { id: "upsells", label: "שדרוגים", icon: <Sparkles className="w-4 h-4" />, permission: "upsells.manage" },
  { id: "settings", label: "הגדרות", icon: <Settings className="w-4 h-4" />, permission: null },
];

export default function AdminPage() {
  useAdminSync();
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const auth = useAuthService();
  const logout = useAdminStore((s) => s.logout);
  const setAuthenticated = useAdminStore((s) => s.setAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("events");
  const theme = useEventStore((s) => s.theme);
  const router = useRouter();
  const djProfile = useDJStore((s) => s.profile);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [userRole, setUserRole] = useState<string>("dj");

  // Fetch user role for permissions
  useEffect(() => {
    if (!supabase || !isAuthenticated) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      supabase!
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile?.role) setUserRole(profile.role);
        });
    });
  }, [isAuthenticated]);

  const visibleTabs = ALL_TABS.filter(
    (tab) => !tab.permission || hasPermission(userRole, "admin", tab.permission)
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(Boolean(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session));
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [setAuthenticated]);

  useEffect(() => {
    if (!supabase) return;
    if (!isAuthenticated) return;

    let cancelled = false;

    (async () => {
      if (auth.fetchProfile) {
        const profile = await auth.fetchProfile();
        if (cancelled) return;
        if (profile && !profile.onboardingComplete) {
          router.replace("/admin/onboarding");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auth, isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBusy(true);
    setErrorMessage(null);
    setResetSent(false);

    const res = await auth.login(email, password);
    if (!res.ok) {
      setError(true);
      setErrorMessage(hebrewAuthError(res.error));
      setTimeout(() => setError(false), 3000);
      setIsBusy(false);
      return;
    }

    const redirect = getPostLoginRedirect(res.role);
    if (redirect !== "/admin") {
      router.push(redirect);
      return;
    }

    if (auth.fetchProfile) {
      const profile = await auth.fetchProfile();
      if (profile && !profile.onboardingComplete) {
        router.replace("/admin/onboarding");
        return;
      }
    }
    setIsBusy(false);
  };

  const handleForgotPassword = async () => {
    setIsBusy(true);
    setErrorMessage(null);
    setResetSent(false);

    const res = await auth.sendPasswordReset(email);
    if (!res.ok) {
      setError(true);
      setErrorMessage(hebrewAuthError(res.error));
      setTimeout(() => setError(false), 3000);
      setIsBusy(false);
      return;
    }

    setResetSent(true);
    setIsBusy(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleLogin}
          className="glass-card p-8 w-full max-w-sm text-center"
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }}
          >
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold mb-1">Compakt Admin</h1>
          <p className="text-sm text-secondary mb-6">התחברו כדי להיכנס</p>

          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="אימייל"
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
              autoComplete="email"
            />
          </div>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              className={`w-full px-4 py-3 rounded-xl bg-transparent border text-sm text-foreground placeholder:text-muted focus:outline-none transition-colors pr-11 ${error ? "border-accent-danger" : "border-glass focus:border-brand-blue"
                }`}
              autoFocus={!email}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
              title={showPassword ? "הסתר" : "הצג"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <PasswordStrength password={password} />
          </div>

          {error && (
            <p className="text-xs mb-3" style={{ color: "var(--accent-danger)" }}>
              {errorMessage ?? "שגיאה"}
            </p>
          )}

          {resetSent && (
            <p className="text-xs mb-3" style={{ color: "var(--accent-success)" }}>
              נשלח מייל לאיפוס סיסמה
            </p>
          )}

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={isBusy}>
            {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            כניסה עם אימייל
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-glass" />
            <span className="text-xs text-muted">או</span>
            <div className="flex-1 h-px bg-glass" />
          </div>

          <button
            type="button"
            onClick={async () => {
              setGoogleBusy(true);
              if (auth.loginWithGoogle) {
                await auth.loginWithGoogle();
              }
              setGoogleBusy(false);
            }}
            disabled={googleBusy}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-glass-strong text-sm font-medium text-secondary hover:text-foreground hover:border-brand-blue/30 transition-all"
          >
            {googleBusy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            התחבר עם Google
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="mt-4 text-sm text-secondary hover:text-foreground transition-colors"
            disabled={isBusy || !email}
          >
            שכחתי סיסמה
          </button>

          <div className="mt-4 pt-4 border-t border-glass">
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 text-sm text-muted hover:text-brand-blue transition-colors"
            >
              <Crown className="w-4 h-4" />
              צפו בחבילות ומחירים
            </Link>
          </div>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-dvh gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-secondary hover:text-foreground flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              חזרה
            </a>
            <h1 className="font-bold text-lg">Compakt Admin</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <nav className="flex gap-1 overflow-x-auto max-w-[60vw] sm:max-w-none">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                    ? "bg-brand-blue text-white"
                    : "text-secondary hover:text-foreground"
                    }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>

            <ThemeToggle />
            <button
              onClick={() => {
                auth.logout();
                logout();
              }}
              className="p-2 rounded-lg text-muted hover:text-foreground transition-colors"
              aria-label="התנתקות"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <SetupChecklist onNavigate={(tab) => setActiveTab(tab as AdminTab)} />
        <AnimatePresence mode="wait">
          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <EventManager />
            </motion.div>
          )}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Dashboard />
            </motion.div>
          )}
          {activeTab === "songs" && (
            <motion.div
              key="songs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SongManager />
            </motion.div>
          )}
          {activeTab === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <QuestionManager />
            </motion.div>
          )}
          {activeTab === "upsells" && (
            <motion.div
              key="upsells"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <UpsellManager />
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProfileSettings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
