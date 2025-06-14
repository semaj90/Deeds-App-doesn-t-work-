import { pgTable, varchar, text, jsonb, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core'; // Added primaryKey

// Users with roles and bcrypt-hashed passwords
export const users = pgTable('users', { // Renamed table to 'users' for Auth.js compatibility
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(), // Added unique constraint
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  hashedPassword: text('hashed_password'), // Keep this for credentials provider
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const accounts = pgTable(
  'account', // Renamed table to 'account' for Auth.js compatibility
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'), // Changed to snake_case
    access_token: text('access_token'),   // Changed to snake_case
    expires_at: integer('expires_at'),    // Changed to snake_case
    token_type: text('token_type'),       // Changed to snake_case
    scope: text('scope'),
    id_token: text('id_token'),           // Changed to snake_case
    session_state: text('session_state'), // Changed to snake_case
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', { // Renamed table to 'session' for Auth.js compatibility
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Criminals (POIs)
export const criminals = pgTable('criminals', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  aliases: jsonb('aliases').notNull().default('[]'), // array of strings
  priors: jsonb('priors').notNull().default('[]'),   // array of { date, crime, outcome }
  convictions: jsonb('convictions').notNull().default('[]'), // same structure
  threatLevel: varchar('threat_level', { length: 20 }), // e.g. 'Low', 'Medium', etc.
  createdAt: timestamp('created_at').defaultNow(),
});

// Evidence table
export const evidence = pgTable('evidence', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  caseId: integer('case_id').references(() => cases.id),
  poiId: integer('poi_id').references(() => criminals.id),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  fileSize: integer('file_size').notNull(),
  uploadDate: timestamp('upload_date').defaultNow(),
  filePath: text('file_path').notNull(),
  summary: text('summary'),
  tags: jsonb('tags').notNull().default('[]'),
  originalContent: text('original_content'),
});

// Cases
export const cases = pgTable('cases', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  dangerScore: integer('danger_score').default(0),
  aiSummary: text('ai_summary'),
  createdAt: timestamp('created_at').defaultNow(),
  status: varchar('status', { length: 50 }).notNull().default('open'),
});

// Content Embeddings stored separately in Qdrant but indexed here for ref
export const contentEmbeddings = pgTable('content_embeddings', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  contentId: integer('content_id').notNull(), // references evidence.id or lawParagraphs.id
  contentType: varchar('content_type', { length: 50 }).notNull(), // 'evidence' or 'law_paragraph'
  // Store embedding vector as binary or float array, if you want here; but better to keep in Qdrant
  // For example:
  embedding: text('embedding'), // Storing as text for now, actual vector in Qdrant
});

export const statutes = pgTable('statutes', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  code: varchar('code', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  aiSummary: text('ai_summary'),
  tags: jsonb('tags').notNull().default('[]'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const crimes = pgTable('crimes', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  criminalId: integer('criminal_id').references(() => criminals.id),
  statuteId: integer('statute_id').references(() => statutes.id),
  createdAt: timestamp('created_at').defaultNow(),
});
