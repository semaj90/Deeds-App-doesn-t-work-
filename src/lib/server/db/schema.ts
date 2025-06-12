import { pgTable, serial, text, timestamp, varchar, primaryKey, integer, jsonb, customType } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Define a custom type for pgvector's 'vector' type
const vector = customType<{ data: number[]; driverData: string }>({
    dataType() {
        return 'vector';
    },
    toDriver(value: number[]): string {
        return `[${value.join(',')}]`;
    },
    fromDriver(value: string): number[] {
        return JSON.parse(value);
    }
});
export const userTable = pgTable('user', {
	id: text('id').primaryKey(),
	username: varchar('username', { length: 31 }).notNull().unique(),
	name: text('name'),
	email: text('email').unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
	hashedPassword: text('hashed_password'), // Added for storing hashed passwords
	role: varchar('role', { length: 50 }).notNull().default('user') // Added for user roles, made notNull
});

export const sessionTable = pgTable('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(), // Explicitly define as primary key
	userId: text('userId')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
}); // Removed table-level primary key definition as it's now on the column

export const keyTable = pgTable('account', {
	userId: text('userId')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	type: text('type').notNull(),
	provider: text('provider').notNull(),
	providerAccountId: text('providerAccountId').notNull(),
	refresh_token: text('refresh_token'),
	access_token: text('access_token'),
	expires_at: integer('expires_at'),
	token_type: text('token_type'),
	scope: text('scope'),
	id_token: text('id_token'),
	session_state: text('session_state')
}, (account) => ({
	compoundKey: primaryKey(account.provider, account.providerAccountId)
}));

export const verificationTokensTable = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull().unique(), // Ensure token is unique
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey(vt.identifier, vt.token)
	})
);

// Your existing cases table
export const cases = pgTable('cases', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	title: text('title').notNull(), // Added title field
	summary: text('summary'), // Added summary field
	status: text('status').notNull().default('Open'), // Added status field with default
	dateOpened: timestamp('date_opened', { withTimezone: true, mode: 'date' }).notNull().defaultNow(), // Added dateOpened field
	description: text('description'),
	  verdict: text('verdict'), // New field
	  courtDates: text('court_dates'), // New field (can be JSON string or comma-separated)
	  notes: text('notes'), // New field
	  linkedCriminals: jsonb('linked_criminals').$type<number[]>().default([]), // Store as JSONB array of numbers
	  linkedCrimes: jsonb('linked_crimes').$type<number[]>().default([]), // Store as JSONB array of numbers (assuming crime IDs are numbers)
	  dangerScore: integer('danger_score').default(0), // New field for danger score (0-100%)
	  aiSummary: text('ai_summary'), // New field for AI-generated case summary
	  tags: jsonb('tags').$type<string[]>().default([]), // New field for case tags
 createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
 userId: text('user_id')
 	.notNull()
 	.references(() => userTable.id)
});

export const criminals = pgTable('criminals', {
    id: serial('id').primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    dateOfBirth: timestamp('date_of_birth', { withTimezone: true, mode: 'date' }),
    address: text('address'),
    phone: text('phone'),
    email: text('email'),
    photoUrl: text('photo_url'), // New field
    convictionStatus: text('conviction_status'), // New field
    threatLevel: text('threat_level'), // New field
    sentenceLength: text('sentence_length'), // New field
    convictionDate: timestamp('conviction_date', { withTimezone: true, mode: 'date' }), // New field
	escapeAttempts: integer('escape_attempts').default(0).notNull(), // Changed to integer with default
    gangAffiliations: text('gang_affiliations'), // New field
    notes: text('notes'),
    aliases: jsonb('aliases').$type<string[]>().default([]),
    priors: jsonb('priors').$type<{ date: string, crime: string, outcome: string }[]>().default([]),
    convictions: jsonb('convictions').$type<{ date: string, crime: string, outcome: string }[]>().default([]),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const statutes = pgTable('statutes', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    sectionNumber: text('section_number').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const evidence = pgTable('evidence', {
    id: serial('id').primaryKey(),
    caseId: integer('case_id')
        .references(() => cases.id)
        .notNull(),
	poiId: integer('poi_id').references(() => criminals.id), 
    fileName: text('file_name').notNull(),
	filePath: text('file_path').notNull(), // Should be URL from UploadThing or secure storage
    fileType: text('file_type').notNull(),
    fileSize: integer('file_size').notNull(),
    uploadDate: timestamp('upload_date', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    summary: text('summary'), // AI-generated summary
    tags: jsonb('tags').$type<string[]>().default([]), // AI-generated or manual tags
    originalContent: text('original_content'), // For text-based files
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const lawParagraphs = pgTable('law_paragraphs', {
    id: serial('id').primaryKey(),
    statuteId: integer('statute_id')
        .references(() => statutes.id)
        .notNull(),
    paragraphText: text('paragraph_text').notNull(),
    anchorId: text('anchor_id').notNull().unique(),
    linkedCaseIds: jsonb('linked_case_ids').$type<number[]>().default([]), // Array of case IDs
    crimeSuggestions: jsonb('crime_suggestions').$type<string[]>().default([]), // AI-suggested crimes
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const caseLawLinks = pgTable("case_law_links", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  lawId: integer("law_id").references(() => lawParagraphs.id),
  caseId: integer("case_id").references(() => cases.id),
  paragraphAnchor: text("paragraph_anchor"),
  rationale: text("rationale") // optional
});

export const contentEmbeddings = pgTable('content_embeddings', {
    id: serial('id').primaryKey(),
    contentId: integer('content_id').notNull(), // ID of the content (evidence, law_paragraph)
    contentType: text('content_type').notNull(), // 'evidence' or 'law_paragraph'
    embedding: vector('embedding', { dimensions: 1536 }).notNull(), // Vector embedding for pgvector
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const crimes = pgTable('crimes', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
        statuteId: integer('statute_id') // Changed to integer for FK
        .references(() => statutes.id)
        .notNull(),
        criminalId: integer('criminal_id') // Changed to integer for FK
        .references(() => criminals.id)
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export type User = typeof userTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;

export type Case = typeof cases.$inferSelect;
export type NewCase = typeof cases.$inferInsert;

export type Evidence = typeof evidence.$inferSelect;
export type NewEvidence = typeof evidence.$inferInsert;

export type LawParagraph = typeof lawParagraphs.$inferSelect;
export type NewLawParagraph = typeof lawParagraphs.$inferInsert;

export type ContentEmbedding = typeof contentEmbeddings.$inferSelect;
export type NewContentEmbedding = typeof contentEmbeddings.$inferInsert;

export type Criminal = typeof criminals.$inferSelect;
export type NewCriminal = typeof criminals.$inferInsert;

export type Statute = typeof statutes.$inferSelect;
export type NewStatute = typeof statutes.$inferInsert;

export type Crime = typeof crimes.$inferSelect;
export type NewCrime = typeof crimes.$inferInsert;

export type CaseLawLink = typeof caseLawLinks.$inferSelect;
export type NewCaseLawLink = typeof caseLawLinks.$inferInsert;
