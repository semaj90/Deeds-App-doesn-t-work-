ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile jsonb DEFAULT '{}'::jsonb;
