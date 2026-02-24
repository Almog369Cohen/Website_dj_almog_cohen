"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Music2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { DJProfile, PlanTier } from "@/lib/types";

interface DJPublicProfile {
  id: string;
  businessName: string;
  tagline: string | null;
  accentColor: string;
  logoUrl: string | null;
}

export default function DJClientPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [dj, setDJ] = useState<DJPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!supabase || !slug) return;

    async function loadDJ() {
      const { data, error } = await supabase!
        .from("profiles")
        .select("id, business_name, tagline, accent_color, logo_url")
        .eq("dj_slug", slug)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setDJ({
          id: data.id,
          businessName: data.business_name ?? slug,
          tagline: data.tagline ?? null,
          accentColor: data.accent_color ?? "#059cc0",
          logoUrl: data.logo_url ?? null,
        });
      }
      setLoading(false);
    }

    loadDJ();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-dvh gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center max-w-sm"
        >
          <div className="text-4xl mb-3">🎵</div>
          <h1 className="font-display text-xl font-black mb-2">לא נמצא</h1>
          <p className="text-sm text-secondary">
            הדף שחיפשתם לא קיים. בדקו את הלינק ונסו שוב.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!dj) return null;

  // Set CSS custom property for DJ's accent color
  const djStyle = {
    "--dj-accent": dj.accentColor,
    "--dj-accent-light": `${dj.accentColor}20`,
  } as React.CSSProperties;

  return (
    <div className="min-h-dvh gradient-hero" style={djStyle}>
      <div className="max-w-md mx-auto px-4 py-8">
        {/* DJ Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {dj.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dj.logoUrl}
              alt={dj.businessName}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2"
              style={{ borderColor: dj.accentColor }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
              style={{
                background: `${dj.accentColor}15`,
                borderColor: `${dj.accentColor}40`,
              }}
            >
              <Music2 className="w-8 h-8" style={{ color: dj.accentColor }} />
            </div>
          )}
          <h1
            className="font-display text-3xl font-black mb-1"
            style={{ color: dj.accentColor }}
          >
            {dj.businessName}
          </h1>
          {dj.tagline && (
            <p className="text-secondary text-sm">{dj.tagline}</p>
          )}
        </motion.div>

        {/* Client Flow Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 text-center"
        >
          <h2 className="font-display text-lg font-bold mb-2">
            בואו ניצור את המסע המוזיקלי שלכם
          </h2>
          <p className="text-sm text-secondary mb-6">
            ענו על כמה שאלות, סמנו שירים שאתם אוהבים, ובסוף נבנה יחד את הפלייליסט המושלם לאירוע
          </p>
          <button
            className="w-full py-3.5 rounded-2xl font-bold text-white transition-all"
            style={{
              background: `${dj.accentColor}`,
              boxShadow: `0 4px 20px ${dj.accentColor}30`,
            }}
            onClick={() => {
              // TODO: Create event for this DJ and redirect to client flow
              window.location.href = `/event?dj=${dj.id}`;
            }}
          >
            יאללה מתחילים!
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted mt-6"
        >
          Powered by Compakt
        </motion.p>
      </div>
    </div>
  );
}
