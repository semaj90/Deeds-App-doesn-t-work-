import { pgTable, serial, text, varchar, integer, jsonb, timestamp, primaryKey } from 'drizzle-orm/pg-core';

// Auth.js compatible users table
export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  hashedPassword: text('hashed_password'),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  profile: jsonb('profile').default('{}'), // Default value for profile
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

export const sessions = pgTable('session', {
  id: text('id').notNull().primaryKey(), // session id
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
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
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 128 }).notNull(),
  lastName: varchar('last_name', { length: 128 }).notNull(),
  photoUrl: text('photo_url'),
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  address: varchar('address', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  aliases: jsonb('aliases').notNull().default('[]'),
  priors: jsonb('priors').notNull().default('[]'),
  convictions: jsonb('convictions').notNull().default('[]'),
  threatLevel: varchar('threat_level', { length: 20 }),
  aiAnalysis: jsonb('ai_analysis').default('{}'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Evidence table
export const evidence = pgTable('evidence', {
  id: integer('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  fileSize: integer('file_size').notNull(),
  criminalId: integer('criminal_id').references(() => criminals.id),
  caseId: varchar('case_id', { length: 36 }).references(() => cases.id), // changed to varchar(36)
  aiSummary: text('ai_summary'),
  tags: jsonb('tags').default('[]'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  uploadedBy: text('uploaded_by').references(() => users.id),
});

// Cases
export const cases = pgTable('cases', {
  id: varchar('id', { length: 36 }).notNull().primaryKey(), // UUID or string, no identity/auto-increment
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  dangerScore: integer('danger_score').default(0),
  aiSummary: text('ai_summary'),
  createdAt: timestamp('created_at').defaultNow(),
  status: varchar('status', { length: 50 }).notNull().default('open'),
  createdBy: text('created_by').references(() => users.id), // Add prosecutor/user reference
});

// Content Embeddings stored separately in Qdrant but indexed here for ref
export const contentEmbeddings = pgTable('content_embeddings', {
  id: integer('id').primaryKey(),
  contentId: integer('content_id').notNull(), // references evidence.id or lawParagraphs.id
  contentType: varchar('content_type', { length: 50 }).notNull(), // 'evidence' or 'law_paragraph'
  embedding: text('embedding'),
});

export const statutes = pgTable('statutes', {
  id: integer('id').primaryKey(),
  code: varchar('code', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  aiSummary: text('ai_summary'),
  tags: jsonb('tags').notNull().default('[]'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const crimes = pgTable('crimes', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  criminalId: integer('criminal_id').references(() => criminals.id),
  statuteId: integer('statute_id').references(() => statutes.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Add joining tables for evidence-case relationships
export const caseEvidence = pgTable('case_evidence', {
  id: integer('id').primaryKey(),
  caseId: text('case_id').references(() => cases.id),
  evidenceId: integer('evidence_id').references(() => evidence.id),
  addedAt: timestamp('added_at').defaultNow(),
  addedBy: text('added_by').references(() => users.id),
});

// Add tags table for evidence and cases
export const tags = pgTable('tags', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const evidenceTags = pgTable('evidence_tags', {
  evidenceId: integer('evidence_id').notNull().references(() => evidence.id),
  tagId: integer('tag_id').notNull().references(() => tags.id),
  assignedAt: timestamp('assigned_at').defaultNow(),
  assignedBy: text('assigned_by').references(() => users.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.evidenceId, table.tagId] }),
}));

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp').notNull(), // boolean as integer (0/1)
    transports: text('transports'),
  }
);

