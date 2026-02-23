"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/backoffice/PageShell";
import { KpiCard } from "@/components/backoffice/KpiCard";
import { Calendar, Mail, Shield, Clock, FileText, Loader2, ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { hebrewAuthError } from "@/lib/auth/errors-he";

interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  role: string;
  lastSignIn: string | null;
  createdAt: string;
  updatedAt: string;
  eventsCount: number;
  recentEvents: { id: string; token: string; metadata: Record<string, unknown>; created_at: string }[];
}

const ROLE_LABELS: Record<string, string> = {
  owner: "בעלים",
  admin: "מנהל",
  support: "תמיכה",
  accountant: "רו״ח",
  assistant: "עוזר",
  dj: "DJ",
};

async function fetchUser(id: string): Promise<UserDetail | null> {
  if (!supabase) return null;

  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) return null;

  const res = await fetch(`/api/backoffice/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SupportActions({ userId, email }: { userId: string; email: string }) {
  const [isBusy, setIsBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleReset = async () => {
    if (!supabase) return;
    setIsBusy(true);
    setResult(null);

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) {
      setResult({ ok: false, message: "לא מחובר" });
      setIsBusy(false);
      return;
    }

    const res = await fetch(`/api/backoffice/users/${userId}/reset-password`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();
    if (res.ok) {
      setResult({ ok: true, message: `נשלח מייל איפוס ל-${email}` });
    } else {
      setResult({ ok: false, message: body.error ? hebrewAuthError(body.error) : "שגיאה" });
    }
    setIsBusy(false);
    setConfirm(false);
  };

  return (
    <div className="glass-card p-6 mb-6">
      <h2 className="font-bold text-sm mb-4">פעולות תמיכה</h2>

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="btn-secondary text-sm flex items-center gap-2"
          disabled={isBusy}
        >
          <KeyRound className="w-4 h-4" />
          שלח איפוס סיסמה
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-sm text-secondary">לשלוח מייל איפוס ל-{email}?</p>
          <button
            onClick={handleReset}
            disabled={isBusy}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1"
          >
            {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            אישור
          </button>
          <button
            onClick={() => setConfirm(false)}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            ביטול
          </button>
        </div>
      )}

      {result && (
        <p
          className="text-xs mt-3"
          style={{ color: result.ok ? "var(--accent-secondary)" : "var(--accent-danger)" }}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: user, isLoading } = useQuery({
    queryKey: ["backoffice-user", params.id],
    queryFn: () => fetchUser(params.id),
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!user) {
    return (
      <PageShell title="משתמש לא נמצא">
        <div className="glass-card p-8 text-center text-sm text-muted">
          <p>לא הצלחנו למצוא את המשתמש המבוקש</p>
          <Link href="/backoffice/users" className="btn-primary inline-block mt-4 px-6 py-2 text-sm">
            חזרה לרשימה
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={user.fullName || user.email}
      description={ROLE_LABELS[user.role] ?? user.role}
      actions={
        <Link
          href="/backoffice/users"
          className="flex items-center gap-1 text-sm text-secondary hover:text-foreground transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לרשימה
        </Link>
      }
    >
      {/* Profile info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="אימייל"
          value={user.email}
          icon={<Mail className="w-5 h-5 text-brand-blue" />}
        />
        <KpiCard
          label="תפקיד"
          value={ROLE_LABELS[user.role] ?? user.role}
          icon={<Shield className="w-5 h-5 text-brand-blue" />}
        />
        <KpiCard
          label="אירועים"
          value={user.eventsCount}
          icon={<FileText className="w-5 h-5 text-brand-blue" />}
        />
        <KpiCard
          label="התחברות אחרונה"
          value={user.lastSignIn ? formatDate(user.lastSignIn) : "לא התחבר"}
          icon={<Clock className="w-5 h-5 text-brand-blue" />}
        />
      </div>

      {/* Details card */}
      <div className="glass-card p-6 mb-6">
        <h2 className="font-bold text-sm mb-4">פרטים</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted mb-1">ID</p>
            <p className="font-mono text-xs text-secondary break-all">{user.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">נוצר</p>
            <p className="text-secondary">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">עודכן לאחרונה</p>
            <p className="text-secondary">{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Support actions */}
      <SupportActions userId={user.id} email={user.email} />

      {/* Recent events */}
      {user.recentEvents.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="font-bold text-sm mb-4">אירועים אחרונים</h2>
          <div className="space-y-3">
            {user.recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg border border-glass/50"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{event.token}</p>
                    <p className="text-xs text-muted">{formatDate(event.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
