import { pgTable, integer, varchar, jsonb, timestamp, text, foreignKey, unique, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const criminals = pgTable("criminals", {
	id: integer().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	aliases: jsonb().default([]).notNull(),
	priors: jsonb().default([]).notNull(),
	convictions: jsonb().default([]).notNull(),
	threatLevel: varchar("threat_level", { length: 20 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	firstName: varchar("first_name", { length: 128 }).notNull(),
	lastName: varchar("last_name", { length: 128 }).notNull(),
	photoUrl: text("photo_url"),
	dateOfBirth: timestamp("date_of_birth", { mode: 'string' }),
	address: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 50 }),
	aiAnalysis: jsonb("ai_analysis").default({}),
	notes: text(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const authenticator = pgTable("authenticator", {
	credentialId: text().primaryKey().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: integer().notNull(),
	transports: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "authenticator_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const caseEvidence = pgTable("case_evidence", {
	id: integer().primaryKey().notNull(),
	caseId: text("case_id"),
	evidenceId: integer("evidence_id"),
	addedAt: timestamp("added_at", { mode: 'string' }).defaultNow(),
	addedBy: text("added_by"),
}, (table) => [
	foreignKey({
			columns: [table.caseId],
			foreignColumns: [cases.id],
			name: "case_evidence_case_id_cases_id_fk"
		}),
	foreignKey({
			columns: [table.evidenceId],
			foreignColumns: [evidence.id],
			name: "case_evidence_evidence_id_evidence_id_fk"
		}),
	foreignKey({
			columns: [table.addedBy],
			foreignColumns: [users.id],
			name: "case_evidence_added_by_users_id_fk"
		}),
]);

export const contentEmbeddings = pgTable("content_embeddings", {
	id: integer().primaryKey().notNull(),
	contentId: integer("content_id").notNull(),
	contentType: varchar("content_type", { length: 50 }).notNull(),
	embedding: text(),
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "session_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const cases = pgTable("cases", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	dangerScore: integer("danger_score").default(0),
	aiSummary: text("ai_summary"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	status: varchar({ length: 50 }).default('open').notNull(),
	createdBy: text("created_by"),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "cases_created_by_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	hashedPassword: text("hashed_password"),
	role: varchar({ length: 50 }).default('user').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const statutes = pgTable("statutes", {
	id: integer().primaryKey().notNull(),
	code: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	aiSummary: text("ai_summary"),
	tags: jsonb().default([]).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("statutes_code_unique").on(table.code),
]);

export const evidence = pgTable("evidence", {
	id: integer().primaryKey().notNull(),
	caseId: varchar("case_id", { length: 36 }),
	uploadedBy: text("uploaded_by"),
	title: varchar({ length: 255 }).notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	fileSize: integer("file_size").notNull(),
	uploadedAt: timestamp("uploaded_at", { mode: 'string' }).defaultNow(),
	fileUrl: text("file_url").notNull(),
	aiSummary: text("ai_summary"),
	tags: jsonb().default([]),
	description: text(),
	criminalId: integer("criminal_id"),
}, (table) => [
	foreignKey({
			columns: [table.caseId],
			foreignColumns: [cases.id],
			name: "evidence_case_id_cases_id_fk"
		}),
	foreignKey({
			columns: [table.criminalId],
			foreignColumns: [criminals.id],
			name: "evidence_criminal_id_criminals_id_fk"
		}),
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [users.id],
			name: "evidence_uploaded_by_users_id_fk"
		}),
]);

export const tags = pgTable("tags", {
	id: integer().primaryKey().notNull(),
	name: text().notNull(),
	category: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("tags_name_unique").on(table.name),
]);

export const crimes = pgTable("crimes", {
	id: integer().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	criminalId: integer("criminal_id"),
	statuteId: integer("statute_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.criminalId],
			foreignColumns: [criminals.id],
			name: "crimes_criminal_id_criminals_id_fk"
		}),
	foreignKey({
			columns: [table.statuteId],
			foreignColumns: [statutes.id],
			name: "crimes_statute_id_statutes_id_fk"
		}),
]);

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
]);

export const evidenceTags = pgTable("evidence_tags", {
	evidenceId: integer("evidence_id").notNull(),
	tagId: integer("tag_id").notNull(),
	assignedAt: timestamp("assigned_at", { mode: 'string' }).defaultNow(),
	assignedBy: text("assigned_by"),
}, (table) => [
	foreignKey({
			columns: [table.evidenceId],
			foreignColumns: [evidence.id],
			name: "evidence_tags_evidence_id_evidence_id_fk"
		}),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "evidence_tags_tag_id_tags_id_fk"
		}),
	foreignKey({
			columns: [table.assignedBy],
			foreignColumns: [users.id],
			name: "evidence_tags_assigned_by_users_id_fk"
		}),
	primaryKey({ columns: [table.evidenceId, table.tagId], name: "evidence_tags_evidence_id_tag_id_pk"}),
]);

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "account_userId_users_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
]);
