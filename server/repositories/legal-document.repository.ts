import { Effect } from "effect"
import { eq, and, getTableColumns } from "drizzle-orm"
import type { LegalDocumentContentInsert, LegalDocumentInsert } from "../database/schema"

export class LegalDocumentRepository extends Effect.Service<LegalDocumentRepository>()(
  "app/repositories/LegalDocumentRepository",
  {
    effect: Effect.gen(function* () {
      const drizzle = yield* Drizzle

      const createLegalDocument = (document: LegalDocumentInsert) =>
        drizzle.runQuery(
          drizzle.client
            .insert(tables.legalDocument)
            .values(document)
            .returning(),
        )

      const createLegalDocumentContent = (content: LegalDocumentContentInsert) =>
        drizzle.runQuery(
          drizzle.client
            .insert(tables.legalDocumentContent)
            .values(content)
            .returning(),
        )

      const getLegalDocumentBySlug = (slug: string) =>
        drizzle.runQueryOrNotFound(
          drizzle.client.query.legalDocument.findFirst({
            where: eq(tables.legalDocument.slug, slug),
          }),
          { message: `Legal document with slug ${slug} not found` },
        )

      const getLegalDocumentById = (id: string) =>
        drizzle.runQueryOrNotFound(
          drizzle.client.query.legalDocument.findFirst({
            where: eq(tables.legalDocument.id, id),
          }),
          { message: `Legal document with id ${id} not found` },
        )

      const getLegalDocumentContentById = (id: string) =>
        drizzle.runQueryOrNotFound(
          drizzle.client.query.legalDocumentContent.findFirst({
            where: eq(tables.legalDocumentContent.id, id),
          }),
          { message: `Legal document content with id ${id} not found` },
        )

      const getLegalDocumentContentBySlugAndLanguageId = (
        slug: string,
        languageId: string,
      ) =>
        drizzle.runQueryOrNotFound(
          drizzle.client
            .select({
              ...getTableColumns(tables.legalDocumentContent),
              slug: tables.legalDocument.slug,
            })
            .from(tables.legalDocument)
            .innerJoin(
              tables.legalDocumentContent,
              eq(tables.legalDocument.id, tables.legalDocumentContent.documentId),
            )
            .where(
              and(
                eq(tables.legalDocument.slug, slug),
                eq(tables.legalDocumentContent.languageId, languageId),
              ),
            )
            .limit(1)
            .execute(),
          { message: `Legal document content with slug ${slug} and languageId ${languageId} not found` },
        )

      const getLegalDocumentContentBySlugAndLanguageCode = (
        slug: string,
        languageCode: string,
      ) =>
        drizzle.runQueryOrNotFound(
          drizzle.client
            .select({
              ...getTableColumns(tables.legalDocumentContent),
              slug: tables.legalDocument.slug,
            })
            .from(tables.legalDocument)
            .innerJoin(
              tables.legalDocumentContent,
              eq(tables.legalDocument.id, tables.legalDocumentContent.documentId),
            )
            .innerJoin(
              tables.language,
              eq(tables.language.id, tables.legalDocumentContent.languageId),
            )
            .where(
              and(
                eq(tables.legalDocument.slug, slug),
                eq(tables.language.code, languageCode),
              ),
            )
            .limit(1),
          { message: `Legal document content with slug ${slug} and languageCode ${languageCode} not found` },
        )

      return {
        createLegalDocument,
        createLegalDocumentContent,
        getLegalDocumentBySlug,
        getLegalDocumentById,
        getLegalDocumentContentById,
        getLegalDocumentContentBySlugAndLanguageId,
        getLegalDocumentContentBySlugAndLanguageCode,
      } as const
    }),
    dependencies: [DatabaseLayer],
  },
) { }

export const LegalDocumentRepositoryLayer = LegalDocumentRepository.Default
