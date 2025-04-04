import { relations } from "drizzle-orm/relations";
import { user, hasCreator, hasStatus, language, hasLocalizedTitle, hasLanguage } from "./schema";

export const hasCreatorRelations = relations(hasCreator, ({one}) => ({
	user: one(user, {
		fields: [hasCreator.createdById],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	hasCreators: many(hasCreator),
	hasStatuses: many(hasStatus),
}));

export const hasStatusRelations = relations(hasStatus, ({one}) => ({
	user: one(user, {
		fields: [hasStatus.verifiedById],
		references: [user.id]
	}),
}));

export const hasLocalizedTitleRelations = relations(hasLocalizedTitle, ({one}) => ({
	language: one(language, {
		fields: [hasLocalizedTitle.languageId],
		references: [language.id]
	}),
}));

export const languageRelations = relations(language, ({many}) => ({
	hasLocalizedTitles: many(hasLocalizedTitle),
	hasLanguages: many(hasLanguage),
}));

export const hasLanguageRelations = relations(hasLanguage, ({one}) => ({
	language: one(language, {
		fields: [hasLanguage.languageId],
		references: [language.id]
	}),
}));