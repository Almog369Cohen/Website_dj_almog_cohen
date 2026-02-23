"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/backoffice/PageShell";
import { Loader2, Shield, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  owner: "בעלים",
  admin: "מנהל",
  support: "תמיכה",
  accountant: "רו״ח",
  assistant: "עוזר",
};

const ROLE_OPTIONS = [
  { value: "owner", label: "בעלים" },
  { value: "admin", label: "מנהל" },
  { value: "support", label: "תמיכה" },
  { value: "accountant", label: "רו״ח" },
  { value: "assistant", label: "עוזר" },
];

async function fetchTeam(): Promise<{ team: TeamMember[] }> {
  if (!supabase) return { team: [] };
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) return { team: [] };

  const res = await fetch("/api/backoffice/team", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { team: [] };
  return res.json();
}

async function changeRole(userId: string, role: string) {
  if (!supabase) throw new Error("Not configured");
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`/api/backoffice/team/${userId}/role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Failed");
  return body;
}

function TeamRow({ member }: { member: TeamMember }) {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(member.role);
  const [confirm, setConfirm] = useState(false);

  const mutation = useMutation({
    mutationFn: () => changeRole(member.id, selectedRole),
    onSuccess: () => {
      setConfirm(false);
      void queryClient.invalidateQueries({ queryKey: ["backoffice-team"] });
    },
  });

  const hasChange = selectedRole !== member.role;

  return (
    <tr className="border-b border-glass/50">
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium">{member.fullName || "—"}</p>
          <p className="text-xs text-muted">{member.email}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setConfirm(false);
            }}
            className="bg-transparent border border-glass rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-blue"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasChange && !confirm && (
            <button
              onClick={() => setConfirm(true)}
              className="text-xs text-brand-blue hover:underline"
            >
              שמור
            </button>
          )}

          {confirm && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary">
                {ROLE_LABELS[member.role]} → {ROLE_LABELS[selectedRole]}?
              </span>
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="btn-primary text-xs px-3 py-1 flex items-center gap-1"
              >
                {mutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                אישור
              </button>
              <button
                onClick={() => {
                  setConfirm(false);
                  setSelectedRole(member.role);
                }}
                className="text-xs text-muted hover:text-foreground"
              >
                ביטול
              </button>
            </div>
          )}

          {mutation.isError && (
            <span className="text-xs" style={{ color: "var(--accent-danger)" }}>
              {mutation.error?.message ?? "שגיאה"}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-secondary">
        {new Date(member.createdAt).toLocaleDateString("he-IL")}
      </td>
    </tr>
  );
}

export default function TeamPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["backoffice-team"],
    queryFn: fetchTeam,
  });

  return (
    <PageShell title="צוות" description="ניהול אנשי צוות והרשאות">
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
          </div>
        ) : (data?.team.length ?? 0) === 0 ? (
          <div className="text-center py-16 text-sm text-muted">
            <Shield className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>אין אנשי צוות עדיין</p>
            <p className="text-xs mt-1">הגדירו role לאיש צוות דרך Supabase Dashboard</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glass">
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">שם</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">תפקיד</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">נוצר</th>
                </tr>
              </thead>
              <tbody>
                {data?.team.map((member) => (
                  <TeamRow key={member.id} member={member} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass-card p-4 mt-4 text-xs text-muted">
        <p>💡 רק בעלים יכול לקדם לאדמין/בעלים. שינוי תפקיד מתועד ביומן הפעולות.</p>
      </div>
    </PageShell>
  );
}
