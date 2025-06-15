DO $$
BEGIN
    ALTER TABLE "authenticator" DROP CONSTRAINT IF EXISTS "authenticator_credentialID_pk";
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;