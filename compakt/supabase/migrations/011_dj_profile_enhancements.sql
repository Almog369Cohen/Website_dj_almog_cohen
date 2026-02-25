-- Add new fields for DJ public profile enhancements
ALTER TABLE profiles 
  ADD COLUMN cover_url TEXT,
  ADD COLUMN bio TEXT,
  ADD COLUMN instagram_url TEXT,
  ADD COLUMN tiktok_url TEXT,
  ADD COLUMN website_url TEXT,
  ADD COLUMN whatsapp_number TEXT,
  ADD COLUMN reviews JSONB DEFAULT '[]'::jsonb;
