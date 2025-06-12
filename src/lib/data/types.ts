import type { Case as DB_Case, Criminal as DB_Criminal, Statute as DB_Statute, Crime as DB_Crime, NewCriminal as DB_NewCriminal, NewCase as DB_NewCase, User as DB_User } from '$lib/server/db/schema';

// Define the Case type directly, incorporating all necessary properties
export type Case = DB_Case;
export type NewCase = DB_NewCase; // Explicitly export NewCase

export type Criminal = DB_Criminal;
export type NewCriminal = DB_NewCriminal; // Explicitly export NewCriminal
export type Statute = DB_Statute;
export type Crime = DB_Crime;
export type User = DB_User; // Export the User type