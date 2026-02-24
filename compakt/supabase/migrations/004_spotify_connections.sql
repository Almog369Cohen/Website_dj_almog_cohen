-- ============================================================
-- Compakt Multi-Tenant SaaS — Spotify Connections
-- One Spotify connection per DJ (profiles.id)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.spotify_connections (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  spotify_user_id text,
  access_token text,
  refresh_token text NOT NULL,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.spotify_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS spotify_connections_owner ON public.spotify_connections;
CREATE POLICY spotify_connections_owner ON public.spotify_connections
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_spotify_connections_user_id ON public.spotify_connections(user_id);
