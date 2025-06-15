ALTER TABLE "session" RENAME COLUMN "sessionToken" TO "id";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "expires" TO "expiresAt";