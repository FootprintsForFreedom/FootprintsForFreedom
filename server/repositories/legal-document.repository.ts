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
        drizzle.runQuery(
          drizzle.client.query.legalDocument.findFirst({
            where: eq(tables.legalDocument.slug, slug),
          }),
        )

      const getLegalDocumentById = (id: string) =>
        drizzle.runQuery(
          drizzle.client.query.legalDocument.findFirst({
            where: eq(tables.legalDocument.id, id),
          }),
        )

      const getLegalDocumentContentById = (id: string) =>
        drizzle.runQuery(
          drizzle.client.query.legalDocumentContent.findFirst({
            where: eq(tables.legalDocumentContent.id, id),
          }),
        )

      const getLegalDocumentContentBySlugAndLanguageId = (
        slug: string,
        languageId: string,
      ) =>
        drizzle.runQuery(
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
            .limit(1),
        )

      const getLegalDocumentContentBySlugAndLanguageCode = (
        slug: string,
        languageCode: string,
      ) =>
        drizzle.runQuery(
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

export const LegalDocumentRepositoryLayer = LegalDocumentRepository.DefaultWithoutDependencies
