-- Strengthen handle_new_user trigger with progressive fallbacks.
-- Prevents signup failures when the profiles schema differs between migrations.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_full_name text;
BEGIN
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');

  -- 1) Preferred schema: has email + plan + updated_at
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, plan)
    VALUES (NEW.id, NEW.email, v_full_name, 'dj', 'free')
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      updated_at = now();

    RETURN NEW;
  EXCEPTION
    WHEN undefined_column THEN
      NULL;
  END;

  -- 2) Common schema: has email + updated_at (no plan)
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, v_full_name, 'dj')
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      updated_at = now();

    RETURN NEW;
  EXCEPTION
    WHEN undefined_column THEN
      NULL;
  END;

  -- 3) Older schema: no email/plan columns (full_name + role only)
  BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (NEW.id, v_full_name, 'dj')
    ON CONFLICT (id) DO UPDATE SET
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      role = COALESCE(profiles.role, 'dj');

    RETURN NEW;
  EXCEPTION
    WHEN undefined_column THEN
      -- If even full_name/role are missing (unexpected), don't block signup.
      RETURN NEW;
  END;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
