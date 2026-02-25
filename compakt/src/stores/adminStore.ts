import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song, Question, Upsell, EventType } from "@/lib/types";
import { defaultSongs } from "@/data/songs";
import { defaultQuestions } from "@/data/questions";
import { defaultUpsells } from "@/data/upsells";

export interface AdminEventTypeConfig {
  id: EventType;
  label: string;
  enabled: boolean;
}

interface AdminStore {
  isAuthenticated: boolean;
  songs: Song[];
  questions: Question[];
  upsells: Upsell[];
  eventTypes: AdminEventTypeConfig[];
  _seededFromServer: boolean;

  // Auth
  login: (password: string) => boolean;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;

  // Seed from server (for client-facing event pages)
  seedFromServer: (data: { songs: Song[]; questions: Question[]; upsells: Upsell[] }) => void;

  // Event types (labels + enabled)
  updateEventType: (id: EventType, data: Partial<AdminEventTypeConfig>) => void;

  // Bulk setters (for DB sync)
  setSongs: (songs: Song[]) => void;
  setQuestions: (questions: Question[]) => void;
  setUpsells: (upsells: Upsell[]) => void;

  // Songs
  addSong: (song: Omit<Song, "id" | "sortOrder">) => void;
  updateSong: (id: string, data: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  reorderSongs: (ids: string[]) => void;

  // Questions
  addQuestion: (question: Omit<Question, "id" | "sortOrder">) => void;
  updateQuestion: (id: string, data: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (ids: string[]) => void;

  // Upsells
  addUpsell: (upsell: Omit<Upsell, "id" | "sortOrder">) => void;
  updateUpsell: (id: string, data: Partial<Upsell>) => void;
  deleteUpsell: (id: string) => void;
}

const ADMIN_PASSWORD = "compakt2024";

const DEFAULT_EVENT_TYPES: AdminEventTypeConfig[] = [
  { id: "wedding", label: "חתונה", enabled: true },
  { id: "bar_mitzvah", label: "בר/בת מצווה", enabled: true },
  { id: "private", label: "אירוע פרטי", enabled: true },
  { id: "corporate", label: "עסקי", enabled: true },
  { id: "other", label: "אחר", enabled: true },
];

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      songs: defaultSongs,
      questions: defaultQuestions,
      upsells: defaultUpsells,
      eventTypes: DEFAULT_EVENT_TYPES,
      _seededFromServer: false,

      login: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      logout: () => set({ isAuthenticated: false }),

      updateEventType: (id, data) => {
        set({
          eventTypes: get().eventTypes.map((t) => (t.id === id ? { ...t, ...data } : t)),
        });
      },

      // Bulk setters
      setSongs: (songs) => set({ songs }),
      setQuestions: (questions) => set({ questions }),
      setUpsells: (upsells) => set({ upsells }),

      // Songs
      addSong: (song) => {
        const { songs } = get();
        set({
          songs: [
            ...songs,
            { ...song, id: crypto.randomUUID(), sortOrder: songs.length + 1 },
          ],
        });
      },

      updateSong: (id, data) => {
        set({
          songs: get().songs.map((s) => (s.id === id ? { ...s, ...data } : s)),
        });
      },

      deleteSong: (id) => {
        set({ songs: get().songs.filter((s) => s.id !== id) });
      },

      reorderSongs: (ids) => {
        const { songs } = get();
        const reordered = ids
          .map((id, i) => {
            const song = songs.find((s) => s.id === id);
            return song ? { ...song, sortOrder: i + 1 } : null;
          })
          .filter(Boolean) as Song[];
        set({ songs: reordered });
      },

      // Questions
      addQuestion: (question) => {
        const { questions } = get();
        set({
          questions: [
            ...questions,
            {
              ...question,
              id: `q${Date.now()}`,
              sortOrder: questions.length + 1,
            },
          ],
        });
      },

      updateQuestion: (id, data) => {
        set({
          questions: get().questions.map((q) =>
            q.id === id ? { ...q, ...data } : q
          ),
        });
      },

      deleteQuestion: (id) => {
        set({ questions: get().questions.filter((q) => q.id !== id) });
      },

      reorderQuestions: (ids) => {
        const { questions } = get();
        const reordered = ids
          .map((id, i) => {
            const q = questions.find((q) => q.id === id);
            return q ? { ...q, sortOrder: i + 1 } : null;
          })
          .filter(Boolean) as Question[];
        set({ questions: reordered });
      },

      // Upsells
      addUpsell: (upsell) => {
        const { upsells } = get();
        set({
          upsells: [
            ...upsells,
            { ...upsell, id: crypto.randomUUID(), sortOrder: upsells.length + 1 },
          ],
        });
      },

      updateUpsell: (id, data) => {
        set({
          upsells: get().upsells.map((u) =>
            u.id === id ? { ...u, ...data } : u
          ),
        });
      },

      deleteUpsell: (id) => {
        set({ upsells: get().upsells.filter((u) => u.id !== id) });
      },

      seedFromServer: (data) => {
        set({
          songs: data.songs,
          questions: data.questions,
          upsells: data.upsells,
          _seededFromServer: true,
        });
      },
    }),
    {
      name: "compakt-admin",
      partialize: (state) => ({
        songs: state.songs,
        questions: state.questions,
        upsells: state.upsells,
        eventTypes: state.eventTypes,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = false;

          // Skip destructive mutations if data was seeded from server
          if (state._seededFromServer) return;

          // Merge event types defaults (so new types like 'other' appear even on old storage)
          const byId: Record<string, AdminEventTypeConfig> = Object.fromEntries(
            (Array.isArray(state.eventTypes) ? state.eventTypes : []).map((t) => [t.id, t])
          );
          state.eventTypes = DEFAULT_EVENT_TYPES.map((d) => ({
            ...d,
            ...(byId[d.id] ?? {}),
          }));

          state.upsells = (Array.isArray(state.upsells) ? state.upsells : []).filter((u) => {
            return u.id !== "u3";
          });

          // Merge in any missing default questions (localStorage may contain an older set)
          const existingIds = new Set(state.questions.map((q) => q.id));
          for (const q of defaultQuestions) {
            if (!existingIds.has(q.id)) {
              state.questions.push(q);
            }
          }

          // Keep specific wedding questions aligned to latest defaults (content/options)
          const defaultById: Record<string, (typeof defaultQuestions)[number]> = Object.fromEntries(
            defaultQuestions.map((q) => [q.id, q])
          );
          for (const id of ["q2", "q3", "q4"]) {
            const existing = state.questions.find((q) => q.id === id);
            const latest = defaultById[id];
            if (existing && latest) {
              existing.questionHe = latest.questionHe;
              existing.questionType = latest.questionType;
              existing.options = latest.options;
              existing.sliderMin = latest.sliderMin;
              existing.sliderMax = latest.sliderMax;
              existing.sliderLabels = latest.sliderLabels;
            }
          }

          const q1 = state.questions.find((q) => q.id === "q1");
          if (q1) {
            q1.questionType = "multi_select";

            const desiredOptions = [
              { label: "חפלה - נסרין המוזמנת הראשית", value: "party" },
              { label: "אפטר של החיים", value: "after" },
              { label: "מיינסטרים של מיאמי", value: "miami_mainstream" },
              { label: "טרנדים ולהיטים חמים", value: "trends_hits" },
              { label: "היפ הופ שחורה / R&B (בשחורהה)", value: "black_rb" },
              { label: "80s funky שלמה ארצי והחברים", value: "shlomo_funky_80s" },
              { label: "שלב את הכל", value: "mix" },
            ];

            const valueMap: Record<string, string> = {
              nostalgic: "party",
              elegant: "miami_mainstream",
              classic_israeli: "shlomo_funky_80s",
            };

            const existing = Array.isArray(q1.options) ? q1.options : [];
            const normalizedExisting = existing
              .map((o) => ({
                ...o,
                value: valueMap[o.value] ?? o.value,
              }))
              .filter((o) => desiredOptions.some((d) => d.value === o.value));

            const merged = desiredOptions.map((d) => {
              const found = normalizedExisting.find((o) => o.value === d.value);
              return found ? { ...found, label: d.label, value: d.value } : d;
            });

            q1.options = merged;
          }

          const q5 = state.questions.find((q) => q.id === "q5");
          if (q5) {
            q5.isActive = false;
          }
        }
      },
    }
  )
);
