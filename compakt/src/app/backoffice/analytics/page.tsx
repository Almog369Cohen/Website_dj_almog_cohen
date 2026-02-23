"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Calendar, TrendingUp, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PageShell } from "@/components/backoffice/PageShell";
import { KpiCard } from "@/components/backoffice/KpiCard";
import { supabase } from "@/lib/supabase/client";

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  usersLast7d: number;
  usersLast30d: number;
  eventsLast7d: number;
  eventsLast30d: number;
  roleCounts: Record<string, number>;
  dailySignups: { date: string; count: number }[];
}

const ROLE_LABELS: Record<string, string> = {
  dj: "DJ",
  owner: "בעלים",
  admin: "מנהל",
  support: "תמיכה",
  accountant: "רו״ח",
  assistant: "עוזר",
};

async function fetchAnalytics(): Promise<AnalyticsData | null> {
  if (!supabase) return null;
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) return null;

  const res = await fetch("/api/backoffice/analytics", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["backoffice-analytics"],
    queryFn: fetchAnalytics,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <PageShell title="אנליטיקות" description="נתוני שימוש ומוצר">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="סה״כ משתמשים"
          value={data?.totalUsers ?? 0}
          icon={<Users className="w-5 h-5 text-brand-blue" />}
          trend={
            data?.usersLast7d
              ? { value: `+${data.usersLast7d} (7 ימים)`, positive: true }
              : undefined
          }
        />
        <KpiCard
          label="סה״כ אירועים"
          value={data?.totalEvents ?? 0}
          icon={<Calendar className="w-5 h-5 text-brand-blue" />}
          trend={
            data?.eventsLast7d
              ? { value: `+${data.eventsLast7d} (7 ימים)`, positive: true }
              : undefined
          }
        />
        <KpiCard
          label="משתמשים חדשים (30 יום)"
          value={data?.usersLast30d ?? 0}
          icon={<TrendingUp className="w-5 h-5 text-brand-blue" />}
        />
        <KpiCard
          label="אירועים (30 יום)"
          value={data?.eventsLast30d ?? 0}
          icon={<Calendar className="w-5 h-5 text-brand-blue" />}
        />
      </div>

      {/* Daily signups chart */}
      {data?.dailySignups && data.dailySignups.length > 0 && (
        <div className="glass-card p-6 mb-6">
          <h2 className="font-bold text-sm mb-4">הרשמות (14 ימים אחרונים)</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailySignups}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatShortDate}
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelFormatter={(label) => formatShortDate(String(label))}
                />
                <Bar dataKey="count" fill="#059cc0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Role distribution */}
      {data?.roleCounts && Object.keys(data.roleCounts).length > 0 && (
        <div className="glass-card p-6">
          <h2 className="font-bold text-sm mb-4">התפלגות תפקידים</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(data.roleCounts).map(([role, count]) => (
              <div
                key={role}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-glass/50"
              >
                <span className="text-sm font-medium">{ROLE_LABELS[role] ?? role}</span>
                <span className="text-xs text-muted">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
