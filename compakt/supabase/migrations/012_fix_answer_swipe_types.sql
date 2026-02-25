-- Migration 012: Fix event_answers and event_swipes column types + add unique constraints
-- Problem: question_id and song_id are typed as uuid, but the app uses text IDs like "q1", "s1", "ethnic_music"
-- Also: missing unique constraints cause upserts to create duplicates instead of updating

-- 1. Change question_id from uuid to text in event_answers
ALTER TABLE event_answers ALTER COLUMN question_id TYPE text USING question_id::text;

-- 2. Change song_id from uuid to text in event_swipes
ALTER TABLE event_swipes ALTER COLUMN song_id TYPE text USING song_id::text;

-- 3. Remove duplicate answers (keep latest per event+question) before adding unique constraint
DELETE FROM event_answers a
USING event_answers b
WHERE a.event_id = b.event_id
  AND a.question_id = b.question_id
  AND a.answered_at < b.answered_at;

-- 4. Remove duplicate swipes (keep latest per event+song) before adding unique constraint
DELETE FROM event_swipes a
USING event_swipes b
WHERE a.event_id = b.event_id
  AND a.song_id = b.song_id
  AND a.swiped_at < b.swiped_at;

-- 5. Add unique constraints for upsert support
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_answers_event_question
  ON event_answers(event_id, question_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_event_swipes_event_song
  ON event_swipes(event_id, song_id);
