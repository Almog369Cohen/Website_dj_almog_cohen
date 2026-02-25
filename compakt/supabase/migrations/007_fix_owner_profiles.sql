-- ═══════════════════════════════════════════════════
-- Compakt — Fix Owner Profiles + Schema + Trigger
-- Safe to run multiple times (idempotent)
-- ═══════════════════════════════════════════════════

-- 1. הוסף עמודות חסרות (אם לא קיימות)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dj_slug text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#059cc0';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tagline text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;

-- 2. צור/עדכן פרופילי Owner (UPSERT — בטוח)
INSERT INTO profiles (id, email, full_name, role, plan)
VALUES
  ('9adac9d6-1dea-4c20-937f-f5ec3cdb994d', 'almogmusiccohen@gmail.com', 'Almog Cohen', 'owner', 'pro'),
  ('1a40dcd5-f80f-412d-8658-81bb3b333769', 'almog294@gmail.com', 'Almog', 'owner', 'pro')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  plan = EXCLUDED.plan,
  updated_at = now();

-- 3. ודא שיש unique index על dj_slug (לא ייכשל אם כבר קיים)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'profiles_dj_slug_key') THEN
    BEGIN
      ALTER TABLE profiles ADD CONSTRAINT profiles_dj_slug_key UNIQUE (dj_slug);
    EXCEPTION WHEN duplicate_table THEN
      NULL;
    END;
  END IF;
END $$;

-- 4. תקן את הטריגר (גרסה חזקה עם fallbacks)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_full_name text;
BEGIN
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    ''
  );

  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, plan)
    VALUES (NEW.id, NEW.email, v_full_name, 'dj', 'free')
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      updated_at = now();
    RETURN NEW;
  EXCEPTION
    WHEN undefined_column THEN NULL;
  END;

  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, v_full_name, 'dj')
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      updated_at = now();
    RETURN NEW;
  EXCEPTION
    WHEN undefined_column THEN NULL;
  END;

  BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (NEW.id, v_full_name, 'dj')
    ON CONFLICT (id) DO UPDATE SET
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      role = COALESCE(profiles.role, 'dj');
    RETURN NEW;
  EXCEPTION
    WHEN undefined_column THEN
      RETURN NEW;
  END;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. ודא ש-RLS פעיל + policies נכונות
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY profiles_self_select ON profiles
    FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY profiles_self_update ON profiles
    FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
