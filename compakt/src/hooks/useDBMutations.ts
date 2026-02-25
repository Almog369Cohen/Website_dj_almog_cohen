"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAdminStore } from "@/stores/adminStore";
import type { Song, Question, Upsell } from "@/lib/types";

async function getBearer(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

/**
 * Wraps adminStore mutations with DB persistence.
 * Each mutation updates the local store immediately (optimistic)
 * and then fires an API call in the background.
 */
export function useDBMutations() {
  const addSong = useAdminStore((s) => s.addSong);
  const updateSong = useAdminStore((s) => s.updateSong);
  const deleteSong = useAdminStore((s) => s.deleteSong);
  const reorderSongs = useAdminStore((s) => s.reorderSongs);
  const addQuestion = useAdminStore((s) => s.addQuestion);
  const updateQuestion = useAdminStore((s) => s.updateQuestion);
  const deleteQuestion = useAdminStore((s) => s.deleteQuestion);
  const reorderQuestions = useAdminStore((s) => s.reorderQuestions);
  const addUpsell = useAdminStore((s) => s.addUpsell);
  const updateUpsell = useAdminStore((s) => s.updateUpsell);
  const deleteUpsell = useAdminStore((s) => s.deleteUpsell);

  // ── Songs ──

  const dbAddSong = useCallback(async (song: Omit<Song, "id" | "sortOrder">) => {
    // Optimistic local update
    addSong(song);

    // Persist to DB
    const bearer = await getBearer();
    if (!bearer) return;

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
        body: JSON.stringify(song),
      });
      if (res.ok) {
        const { song: dbSong } = await res.json();
        // Update with the real DB id
        const localSongs = useAdminStore.getState().songs;
        const last = localSongs[localSongs.length - 1];
        if (last && dbSong?.id) {
          updateSong(last.id, { id: dbSong.id });
        }
      }
    } catch (err) {
      console.error("[dbAddSong] API failed:", err);
    }
  }, [addSong, updateSong]);

  const dbUpdateSong = useCallback(async (id: string, data: Partial<Song>) => {
    updateSong(id, data);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      await fetch(`/api/songs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("[dbUpdateSong] API failed:", err);
    }
  }, [updateSong]);

  const dbDeleteSong = useCallback(async (id: string) => {
    deleteSong(id);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      await fetch(`/api/songs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${bearer}` },
      });
    } catch (err) {
      console.error("[dbDeleteSong] API failed:", err);
    }
  }, [deleteSong]);

  // ── Questions ──

  const dbAddQuestion = useCallback(async (question: Omit<Question, "id" | "sortOrder">) => {
    addQuestion(question);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
        body: JSON.stringify(question),
      });
      if (res.ok) {
        const { question: dbQ } = await res.json();
        const localQuestions = useAdminStore.getState().questions;
        const last = localQuestions[localQuestions.length - 1];
        if (last && dbQ?.id) {
          updateQuestion(last.id, { id: dbQ.id });
        }
      }
    } catch (err) {
      console.error("[dbAddQuestion] API failed:", err);
    }
  }, [addQuestion, updateQuestion]);

  const dbUpdateQuestion = useCallback(async (id: string, data: Partial<Question>) => {
    updateQuestion(id, data);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      await fetch(`/api/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("[dbUpdateQuestion] API failed:", err);
    }
  }, [updateQuestion]);

  const dbDeleteQuestion = useCallback(async (id: string) => {
    deleteQuestion(id);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${bearer}` },
      });
    } catch (err) {
      console.error("[dbDeleteQuestion] API failed:", err);
    }
  }, [deleteQuestion]);

  // ── Upsells ──

  const dbAddUpsell = useCallback(async (upsell: Omit<Upsell, "id" | "sortOrder">) => {
    addUpsell(upsell);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      const res = await fetch("/api/upsells", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
        body: JSON.stringify(upsell),
      });
      if (res.ok) {
        const { upsell: dbU } = await res.json();
        const localUpsells = useAdminStore.getState().upsells;
        const last = localUpsells[localUpsells.length - 1];
        if (last && dbU?.id) {
          updateUpsell(last.id, { id: dbU.id });
        }
      }
    } catch (err) {
      console.error("[dbAddUpsell] API failed:", err);
    }
  }, [addUpsell, updateUpsell]);

  const dbUpdateUpsell = useCallback(async (id: string, data: Partial<Upsell>) => {
    updateUpsell(id, data);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      await fetch(`/api/upsells/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("[dbUpdateUpsell] API failed:", err);
    }
  }, [updateUpsell]);

  const dbDeleteUpsell = useCallback(async (id: string) => {
    deleteUpsell(id);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      await fetch(`/api/upsells/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${bearer}` },
      });
    } catch (err) {
      console.error("[dbDeleteUpsell] API failed:", err);
    }
  }, [deleteUpsell]);

  // ── Reorder ──

  const dbReorderSongs = useCallback(async (ids: string[]) => {
    reorderSongs(ids);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      await fetch("/api/songs/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
        body: JSON.stringify({ ids }),
      });
    } catch (err) {
      console.error("[dbReorderSongs] API failed:", err);
    }
  }, [reorderSongs]);

  const dbReorderQuestions = useCallback(async (ids: string[]) => {
    reorderQuestions(ids);

    const bearer = await getBearer();
    if (!bearer) return;

    try {
      await fetch("/api/questions/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
        body: JSON.stringify({ ids }),
      });
    } catch (err) {
      console.error("[dbReorderQuestions] API failed:", err);
    }
  }, [reorderQuestions]);

  return {
    dbAddSong, dbUpdateSong, dbDeleteSong, dbReorderSongs,
    dbAddQuestion, dbUpdateQuestion, dbDeleteQuestion, dbReorderQuestions,
    dbAddUpsell, dbUpdateUpsell, dbDeleteUpsell,
  };
}
