/**
 * Service layer barrel export.
 *
 * Usage in components:
 *   import { useSongService, useSwipeService } from "@/services";
 *
 * Current backend: localStorage (Zustand stores)
 * Future backend:  Supabase — just swap the import source below.
 */

export {
  useSongService,
  useQuestionService,
  useUpsellService,
  useEventService,
  useSwipeService,
  useAnswerService,
  useRequestService,
  useAnalyticsService,
} from "./local";

import { useAuthService as useLocalAuthService } from "./local";
import { useSupabaseAuthService } from "./supabaseAuth";
import { supabase } from "@/lib/supabase/client";

export function useAuthService() {
  return supabase ? useSupabaseAuthService() : useLocalAuthService();
}

// Re-export interface types for consumers that need them
export type {
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
