-- Add new social links, custom links, and gallery photos to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS soundcloud_url TEXT,
  ADD COLUMN IF NOT EXISTS spotify_url TEXT,
  ADD COLUMN IF NOT EXISTS youtube_url TEXT,
  ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gallery_photos JSONB DEFAULT '[]'::jsonb;

-- custom_links schema: [{ "title": "...", "url": "...", "icon": "music|video|link|headphones" }]
-- gallery_photos schema: [{ "url": "...", "caption": "..." }]
