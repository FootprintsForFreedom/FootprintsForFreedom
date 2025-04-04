import { gelTable, uniqueIndex, foreignKey, uuid, timestamptz, text, smallint, doublePrecision } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"


export const hasCreator = gelTable("HasCreator", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdById: uuid("created_by_id"),
}, (table) => [
	uniqueIndex("326180a4-115d-11f0-8a1e-e9b38cfd08d0;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.createdById],
			foreignColumns: [user.id],
			name: "HasCreator_fk_created_by"
		}),
]);

export const hasTimestamps = gelTable("HasTimestamps", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	created: timestamptz().notNull(),
	modified: timestamptz().notNull(),
}, (table) => [
	uniqueIndex("325dda94-115d-11f0-80e4-c9c1d77e9578;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const user = gelTable("User", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	created: timestamptz().notNull(),
	email: text().notNull(),
	modified: timestamptz().notNull(),
	name: text().notNull(),
}, (table) => [
	uniqueIndex("326001ac-115d-11f0-b051-3382c3b63c9d;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const seedStatus = gelTable("SeedStatus", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	created: timestamptz().notNull(),
	modified: timestamptz().notNull(),
	performedAt: timestamptz("performed_at").notNull(),
	seedName: text("seed_name").notNull(),
}, (table) => [
	uniqueIndex("32690b76-115d-11f0-9a1a-bfd61d88d026;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const hasStatus = gelTable("HasStatus", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	verifiedById: uuid("verified_by_id"),
}, (table) => [
	uniqueIndex("32682c42-115d-11f0-baa5-53a14f945264;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.verifiedById],
			foreignColumns: [user.id],
			name: "HasStatus_fk_verified_by"
		}),
]);

export const hasLocalizedTitle = gelTable("HasLocalizedTitle", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	languageId: uuid("language_id").notNull(),
	slug: text().notNull(),
	title: text().notNull(),
}, (table) => [
	uniqueIndex("3266a73c-115d-11f0-a882-4597bd8f0552;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.languageId],
			foreignColumns: [language.id],
			name: "HasLocalizedTitle_fk_language"
		}),
]);

export const hasTitle = gelTable("HasTitle", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
}, (table) => [
	uniqueIndex("3265bb38-115d-11f0-8c43-5bebe8d0efc5;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const hasDescriptionAndSource = gelTable("HasDescriptionAndSource", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	description: text().notNull(),
	source: text().notNull(),
}, (table) => [
	uniqueIndex("32624a48-115d-11f0-8612-d97dd53e6db4;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const language = gelTable("Language", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	code: text().notNull(),
	created: timestamptz().notNull(),
	modified: timestamptz().notNull(),
	name: text().notNull(),
	nativeName: text("native_name").notNull(),
	order: smallint(),
}, (table) => [
	uniqueIndex("32631af4-115d-11f0-b3e6-d51a07128358;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const hasLanguage = gelTable("HasLanguage", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	languageId: uuid("language_id").notNull(),
}, (table) => [
	uniqueIndex("3264f55e-115d-11f0-99f9-1b26be9f6666;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.languageId],
			foreignColumns: [language.id],
			name: "HasLanguage_fk_language"
		}),
]);

export const hasLocation = gelTable("HasLocation", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	latitude: doublePrecision().notNull(),
	longitude: doublePrecision().notNull(),
}, (table) => [
	uniqueIndex("3267739c-115d-11f0-a47b-e178430facc5;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);
