-- Add DJ internal notes column to dj_events
ALTER TABLE dj_events ADD COLUMN IF NOT EXISTS dj_notes text;
