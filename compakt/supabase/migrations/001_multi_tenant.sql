-- ============================================================
-- Compakt Multi-Tenant SaaS Schema
-- ============================================================

-- 1. Extend profiles table (may already exist from initial setup)
-- We use CREATE TABLE IF NOT EXISTS and ALTER TABLE ADD COLUMN IF NOT EXISTS
-- to be safe against partial runs.

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text NOT NULL DEFAULT 'dj',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add multi-tenant columns to profiles
DO $$
BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dj_slug text UNIQUE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS logo_url text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#059cc0';
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tagline text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;
END $$;

-- 2. Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('free', 'basic', 'pro')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  coupon_code text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 3. Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  plan text NOT NULL CHECK (plan IN ('basic', 'pro')),
  duration_days integer NOT NULL DEFAULT 30,
  max_uses integer DEFAULT NULL,
  uses_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 4. DJ Events (multi-tenant events)
CREATE TABLE IF NOT EXISTS dj_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL DEFAULT 'wedding',
  couple_name_a text,
  couple_name_b text,
  event_date date,
  venue text,
  city text,
  contact_phone text,
  contact_role text,
  magic_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  current_stage integer DEFAULT 0,
  theme text DEFAULT 'night',
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dj_events_user ON dj_events(user_id);
CREATE INDEX IF NOT EXISTS idx_dj_events_token ON dj_events(magic_token);

-- 5. DJ Songs (per-DJ song library)
CREATE TABLE IF NOT EXISTS dj_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  artist text NOT NULL,
  cover_url text,
  preview_url text,
  clip_start_sec integer,
  clip_end_sec integer,
  external_link text,
  category text NOT NULL DEFAULT 'dancing',
  tags text[] DEFAULT '{}',
  energy integer DEFAULT 3,
  decade text,
  language text DEFAULT 'he',
  is_safe boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dj_songs_user ON dj_songs(user_id);

-- 6. DJ Questions (per-DJ custom questions)
CREATE TABLE IF NOT EXISTS dj_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_he text NOT NULL,
  question_type text NOT NULL DEFAULT 'single_select',
  event_type text NOT NULL DEFAULT 'wedding',
  options jsonb DEFAULT '[]',
  slider_min integer,
  slider_max integer,
  slider_labels jsonb,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dj_questions_user ON dj_questions(user_id);

-- 7. DJ Upsells (per-DJ upsell cards)
CREATE TABLE IF NOT EXISTS dj_upsells (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title_he text NOT NULL,
  description_he text,
  price_hint text,
  cta_text_he text DEFAULT 'לפרטים',
  image_url text,
  placement text DEFAULT 'stage_4',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dj_upsells_user ON dj_upsells(user_id);

-- 8. Event Answers (client responses)
CREATE TABLE IF NOT EXISTS event_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES dj_events(id) ON DELETE CASCADE,
  question_id uuid NOT NULL,
  answer_value jsonb NOT NULL,
  answered_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_answers_event ON event_answers(event_id);

-- 9. Event Swipes (client song swipes)
CREATE TABLE IF NOT EXISTS event_swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES dj_events(id) ON DELETE CASCADE,
  song_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('like', 'dislike', 'super_like', 'unsure')),
  reason_chips text[] DEFAULT '{}',
  swiped_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_swipes_event ON event_swipes(event_id);

-- 10. Event Requests (client special requests)
CREATE TABLE IF NOT EXISTS event_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES dj_events(id) ON DELETE CASCADE,
  request_type text NOT NULL,
  content text NOT NULL,
  moment_type text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_requests_event ON event_requests(event_id);

-- 11. Upsell Clicks tracking
CREATE TABLE IF NOT EXISTS upsell_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES dj_events(id) ON DELETE CASCADE,
  upsell_id uuid NOT NULL,
  clicked_at timestamptz DEFAULT now()
);

-- 12. Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  event_id uuid REFERENCES dj_events(id) ON DELETE SET NULL,
  event_name text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);

-- ============================================================
-- Row-Level Security Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_upsells ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: users can read their own
CREATE POLICY subscriptions_select ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- DJ Events: owners can CRUD, clients can read via magic_token (handled by anon key + function)
CREATE POLICY dj_events_owner ON dj_events FOR ALL USING (auth.uid() = user_id);

-- DJ Songs/Questions/Upsells: owner full access
CREATE POLICY dj_songs_owner ON dj_songs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY dj_questions_owner ON dj_questions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY dj_upsells_owner ON dj_upsells FOR ALL USING (auth.uid() = user_id);

-- Event data: accessible if user owns the parent event
CREATE POLICY event_answers_owner ON event_answers FOR ALL
  USING (EXISTS (SELECT 1 FROM dj_events WHERE dj_events.id = event_answers.event_id AND dj_events.user_id = auth.uid()));

CREATE POLICY event_swipes_owner ON event_swipes FOR ALL
  USING (EXISTS (SELECT 1 FROM dj_events WHERE dj_events.id = event_swipes.event_id AND dj_events.user_id = auth.uid()));

CREATE POLICY event_requests_owner ON event_requests FOR ALL
  USING (EXISTS (SELECT 1 FROM dj_events WHERE dj_events.id = event_requests.event_id AND dj_events.user_id = auth.uid()));

-- Public read for DJ profile (for /dj/[slug] page)
CREATE POLICY profiles_public_read ON profiles FOR SELECT
  USING (dj_slug IS NOT NULL);

-- Public read for DJ songs/questions/upsells (for client-facing pages)
-- These are scoped by looking up the DJ via event → user_id
CREATE POLICY dj_songs_public ON dj_songs FOR SELECT USING (true);
CREATE POLICY dj_questions_public ON dj_questions FOR SELECT USING (true);
CREATE POLICY dj_upsells_public ON dj_upsells FOR SELECT USING (true);

-- Event data: clients can INSERT (for their swipes/answers/requests)
-- via anon key when they have a valid magic_token (enforced in API)
CREATE POLICY event_answers_anon_insert ON event_answers FOR INSERT WITH CHECK (true);
CREATE POLICY event_swipes_anon_insert ON event_swipes FOR INSERT WITH CHECK (true);
CREATE POLICY event_requests_anon_insert ON event_requests FOR INSERT WITH CHECK (true);

-- Coupons: public read (active only), no write from client
CREATE POLICY coupons_public_read ON coupons FOR SELECT USING (is_active = true);

-- ============================================================
-- Auto-create profile on signup trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'dj',
    'free'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Helper function: get monthly event count for a user
-- ============================================================
CREATE OR REPLACE FUNCTION public.monthly_event_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::integer
  FROM dj_events
  WHERE user_id = p_user_id
    AND created_at >= date_trunc('month', now())
    AND is_archived = false;
$$;

-- ============================================================
-- Plan limits helper
-- ============================================================
CREATE OR REPLACE FUNCTION public.plan_event_limit(p_plan text)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_plan
    WHEN 'free' THEN 2
    WHEN 'basic' THEN 8
    WHEN 'pro' THEN 20
    ELSE 2
  END;
$$;
