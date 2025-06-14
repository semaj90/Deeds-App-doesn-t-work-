import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { cases, criminals, statutes, users } from '$lib/server/db/schema';

export type Case = InferSelectModel<typeof cases>;
export type NewCase = InferInsertModel<typeof cases>;

export type Criminal = InferSelectModel<typeof criminals>;
export type NewCriminal = InferInsertModel<typeof criminals>;

export type Statute = InferSelectModel<typeof statutes>;
// Assuming 'Crime' is a custom type not directly from Drizzle schema, or it needs to be defined.
// For now, I will comment it out as it's causing an error and not defined in schema.ts
// export type Crime = DB_Crime;

export type User = InferSelectModel<typeof users>;

// Type for the user object returned by Auth.js session
export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null; // Assuming role is part of your session user
};