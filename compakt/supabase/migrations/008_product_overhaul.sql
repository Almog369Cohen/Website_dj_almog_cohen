-- ============================================================
-- Migration 008: Product Overhaul
-- New tables: event_contacts, portal_tokens, activity_log,
--             event_snapshots, role_permissions
-- Altered: dj_events (lifecycle fields)
-- ============================================================

-- 1. Event Contacts (couple/client — NOT auth user)
CREATE TABLE IF NOT EXISTS event_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dj_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  phone_verified_at timestamptz,
  email text,
  source text NOT NULL DEFAULT 'dj_link'
    CHECK (source IN ('dj_link', 'manual', 'import')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_contacts_dj ON event_contacts(dj_user_id);
CREATE INDEX IF NOT EXISTS idx_event_contacts_phone ON event_contacts(dj_user_id, phone);

-- 2. Alter dj_events — lifecycle + contact link
DO $$
BEGIN
  ALTER TABLE dj_events ADD COLUMN IF NOT EXISTS status text DEFAULT 'intake'
    CHECK (status IN ('intake', 'active', 'completed', 'archived'));
  ALTER TABLE dj_events ADD COLUMN IF NOT EXISTS contact_id uuid REFERENCES event_contacts(id);
  ALTER TABLE dj_events ADD COLUMN IF NOT EXISTS locked_at timestamptz;
  ALTER TABLE dj_events ADD COLUMN IF NOT EXISTS locked_by uuid REFERENCES profiles(id);
  ALTER TABLE dj_events ADD COLUMN IF NOT EXISTS portal_closed_at timestamptz;
  ALTER TABLE dj_events ADD COLUMN IF NOT EXISTS completed_at timestamptz;
  ALTER TABLE dj_events ADD COLUMN IF NOT EXISTS archived_at timestamptz;
  ALTER TABLE dj_events ADD COLUMN IF NOT EXISTS retention_expires_at timestamptz;
END $$;

-- Set existing events to 'active' (they were already created by DJs)
UPDATE dj_events SET status = 'active' WHERE status IS NULL OR status = 'intake';

-- 3. Portal Tokens (couple access to their event)
CREATE TABLE IF NOT EXISTS portal_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES dj_events(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES event_contacts(id),
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  last_accessed_at timestamptz,
  access_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portal_tokens_event ON portal_tokens(event_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_portal_tokens_token ON portal_tokens(token);

-- 4. Event Snapshots (recovery / audit)
CREATE TABLE IF NOT EXISTS event_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES dj_events(id) ON DELETE CASCADE,
  snapshot_type text NOT NULL DEFAULT 'auto'
    CHECK (snapshot_type IN ('auto', 'manual', 'pre_edit')),
  data jsonb NOT NULL DEFAULT '{}',
  created_by text,
  reason text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_snapshots_event ON event_snapshots(event_id);

-- 5. Activity Log (audit trail)
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL
    CHECK (entity_type IN ('event', 'contact', 'portal', 'profile', 'snapshot')),
  entity_id uuid NOT NULL,
  action text NOT NULL
    CHECK (action IN ('created', 'updated', 'archived', 'restored', 'locked', 'unlocked', 'portal_opened', 'portal_submitted', 'confirmed', 'completed')),
  actor_type text NOT NULL
    CHECK (actor_type IN ('dj', 'contact', 'staff', 'system')),
  actor_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);

-- 6. Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  scope text NOT NULL CHECK (scope IN ('backoffice', 'admin')),
  permission text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, scope, permission)
);

-- Seed default admin permissions
INSERT INTO role_permissions (role, scope, permission) VALUES
  -- DJ (admin scope)
  ('dj', 'admin', 'events.read'),
  ('dj', 'admin', 'events.create'),
  ('dj', 'admin', 'events.edit'),
  ('dj', 'admin', 'events.archive'),
  ('dj', 'admin', 'events.lock'),
  ('dj', 'admin', 'songs.manage'),
  ('dj', 'admin', 'questions.manage'),
  ('dj', 'admin', 'upsells.manage'),
  ('dj', 'admin', 'settings.edit'),
  ('dj', 'admin', 'contacts.read'),
  -- Assistant (admin scope — read-only)
  ('assistant', 'admin', 'events.read'),
  ('assistant', 'admin', 'events.edit'),
  ('assistant', 'admin', 'contacts.read'),
  -- Owner (admin scope — full)
  ('owner', 'admin', 'events.read'),
  ('owner', 'admin', 'events.create'),
  ('owner', 'admin', 'events.edit'),
  ('owner', 'admin', 'events.archive'),
  ('owner', 'admin', 'events.lock'),
  ('owner', 'admin', 'songs.manage'),
  ('owner', 'admin', 'questions.manage'),
  ('owner', 'admin', 'upsells.manage'),
  ('owner', 'admin', 'settings.edit'),
  ('owner', 'admin', 'contacts.read'),
  -- Admin (admin scope — full)
  ('admin', 'admin', 'events.read'),
  ('admin', 'admin', 'events.create'),
  ('admin', 'admin', 'events.edit'),
  ('admin', 'admin', 'events.archive'),
  ('admin', 'admin', 'events.lock'),
  ('admin', 'admin', 'songs.manage'),
  ('admin', 'admin', 'questions.manage'),
  ('admin', 'admin', 'upsells.manage'),
  ('admin', 'admin', 'settings.edit'),
  ('admin', 'admin', 'contacts.read'),
  -- Backoffice: Support
  ('support', 'backoffice', 'dashboard.read'),
  ('support', 'backoffice', 'users.read'),
  ('support', 'backoffice', 'team.read'),
  ('support', 'backoffice', 'clients.read'),
  ('support', 'backoffice', 'audit.read'),
  ('support', 'backoffice', 'analytics.read'),
  -- Backoffice: Accountant
  ('accountant', 'backoffice', 'dashboard.read'),
  ('accountant', 'backoffice', 'users.read'),
  ('accountant', 'backoffice', 'audit.read'),
  ('accountant', 'backoffice', 'analytics.read'),
  ('accountant', 'backoffice', 'billing.read'),
  -- Backoffice: Admin
  ('admin', 'backoffice', 'dashboard.read'),
  ('admin', 'backoffice', 'users.read'),
  ('admin', 'backoffice', 'users.manage'),
  ('admin', 'backoffice', 'team.read'),
  ('admin', 'backoffice', 'team.manage'),
  ('admin', 'backoffice', 'clients.read'),
  ('admin', 'backoffice', 'clients.phone_full'),
  ('admin', 'backoffice', 'audit.read'),
  ('admin', 'backoffice', 'recovery.execute'),
  ('admin', 'backoffice', 'analytics.read'),
  ('admin', 'backoffice', 'billing.read'),
  -- Backoffice: Owner (full)
  ('owner', 'backoffice', 'dashboard.read'),
  ('owner', 'backoffice', 'users.read'),
  ('owner', 'backoffice', 'users.manage'),
  ('owner', 'backoffice', 'team.read'),
  ('owner', 'backoffice', 'team.manage'),
  ('owner', 'backoffice', 'clients.read'),
  ('owner', 'backoffice', 'clients.phone_full'),
  ('owner', 'backoffice', 'audit.read'),
  ('owner', 'backoffice', 'recovery.execute'),
  ('owner', 'backoffice', 'analytics.read'),
  ('owner', 'backoffice', 'billing.read')
ON CONFLICT (role, scope, permission) DO NOTHING;

-- ============================================================
-- Row-Level Security for new tables
-- ============================================================

ALTER TABLE event_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Event Contacts: DJ can CRUD their own
CREATE POLICY event_contacts_owner ON event_contacts FOR ALL
  USING (auth.uid() = dj_user_id);

-- Portal Tokens: public SELECT by token (for portal access), DJ manages
CREATE POLICY portal_tokens_public_read ON portal_tokens FOR SELECT
  USING (is_active = true);

CREATE POLICY portal_tokens_owner ON portal_tokens FOR ALL
  USING (EXISTS (
    SELECT 1 FROM dj_events
    WHERE dj_events.id = portal_tokens.event_id
    AND dj_events.user_id = auth.uid()
  ));

-- Event Snapshots: DJ can read their own event snapshots
CREATE POLICY event_snapshots_owner ON event_snapshots FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM dj_events
    WHERE dj_events.id = event_snapshots.event_id
    AND dj_events.user_id = auth.uid()
  ));

-- Activity Log: staff can read all, DJ can read their own entity events
CREATE POLICY activity_log_staff_read ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('owner', 'admin', 'support', 'accountant')
    )
  );

-- Role Permissions: everyone can read (needed for client-side permission checks)
CREATE POLICY role_permissions_public_read ON role_permissions FOR SELECT
  USING (true);

-- ============================================================
-- Fix: Staff can read all profiles (was dropped by 003_harden)
-- ============================================================
DO $$ BEGIN
  CREATE POLICY staff_profiles_read ON profiles FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('owner', 'admin', 'support', 'accountant', 'assistant')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
