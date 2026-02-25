"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAdminStore } from "@/stores/adminStore";
import type { Song, Question, Upsell } from "@/lib/types";

/**
 * Fetches the DJ's songs, questions, and upsells from the DB
 * and seeds the adminStore. Call once when admin page mounts.
 */
export function useAdminSync() {
  const didSync = useRef(false);

  const syncFromDB = useCallback(async () => {
    if (!supabase || didSync.current) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      const bearer = session.session?.access_token;
      if (!bearer) return;

      didSync.current = true;

      // Fetch songs
      const songsRes = await fetch("/api/songs", {
        headers: { Authorization: `Bearer ${bearer}` },
      });

      let songCount = 0;
      if (songsRes.ok) {
        const { songs: dbSongs } = (await songsRes.json()) as { songs: DBSong[] };
        songCount = dbSongs?.length ?? 0;
        if (songCount > 0) {
          const mapped: Song[] = dbSongs.map(mapDBSong);
          useAdminStore.getState().setSongs(mapped);
        }
      }

      // Fetch questions
      const questionsRes = await fetch("/api/questions", {
        headers: { Authorization: `Bearer ${bearer}` },
      });

      let questionCount = 0;
      if (questionsRes.ok) {
        const { questions: dbQuestions } = (await questionsRes.json()) as { questions: DBQuestion[] };
        questionCount = dbQuestions?.length ?? 0;
        if (questionCount > 0) {
          const mapped: Question[] = dbQuestions.map(mapDBQuestion);
          useAdminStore.getState().setQuestions(mapped);
        }
      }

      // Fetch upsells
      const upsellsRes = await fetch("/api/upsells", {
        headers: { Authorization: `Bearer ${bearer}` },
      });

      if (upsellsRes.ok) {
        const { upsells: dbUpsells } = (await upsellsRes.json()) as { upsells: DBUpsell[] };
        if (dbUpsells && dbUpsells.length > 0) {
          const mapped: Upsell[] = dbUpsells.map(mapDBUpsell);
          useAdminStore.getState().setUpsells(mapped);
        }
      }

      // Auto-seed defaults if DJ has no questions or songs in DB
      if (songCount === 0 || questionCount === 0) {
        console.log("[useAdminSync] empty tables detected, seeding defaults...");
        try {
          const seedRes = await fetch("/api/admin/seed-defaults", {
            method: "POST",
            headers: { Authorization: `Bearer ${bearer}` },
          });
          if (seedRes.ok) {
            // Re-fetch after seeding
            const [newSongs, newQuestions] = await Promise.all([
              fetch("/api/songs", { headers: { Authorization: `Bearer ${bearer}` } }),
              fetch("/api/questions", { headers: { Authorization: `Bearer ${bearer}` } }),
            ]);
            if (newSongs.ok) {
              const { songs: s } = (await newSongs.json()) as { songs: DBSong[] };
              if (s?.length) useAdminStore.getState().setSongs(s.map(mapDBSong));
            }
            if (newQuestions.ok) {
              const { questions: q } = (await newQuestions.json()) as { questions: DBQuestion[] };
              if (q?.length) useAdminStore.getState().setQuestions(q.map(mapDBQuestion));
            }
          }
        } catch (seedErr) {
          console.error("[useAdminSync] seed-defaults failed:", seedErr);
        }
      }
    } catch (err) {
      console.error("[useAdminSync] sync failed:", err);
    }
  }, []);

  useEffect(() => {
    syncFromDB();
  }, [syncFromDB]);
}

// ── DB → Store mappers ──

interface DBSong {
  id: string;
  title: string;
  artist: string;
  cover_url: string;
  preview_url: string;
  clip_start_sec: number | null;
  clip_end_sec: number | null;
  external_link: string | null;
  category: string;
  tags: string[];
  energy: number | null;
  decade: string | null;
  language: string | null;
  is_safe: boolean;
  sort_order: number;
  is_active: boolean;
}

function mapDBSong(s: DBSong): Song {
  return {
    id: s.id,
    title: s.title,
    artist: s.artist,
    coverUrl: s.cover_url,
    previewUrl: s.preview_url,
    clipStartSec: s.clip_start_sec ?? undefined,
    clipEndSec: s.clip_end_sec ?? undefined,
    externalLink: s.external_link ?? undefined,
    category: s.category as Song["category"],
    tags: s.tags ?? [],
    energy: s.energy ?? 5,
    decade: s.decade ?? undefined,
    language: s.language ?? "he",
    isSafe: s.is_safe,
    sortOrder: s.sort_order,
    isActive: s.is_active,
  };
}

interface DBQuestion {
  id: string;
  question_he: string;
  question_type: string;
  event_type: string | null;
  event_types: string[] | null;
  options: { label: string; value: string }[] | null;
  slider_min: number | null;
  slider_max: number | null;
  slider_labels: { min: string; max: string } | null;
  sort_order: number;
  is_active: boolean;
}

function mapDBQuestion(q: DBQuestion): Question {
  return {
    id: q.id,
    questionHe: q.question_he,
    questionType: q.question_type as Question["questionType"],
    eventType: (q.event_type as Question["eventType"]) ?? undefined,
    eventTypes: (q.event_types as Question["eventTypes"]) ?? undefined,
    options: q.options ?? undefined,
    sliderMin: q.slider_min ?? undefined,
    sliderMax: q.slider_max ?? undefined,
    sliderLabels: q.slider_labels ? [q.slider_labels.min, q.slider_labels.max] : undefined,
    sortOrder: q.sort_order,
    isActive: q.is_active,
  };
}

interface DBUpsell {
  id: string;
  title_he: string;
  description_he: string;
  price_hint: string | null;
  cta_text_he: string | null;
  image_url: string | null;
  placement: string;
  sort_order: number;
  is_active: boolean;
}

function mapDBUpsell(u: DBUpsell): Upsell {
  return {
    id: u.id,
    titleHe: u.title_he,
    descriptionHe: u.description_he,
    priceHint: u.price_hint ?? undefined,
    ctaTextHe: u.cta_text_he ?? "",
    imageUrl: u.image_url ?? undefined,
    placement: u.placement as Upsell["placement"],
    sortOrder: u.sort_order,
    isActive: u.is_active,
  };
}
