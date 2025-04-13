import { Effect } from "effect"
import { count, eq } from "drizzle-orm"
import type { LanguageInsert } from "../database/schema"

export class LanguageRepository extends Effect.Service<LanguageRepository>()(
  "app/repositories/LanguageRepository",
  {
    effect: Effect.gen(function* () {
      const drizzle = yield* Drizzle

      const createLanguage = (newValue: Omit<LanguageInsert, "order">) =>
        Effect.gen(function* () {
          const languageCountResult = yield* drizzle.runQuery(
            drizzle.client
              .select({ count: count() })
              .from(tables.language)
              .execute(),
          )
          const languageCount = languageCountResult[0]?.count ?? 0

          return yield* drizzle.runQuery(
            drizzle.client
              .insert(tables.language)
              .values({
                ...newValue,
                order: languageCount + 1,
              })
              .returning(),
          )
        })

      const getAllLanguages = () =>
        drizzle.runQuery(
          drizzle.client.query.language.findMany({
            orderBy: language => language.order,
          }),
        )

      const getLanguageByCode = (code: string) =>
        drizzle.runQuery(
          drizzle.client.query.language.findFirst({
            where: eq(tables.language.code, code),
          }),
        )

      const getLanguageById = (id: string) =>
        drizzle.runQuery(
          drizzle.client.query.language.findFirst({
            where: eq(tables.language.id, id),
          }),
        )

      return {
        createLanguage,
        getAllLanguages,
        getLanguageByCode,
        getLanguageById,
      } as const
    }),
    dependencies: [DatabaseLayer],
  },
) { }

export const LanguageRepositoryLayer = LanguageRepository.Default
