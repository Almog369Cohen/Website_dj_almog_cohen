-- ============================================================
-- Compakt Multi-Tenant SaaS — Security Hardening
-- Tighten public access: client (anon) must not be able to read other DJs' data.
-- ============================================================

-- Remove overly-permissive public read policies
DROP POLICY IF EXISTS dj_songs_public ON public.dj_songs;
DROP POLICY IF EXISTS dj_questions_public ON public.dj_questions;
DROP POLICY IF EXISTS dj_upsells_public ON public.dj_upsells;

-- Remove overly-permissive anon insert policies
DROP POLICY IF EXISTS event_answers_anon_insert ON public.event_answers;
DROP POLICY IF EXISTS event_swipes_anon_insert ON public.event_swipes;
DROP POLICY IF EXISTS event_requests_anon_insert ON public.event_requests;

-- Ensure RLS is enabled
ALTER TABLE public.dj_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dj_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dj_upsells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_requests ENABLE ROW LEVEL SECURITY;

-- Owner-only access for DJ assets
DROP POLICY IF EXISTS dj_songs_owner ON public.dj_songs;
CREATE POLICY dj_songs_owner ON public.dj_songs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS dj_questions_owner ON public.dj_questions;
CREATE POLICY dj_questions_owner ON public.dj_questions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS dj_upsells_owner ON public.dj_upsells;
CREATE POLICY dj_upsells_owner ON public.dj_upsells
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Event data: owner-only (clients will write via API with service role)
DROP POLICY IF EXISTS event_answers_owner ON public.event_answers;
CREATE POLICY event_answers_owner ON public.event_answers
  FOR ALL
  USING (EXISTS (
    SELECT 1
    FROM public.dj_events e
    WHERE e.id = event_answers.event_id
      AND e.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.dj_events e
    WHERE e.id = event_answers.event_id
      AND e.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS event_swipes_owner ON public.event_swipes;
CREATE POLICY event_swipes_owner ON public.event_swipes
  FOR ALL
  USING (EXISTS (
    SELECT 1
    FROM public.dj_events e
    WHERE e.id = event_swipes.event_id
      AND e.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.dj_events e
    WHERE e.id = event_swipes.event_id
      AND e.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS event_requests_owner ON public.event_requests;
CREATE POLICY event_requests_owner ON public.event_requests
  FOR ALL
  USING (EXISTS (
    SELECT 1
    FROM public.dj_events e
    WHERE e.id = event_requests.event_id
      AND e.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.dj_events e
    WHERE e.id = event_requests.event_id
      AND e.user_id = auth.uid()
  ));
