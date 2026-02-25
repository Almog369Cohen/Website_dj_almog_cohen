"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Music,
  Heart,
  HelpCircle,
  TrendingUp,
  Clock,
  MessageSquare,
  CheckCircle2,
  Inbox,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface KPIs {
  totalEvents: number;
  activeEvents: number;
  completedBriefs: number;
  intakeEvents: number;
  totalSongs: number;
  totalQuestions: number;
  totalSwipes: number;
  totalLikes: number;
  totalAnswers: number;
  totalRequests: number;
  likeRate: number;
}

interface RecentEvent {
  id: string;
  eventType: string;
  names: string;
  venue: string | null;
  eventDate: string | null;
  stage: number;
  status: string;
  createdAt: string;
}

interface DashboardData {
  kpis: KPIs;
  recentEvents: RecentEvent[];
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "חתונה",
  bar_mitzvah: "בר/בת מצווה",
  private: "אירוע פרטי",
  corporate: "עסקי",
  other: "אחר",
};

const STAGE_LABELS = ["טרם התחיל", "שאלות", "שירים", "בקשות", "הושלם"];

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { data: session } = await supabase.auth.getSession();
      const bearer = session.session?.access_token;
      if (!bearer) {
        setError("לא מחובר");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/events/dashboard", {
        headers: { Authorization: `Bearer ${bearer}` },
      });

      if (!res.ok) {
        setError("שגיאה בטעינת הנתונים");
        setLoading(false);
        return;
      }

      const json = await res.json();
      setData(json);
    } catch {
      setError("שגיאה בטעינה");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="glass-card p-12 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-brand-blue" />
        <p className="text-sm text-muted">טוען דשבורד...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-sm text-muted mb-3">{error || "אין נתונים"}</p>
        <button onClick={fetchDashboard} className="btn-secondary text-sm">
          נסה שוב
        </button>
      </div>
    );
  }

  const { kpis, recentEvents } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-blue" />
          דשבורד
        </h2>
        <button
          onClick={fetchDashboard}
          className="btn-secondary text-sm flex items-center gap-1.5 py-2 px-4"
        >
          <RefreshCw className="w-4 h-4" />
          רענן
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="סה״כ אירועים"
          value={kpis.totalEvents}
          color="#059cc0"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="בריפים שהושלמו"
          value={kpis.completedBriefs}
          color="#03b28c"
        />
        <StatCard
          icon={<Music className="w-5 h-5" />}
          label="שירים בספרייה"
          value={kpis.totalSongs}
          color="#8b5cf6"
        />
        <StatCard
          icon={<HelpCircle className="w-5 h-5" />}
          label="שאלות"
          value={kpis.totalQuestions}
          color="#f5c542"
        />
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Heart className="w-5 h-5" />}
          label="סוייפים"
          value={kpis.totalSwipes}
          color="#059cc0"
          subtitle={kpis.likeRate > 0 ? `${kpis.likeRate}% אהבו` : undefined}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="לייקים"
          value={kpis.totalLikes}
          color="#03b28c"
        />
        <StatCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="תשובות"
          value={kpis.totalAnswers}
          color="#d4627a"
        />
        <StatCard
          icon={<Inbox className="w-5 h-5" />}
          label="בקשות"
          value={kpis.totalRequests}
          color="#f97316"
        />
      </div>

      {/* Like Rate Bar */}
      {kpis.totalSwipes > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">אחוז אישור שירים</span>
            <span className="text-sm font-bold" style={{ color: "#03b28c" }}>{kpis.likeRate}%</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${kpis.likeRate}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #059cc0, #03b28c)" }}
            />
          </div>
        </motion.div>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-blue" />
            אירועים אחרונים
          </h3>
          <div className="space-y-3">
            {recentEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-glass"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ev.names}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted">
                      {EVENT_TYPE_LABELS[ev.eventType] ?? ev.eventType}
                    </span>
                    {ev.venue && (
                      <>
                        <span className="text-xs text-muted">·</span>
                        <span className="text-xs text-muted truncate">{ev.venue}</span>
                      </>
                    )}
                    {ev.eventDate && (
                      <>
                        <span className="text-xs text-muted">·</span>
                        <span className="text-xs text-muted">{ev.eventDate}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stage indicator */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: i < ev.stage ? "#03b28c" : "rgba(255,255,255,0.1)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted">
                    {STAGE_LABELS[Math.min(ev.stage, 4)]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-8 text-center text-muted text-sm">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          אין אירועים עדיין — צרו את האירוע הראשון בטאב אירועים
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-4 text-center"
    >
      <div className="flex justify-center mb-2" style={{ color }}>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-muted">{label}</p>
      {subtitle && <p className="text-[10px] text-secondary mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}
