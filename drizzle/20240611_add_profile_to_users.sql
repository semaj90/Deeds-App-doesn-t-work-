-- Drop existing primary key constraint from session table if it exists
DO $$
DECLARE
    pk_name text;
BEGIN
    SELECT constraint_name INTO pk_name
    FROM information_schema.table_constraints
    WHERE table_name = 'session'
      AND constraint_type = 'PRIMARY KEY'
    LIMIT 1;
    IF pk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE session DROP CONSTRAINT %I', pk_name);
    END IF;
END $$;

-- Now add the id column and set it as the new primary key (if not already present)
ALTER TABLE session ADD COLUMN IF NOT EXISTS id text;
ALTER TABLE session ADD COLUMN IF NOT EXISTS "expiresAt" timestamp;

-- Set id as the new primary key
ALTER TABLE session ADD PRIMARY KEY (id);

-- Remove old columns if they exist
ALTER TABLE session DROP COLUMN IF EXISTS "sessionToken";
ALTER TABLE session DROP COLUMN IF EXISTS "expires";

-- Add the profile column to users if not already present
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile jsonb DEFAULT '{}'::jsonb;

-- Drop existing primary key constraint from authenticator table if it exists
DO $$
DECLARE
    pk_name text;
BEGIN
    SELECT constraint_name INTO pk_name
    FROM information_schema.table_constraints
    WHERE table_name = 'authenticator'
      AND constraint_type = 'PRIMARY KEY'
    LIMIT 1;
    IF pk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE authenticator DROP CONSTRAINT %I', pk_name);
    END IF;
END $$;

-- Now add the primary key on credentialID (if not already present)
DO $$
DECLARE
    pk_name text;
BEGIN
    SELECT constraint_name INTO pk_name
    FROM information_schema.table_constraints
    WHERE table_name = 'authenticator'
      AND constraint_type = 'PRIMARY KEY'
    LIMIT 1;
    IF pk_name IS NULL THEN
        EXECUTE 'ALTER TABLE authenticator ADD PRIMARY KEY ("credentialID")';
    END IF;
END $$;
