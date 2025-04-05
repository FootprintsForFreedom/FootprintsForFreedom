import { pgEnum, smallint, doublePrecision, boolean, pgTable,
  varchar, timestamp, text, uuid, geometry, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { user } from "./auth-schema"

// Enums
export const roleEnum = pgEnum("role", ["User", "Moderator", "Admin"])
export const versionStatusEnum = pgEnum("version_status", ["draft", "pending_verification", "approved", "changes_requested", "rejected"])
export const mediaFileTypesEnum = pgEnum("media_file_types", ["Image", "Video", "Audio", "Document"])

export const seedStatus = pgTable("seed_status", {
  seedName: varchar("seed_name").notNull().unique(),
  performedAt: timestamp("performed_at").notNull().defaultNow(),
  created: timestamp("created").notNull().defaultNow(),
  modified: timestamp("modified").notNull().defaultNow().$onUpdateFn(() => new Date()),
})

export const language = pgTable("language", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull().unique(),
  native_name: text("native_name").notNull().unique(),
  order: smallint("order").unique(),
  created: timestamp("created", { withTimezone: true }).notNull().defaultNow(),
  modified: timestamp("modified", { withTimezone: true }).notNull().defaultNow(),
})

export const languageRelations = relations(language, ({ many }) => ({
  legalDocumentContents: many(legalDocumentContent),
  placeVersions: many(placeVersion),
  mediaVersions: many(mediaVersion),
}))

export const legalDocument = pgTable("legal_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  created: timestamp("created", { withTimezone: true }).notNull().defaultNow(),
  modified: timestamp("modified", { withTimezone: true }).notNull().defaultNow(),
})

export const legalDocumentRelations = relations(legalDocument, ({ many }) => ({
  contents: many(legalDocumentContent),
}))

export const legalDocumentContent = pgTable("legal_document_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull().references(() => legalDocument.id),
  languageId: uuid("language_id").notNull().references(() => language.id),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  content: text("content").notNull(),
  created: timestamp("created", { withTimezone: true }).notNull().defaultNow(),
  modified: timestamp("modified", { withTimezone: true }).notNull().defaultNow(),
})

export const legalDocumentContentRelations = relations(legalDocumentContent, ({ one }) => ({
  document: one(legalDocument, {
    fields: [legalDocumentContent.documentId],
    references: [legalDocument.id],
  }),
  language: one(language, {
    fields: [legalDocumentContent.languageId],
    references: [language.id],
  }),
}))

export const place = pgTable("place",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    location: geometry("location", { type: "point", mode: "xy", srid: 4326 }).notNull(),
    created: timestamp("created", { withTimezone: true }).notNull().defaultNow(),
    modified: timestamp("modified", { withTimezone: true }).notNull().defaultNow(),
  },
  t => [
    index("spatial_index").using("gist", t.location),
  ],
)

export const placeRelations = relations(place, ({ many }) => ({
  versions: many(placeVersion),
  media: many(media),
}))

export const placeVersion = pgTable("place_version", {
  id: uuid("id").primaryKey().defaultRandom(),
  placeId: uuid("place_id").notNull().references(() => place.id),
  languageId: uuid("language_id").notNull().references(() => language.id),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  source: text("source").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  status: versionStatusEnum("status").notNull().default("draft"),
  verifiedById: uuid("verified_by_id").references(() => user.id),
  createdById: uuid("created_by_id").references(() => user.id),
  created: timestamp("created", { withTimezone: true }).notNull().defaultNow(),
  modified: timestamp("modified", { withTimezone: true }).notNull().defaultNow(),
})

export const placeVersionRelations = relations(placeVersion, ({ one, many }) => ({
  place: one(place, {
    fields: [placeVersion.placeId],
    references: [place.id],
  }),
  language: one(language, {
    fields: [placeVersion.languageId],
    references: [language.id],
  }),
  verifiedBy: one(user, {
    fields: [placeVersion.verifiedById],
    references: [user.id],
  }),
  createdBy: one(user, {
    fields: [placeVersion.createdById],
    references: [user.id],
  }),
  changeRequests: many(placeVersionChangeRequests),
}))

export const mediaFile = pgTable("media_file", {
  id: uuid("id").primaryKey().defaultRandom(),
  filePath: text("file_path").notNull(),
  type: mediaFileTypesEnum("type").notNull(),
})

export const mediaFileRelations = relations(mediaFile, ({ many }) => ({
  media: many(media),
  mediaVersions: many(mediaVersion),
}))

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  fileId: uuid("file_id").notNull().references(() => mediaFile.id),
  placeId: uuid("place_id").notNull().references(() => place.id),
  created: timestamp("created", { withTimezone: true }).notNull().defaultNow(),
  modified: timestamp("modified", { withTimezone: true }).notNull().defaultNow(),
})

export const mediaRelations = relations(media, ({ one, many }) => ({
  file: one(mediaFile, {
    fields: [media.fileId],
    references: [mediaFile.id],
  }),
  place: one(place, {
    fields: [media.placeId],
    references: [place.id],
  }),
  versions: many(mediaVersion),
}))

export const mediaVersion = pgTable("media_version", {
  id: uuid("id").primaryKey().defaultRandom(),
  mediaId: uuid("media_id").notNull().references(() => media.id),
  fileId: uuid("file_id").references(() => mediaFile.id),
  languageId: uuid("language_id").notNull().references(() => language.id),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  source: text("source").notNull(),
  status: versionStatusEnum("status").notNull().default("draft"),
  verifiedById: uuid("verified_by_id").references(() => user.id),
  createdById: uuid("created_by_id").references(() => user.id),
  created: timestamp("created", { withTimezone: true }).notNull().defaultNow(),
  modified: timestamp("modified", { withTimezone: true }).notNull().defaultNow(),
})

export const mediaVersionRelations = relations(mediaVersion, ({ one, many }) => ({
  media: one(media, {
    fields: [mediaVersion.mediaId],
    references: [media.id],
  }),
  file: one(mediaFile, {
    fields: [mediaVersion.fileId],
    references: [mediaFile.id],
  }),
  language: one(language, {
    fields: [mediaVersion.languageId],
    references: [language.id],
  }),
  verifiedBy: one(user, {
    fields: [mediaVersion.verifiedById],
    references: [user.id],
  }),
  createdBy: one(user, {
    fields: [mediaVersion.createdById],
    references: [user.id],
  }),
  changeRequests: many(mediaVersionChangeRequests),
}))

export const changeRequest = pgTable("change_request", {
  id: uuid("id").primaryKey().defaultRandom(),
  reason: text("reason").notNull(),
  resolved: boolean("resolved").notNull().default(false),
  createdById: uuid("created_by_id").references(() => user.id),
  created: timestamp("created", { withTimezone: true }).notNull().defaultNow(),
  modified: timestamp("modified", { withTimezone: true }).notNull().defaultNow(),
})

export const changeRequestRelations = relations(changeRequest, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [changeRequest.createdById],
    references: [user.id],
  }),
  placeVersionLinks: many(placeVersionChangeRequests),
  mediaVersionLinks: many(mediaVersionChangeRequests),
}))

export const placeVersionChangeRequests = pgTable("place_version_change_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  changeRequestId: uuid("change_request_id").notNull().references(() => changeRequest.id),
  placeVersionId: uuid("place_version_id").notNull().references(() => placeVersion.id),
})

export const placeVersionChangeRequestsRelations = relations(placeVersionChangeRequests, ({ one }) => ({
  changeRequest: one(changeRequest, {
    fields: [placeVersionChangeRequests.changeRequestId],
    references: [changeRequest.id],
  }),
  placeVersion: one(placeVersion, {
    fields: [placeVersionChangeRequests.placeVersionId],
    references: [placeVersion.id],
  }),
}))

export const mediaVersionChangeRequests = pgTable("media_version_change_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  changeRequestId: uuid("change_request_id").notNull().references(() => changeRequest.id),
  mediaVersionId: uuid("media_version_id").notNull().references(() => mediaVersion.id),
})

export const mediaVersionChangeRequestsRelations = relations(mediaVersionChangeRequests, ({ one }) => ({
  changeRequest: one(changeRequest, {
    fields: [mediaVersionChangeRequests.changeRequestId],
    references: [changeRequest.id],
  }),
  mediaVersion: one(mediaVersion, {
    fields: [mediaVersionChangeRequests.mediaVersionId],
    references: [mediaVersion.id],
  }),
}))
