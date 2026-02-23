"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, Filter } from "lucide-react";
import { PageShell } from "@/components/backoffice/PageShell";
import { supabase } from "@/lib/supabase/client";

interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  role_changed: "שינוי תפקיד",
  password_reset_sent: "שליחת איפוס סיסמה",
  user_viewed: "צפייה במשתמש",
  staff_access_denied: "גישה נדחתה",
};

const ACTION_COLORS: Record<string, string> = {
  role_changed: "var(--accent-gold)",
  password_reset_sent: "var(--accent-primary)",
  staff_access_denied: "var(--accent-danger)",
};

async function fetchAuditLogs(page: number, action: string) {
  if (!supabase) return { logs: [], total: 0, page: 1, limit: 25 };
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) return { logs: [], total: 0, page: 1, limit: 25 };

  const params = new URLSearchParams({ page: String(page), limit: "25" });
  if (action) params.set("action", action);

  const res = await fetch(`/api/backoffice/audit?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { logs: [], total: 0, page: 1, limit: 25 };
  return res.json() as Promise<{ logs: AuditLog[]; total: number; page: number; limit: number }>;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["backoffice-audit", page, actionFilter],
    queryFn: () => fetchAuditLogs(page, actionFilter),
  });

  const totalPages = Math.ceil((data?.total ?? 0) / 25);

  return (
    <PageShell title="יומן פעולות" description={`${data?.total ?? 0} פעולות מתועדות`}>
      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-4 h-4 text-muted" />
        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}
          className="bg-transparent border border-glass rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-blue"
        >
          <option value="">כל הפעולות</option>
          {Object.entries(ACTION_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Logs */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
          </div>
        ) : (data?.logs.length ?? 0) === 0 ? (
          <div className="text-center py-16 text-sm text-muted">
            אין פעולות מתועדות
          </div>
        ) : (
          <div className="divide-y divide-glass/50">
            {data?.logs.map((log) => (
              <div key={log.id} className="px-4 py-3 flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: ACTION_COLORS[log.action] ?? "var(--text-muted)" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        color: ACTION_COLORS[log.action] ?? "var(--text-muted)",
                        background: `color-mix(in srgb, ${ACTION_COLORS[log.action] ?? "var(--text-muted)"} 12%, transparent)`,
                      }}
                    >
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                    {log.target_id && (
                      <span className="text-xs text-muted font-mono truncate max-w-[120px]">
                        {log.target_id.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <p className="text-xs text-muted mt-1 truncate">
                      {JSON.stringify(log.metadata).substring(0, 80)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted whitespace-nowrap flex-shrink-0">
                  {formatDateTime(log.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg text-muted hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm text-secondary">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-lg text-muted hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </PageShell>
  );
}
