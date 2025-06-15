import { relations } from "drizzle-orm/relations";
import { users, authenticator, cases, caseEvidence, evidence, session, criminals, crimes, statutes, evidenceTags, tags, account } from "./schema";

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(users, {
		fields: [authenticator.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	authenticators: many(authenticator),
	caseEvidences: many(caseEvidence),
	sessions: many(session),
	cases: many(cases),
	evidences: many(evidence),
	evidenceTags: many(evidenceTags),
	accounts: many(account),
}));

export const caseEvidenceRelations = relations(caseEvidence, ({one}) => ({
	case: one(cases, {
		fields: [caseEvidence.caseId],
		references: [cases.id]
	}),
	evidence: one(evidence, {
		fields: [caseEvidence.evidenceId],
		references: [evidence.id]
	}),
	user: one(users, {
		fields: [caseEvidence.addedBy],
		references: [users.id]
	}),
}));

export const casesRelations = relations(cases, ({one, many}) => ({
	caseEvidences: many(caseEvidence),
	user: one(users, {
		fields: [cases.createdBy],
		references: [users.id]
	}),
	evidences: many(evidence),
}));

export const evidenceRelations = relations(evidence, ({one, many}) => ({
	caseEvidences: many(caseEvidence),
	case: one(cases, {
		fields: [evidence.caseId],
		references: [cases.id]
	}),
	criminal: one(criminals, {
		fields: [evidence.criminalId],
		references: [criminals.id]
	}),
	user: one(users, {
		fields: [evidence.uploadedBy],
		references: [users.id]
	}),
	evidenceTags: many(evidenceTags),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const criminalsRelations = relations(criminals, ({many}) => ({
	evidences: many(evidence),
	crimes: many(crimes),
}));

export const crimesRelations = relations(crimes, ({one}) => ({
	criminal: one(criminals, {
		fields: [crimes.criminalId],
		references: [criminals.id]
	}),
	statute: one(statutes, {
		fields: [crimes.statuteId],
		references: [statutes.id]
	}),
}));

export const statutesRelations = relations(statutes, ({many}) => ({
	crimes: many(crimes),
}));

export const evidenceTagsRelations = relations(evidenceTags, ({one}) => ({
	evidence: one(evidence, {
		fields: [evidenceTags.evidenceId],
		references: [evidence.id]
	}),
	tag: one(tags, {
		fields: [evidenceTags.tagId],
		references: [tags.id]
	}),
	user: one(users, {
		fields: [evidenceTags.assignedBy],
		references: [users.id]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	evidenceTags: many(evidenceTags),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));