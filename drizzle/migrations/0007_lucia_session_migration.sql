-- Migration to convert from Auth.js session table to Lucia session table format

-- First, rename columns in the session table
ALTER TABLE "session" RENAME COLUMN "sessionToken" TO "id";
ALTER TABLE "session" RENAME COLUMN "expires" TO "expiresAt";

-- Update primary key if needed (shouldn't be needed as primary key column is just renamed)

-- This migration adapts the session table from Auth.js format to Lucia format
-- Auth.js: sessionToken (PK), userId, expires
-- Lucia: id (PK), userId, expiresAt

-- Lucia session migration: convert Auth.js session table to Lucia-compatible format

-- 1. Add new columns to session table
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "id" text PRIMARY KEY NOT NULL;
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "expiresAt" timestamp NOT NULL;

-- 2. Drop old Auth.js columns if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='session' AND column_name='sessionToken') THEN
        ALTER TABLE "session" DROP COLUMN "sessionToken";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='session' AND column_name='expires') THEN
        ALTER TABLE "session" DROP COLUMN "expires";
    END IF;
END$$;

-- 3. Add profile column to users table if not exists
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profile" jsonb;
