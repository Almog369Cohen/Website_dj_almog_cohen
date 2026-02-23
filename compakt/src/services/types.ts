/**
 * Service layer interfaces.
 * Current implementation: localStorage via Zustand.
 * Future implementation: Supabase client.
 *
 * Components should import from services/ instead of directly
 * accessing stores for any data that will eventually live in a DB.
 */

import type {
  Song,
  SongCategory,
  Question,
  Upsell,
  EventData,
  SongSwipe,
  SwipeAction,
  QuestionAnswer,
  EventRequest,
} from "@/lib/types";

// ── Song Service ──
export interface ISongService {
  getAll(): Song[];
  getByCategory(category: SongCategory): Song[];
  getActive(): Song[];
  getById(id: string): Song | undefined;
  add(song: Omit<Song, "id" | "sortOrder">): void;
  update(id: string, data: Partial<Song>): void;
  remove(id: string): void;
  bulkUpdate(ids: string[], data: Partial<Song>): void;
  bulkRemove(ids: string[]): void;
  reorder(ids: string[]): void;
}

// ── Question Service ──
export interface IQuestionService {
  getAll(): Question[];
  getActive(): Question[];
  add(question: Omit<Question, "id" | "sortOrder">): void;
  update(id: string, data: Partial<Question>): void;
  remove(id: string): void;
  reorder(ids: string[]): void;
}

// ── Upsell Service ──
export interface IUpsellService {
  getAll(): Upsell[];
  getActive(): Upsell[];
  add(upsell: Omit<Upsell, "id" | "sortOrder">): void;
  update(id: string, data: Partial<Upsell>): void;
  remove(id: string): void;
}

// ── Event Service ──
export interface IEventService {
  getCurrent(): EventData | null;
  create(data: Partial<EventData>): string; // returns magic token
  update(data: Partial<EventData>): void;
  setStage(stage: number): void;
  load(token: string): boolean;
  reset(): void;
}

// ── Swipe Service ──
export interface ISwipeService {
  getAll(): SongSwipe[];
  getForSong(songId: string): SongSwipe | undefined;
  getSwipedIds(): string[];
  save(songId: string, action: SwipeAction, reasonChips?: string[]): void;
  remove(songId: string): void;
  setAll(swipes: SongSwipe[]): void;
}

// ── Answer Service ──
export interface IAnswerService {
  getAll(): QuestionAnswer[];
  getForQuestion(questionId: string): QuestionAnswer | undefined;
  save(questionId: string, value: string | string[] | number): void;
}

// ── Request Service ──
export interface IRequestService {
  getAll(): EventRequest[];
  add(request: Omit<EventRequest, "id" | "eventId" | "createdAt">): void;
  remove(id: string): void;
}

// ── Auth Service ──
export interface IAuthService {
  isAuthenticated(): boolean;
  login(email: string, password: string): Promise<{ ok: true; role?: string } | { ok: false; error: string }>;
  sendPasswordReset(email: string): Promise<{ ok: true } | { ok: false; error: string }>;
  updatePassword(newPassword: string): Promise<{ ok: true } | { ok: false; error: string }>;
  logout(): void;
}

// ── Analytics Service ──
export interface IAnalyticsService {
  track(eventName: string, metadata?: Record<string, unknown>): void;
  trackUpsellClick(upsellId: string): void;
}
