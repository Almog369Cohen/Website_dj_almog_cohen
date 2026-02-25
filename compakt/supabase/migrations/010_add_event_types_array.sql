-- Add event_types array column to dj_questions (supports multi-event-type questions)
ALTER TABLE dj_questions ADD COLUMN IF NOT EXISTS event_types text[] DEFAULT NULL;
