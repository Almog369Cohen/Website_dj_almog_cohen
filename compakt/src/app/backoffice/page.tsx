"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Calendar, FileText, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/backoffice/PageShell";
import { KpiCard } from "@/components/backoffice/KpiCard";
import { supabase } from "@/lib/supabase/client";

async function fetchStats() {
  if (!supabase) return { users: 0, events: 0, recentEvents: 0 };

  const [usersRes, eventsRes, recentRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
  ]);

  return {
    users: usersRes.count ?? 0,
    events: eventsRes.count ?? 0,
    recentEvents: recentRes.count ?? 0,
  };
}

export default function BackofficeDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["backoffice-stats"],
    queryFn: fetchStats,
  });

  return (
    <PageShell title="דשבורד" description="סקירה כללית של Compakt">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="משתמשים"
          value={isLoading ? "—" : data?.users ?? 0}
          icon={<Users className="w-5 h-5 text-brand-blue" />}
        />
        <KpiCard
          label="אירועים"
          value={isLoading ? "—" : data?.events ?? 0}
          icon={<Calendar className="w-5 h-5 text-brand-blue" />}
        />
        <KpiCard
          label="אירועים (7 ימים)"
          value={isLoading ? "—" : data?.recentEvents ?? 0}
          icon={<FileText className="w-5 h-5 text-brand-blue" />}
        />
        <KpiCard
          label="שגיאות (היום)"
          value="—"
          icon={<AlertTriangle className="w-5 h-5 text-brand-blue" />}
        />
      </div>

      <div className="glass-card p-6 mt-6 text-center text-sm text-muted">
        <p>גרפים ו-funnels יתווספו ב-Sprint 5 (Analytics PRO)</p>
      </div>
    </PageShell>
  );
}
