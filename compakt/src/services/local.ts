/**
 * Local (Zustand/localStorage) implementation of all service interfaces.
 * This is the current "backend" — when Supabase is ready, create a
 * parallel `supabase.ts` that implements the same interfaces.
 */

import { useAdminStore } from "@/stores/adminStore";
import { useEventStore } from "@/stores/eventStore";
import type {
  ISongService,
  IQuestionService,
  IUpsellService,
  IEventService,
  ISwipeService,
  IAnswerService,
  IRequestService,
  IAuthService,
  IAnalyticsService,
} from "./types";
import type { Song, SongCategory, Question, Upsell, SwipeAction } from "@/lib/types";

// ── Song Service (local) ──
export function useSongService(): ISongService {
  const songs = useAdminStore((s) => s.songs);
  const addSong = useAdminStore((s) => s.addSong);
  const updateSong = useAdminStore((s) => s.updateSong);
  const deleteSong = useAdminStore((s) => s.deleteSong);
  const reorderSongs = useAdminStore((s) => s.reorderSongs);

  return {
    getAll: () => songs,
    getByCategory: (category: SongCategory) => songs.filter((s) => s.category === category),
    getActive: () => songs.filter((s) => s.isActive),
    getById: (id: string) => songs.find((s) => s.id === id),
    add: (song: Omit<Song, "id" | "sortOrder">) => addSong(song),
    update: (id: string, data: Partial<Song>) => updateSong(id, data),
    remove: (id: string) => deleteSong(id),
    bulkUpdate: (ids: string[], data: Partial<Song>) => {
      ids.forEach((id) => updateSong(id, data));
    },
    bulkRemove: (ids: string[]) => {
      ids.forEach((id) => deleteSong(id));
    },
    reorder: (ids: string[]) => reorderSongs(ids),
  };
}

// ── Question Service (local) ──
export function useQuestionService(): IQuestionService {
  const questions = useAdminStore((s) => s.questions);
  const addQuestion = useAdminStore((s) => s.addQuestion);
  const updateQuestion = useAdminStore((s) => s.updateQuestion);
  const deleteQuestion = useAdminStore((s) => s.deleteQuestion);
  const reorderQuestions = useAdminStore((s) => s.reorderQuestions);

  return {
    getAll: () => questions,
    getActive: () => questions.filter((q) => q.isActive),
    add: (question: Omit<Question, "id" | "sortOrder">) => addQuestion(question),
    update: (id: string, data: Partial<Question>) => updateQuestion(id, data),
    remove: (id: string) => deleteQuestion(id),
    reorder: (ids: string[]) => reorderQuestions(ids),
  };
}

// ── Upsell Service (local) ──
export function useUpsellService(): IUpsellService {
  const upsells = useAdminStore((s) => s.upsells);
  const addUpsell = useAdminStore((s) => s.addUpsell);
  const updateUpsell = useAdminStore((s) => s.updateUpsell);
  const deleteUpsell = useAdminStore((s) => s.deleteUpsell);

  return {
    getAll: () => upsells,
    getActive: () => upsells.filter((u) => u.isActive),
    add: (upsell: Omit<Upsell, "id" | "sortOrder">) => addUpsell(upsell),
    update: (id: string, data: Partial<Upsell>) => updateUpsell(id, data),
    remove: (id: string) => deleteUpsell(id),
  };
}

// ── Event Service (local) ──
export function useEventService(): IEventService {
  const event = useEventStore((s) => s.event);
  const createEvent = useEventStore((s) => s.createEvent);
  const updateEvent = useEventStore((s) => s.updateEvent);
  const setStage = useEventStore((s) => s.setStage);
  const loadEvent = useEventStore((s) => s.loadEvent);
  const reset = useEventStore((s) => s.reset);

  return {
    getCurrent: () => event,
    create: (data) => createEvent(data),
    update: (data) => updateEvent(data),
    setStage: (stage) => setStage(stage),
    load: (token) => loadEvent(token),
    reset: () => reset(),
  };
}

// ── Swipe Service (local) ──
export function useSwipeService(): ISwipeService {
  const swipes = useEventStore((s) => s.swipes);
  const saveSwipe = useEventStore((s) => s.saveSwipe);
  const getSwipe = useEventStore((s) => s.getSwipe);
  const getSwipedSongIds = useEventStore((s) => s.getSwipedSongIds);
  const removeSwipe = useEventStore((s) => s.removeSwipe);
  const setSwipes = useEventStore((s) => s.setSwipes);

  return {
    getAll: () => swipes,
    getForSong: (songId: string) => getSwipe(songId),
    getSwipedIds: () => getSwipedSongIds(),
    save: (songId: string, action: SwipeAction, reasonChips?: string[]) =>
      saveSwipe(songId, action, reasonChips),
    remove: (songId: string) => removeSwipe(songId),
    setAll: (sw) => setSwipes(sw),
  };
}

// ── Answer Service (local) ──
export function useAnswerService(): IAnswerService {
  const answers = useEventStore((s) => s.answers);
  const saveAnswer = useEventStore((s) => s.saveAnswer);
  const getAnswer = useEventStore((s) => s.getAnswer);

  return {
    getAll: () => answers,
    getForQuestion: (questionId: string) => getAnswer(questionId),
    save: (questionId: string, value: string | string[] | number) =>
      saveAnswer(questionId, value),
  };
}

// ── Request Service (local) ──
export function useRequestService(): IRequestService {
  const requests = useEventStore((s) => s.requests);
  const addRequest = useEventStore((s) => s.addRequest);
  const removeRequest = useEventStore((s) => s.removeRequest);

  return {
    getAll: () => requests,
    add: (request) => addRequest(request),
    remove: (id) => removeRequest(id),
  };
}

// ── Auth Service (local) ──
export function useAuthService(): IAuthService {
  const isAuth = useAdminStore((s) => s.isAuthenticated);
  const login = useAdminStore((s) => s.login);
  const logout = useAdminStore((s) => s.logout);

  return {
    isAuthenticated: () => isAuth,
    login: async (_email, password) => {
      const ok = login(password);
      return ok ? { ok: true } : { ok: false, error: "Invalid credentials" };
    },
    sendPasswordReset: async (_email) => ({ ok: false, error: "Not supported" }),
    updatePassword: async (_newPassword) => ({ ok: false, error: "Not supported" }),
    logout: () => logout(),
  };
}

// ── Analytics Service (local) ──
export function useAnalyticsService(): IAnalyticsService {
  const trackEvent = useEventStore((s) => s.trackEvent);
  const trackUpsellClick = useEventStore((s) => s.trackUpsellClick);

  return {
    track: (eventName, metadata) => trackEvent(eventName, metadata),
    trackUpsellClick: (upsellId) => trackUpsellClick(upsellId),
  };
}
