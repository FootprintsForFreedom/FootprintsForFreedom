import { Effect } from "effect"
import { drizzle } from "drizzle-orm/node-postgres"
import * as authSchema from "../database/auth-schema"
import * as schema from "../database/schema"

export const tables = {
  ...schema,
  ...authSchema,
}

const { databaseUrl } = useRuntimeConfig()

export const dbClient = drizzle<typeof tables>(databaseUrl, { schema: tables })

export class Drizzle extends Effect.Service<Drizzle>()(
  "app/Drizzle",
  {
    effect: Effect.sync(() => {
      const client = dbClient

      const runQuery = <T>(query: Promise<T>): Effect.Effect<T, SqlError> =>
        Effect.tryPromise({
          try: () => query,
          catch: error =>
            new SqlError({
              message: error instanceof Error ? error.message : String(error),
            }),
        })

      const runQueryOrNotFound = <T>(
        query: Promise<T | undefined | null>,
        options?: { message?: string },
      ): Effect.Effect<T, SqlError | NotFoundError> =>
        Effect.flatMap(runQuery(query), (result) => {
          if (result == null || (Array.isArray(result) && result.length === 0)) {
            return Effect.fail(
              new NotFoundError({
                message: options?.message ?? "Item not found",
              }),
            )
          }
          return Effect.succeed(result)
        })

      return {
        client,
        runQuery,
        runQueryOrNotFound,
      } as const
    }),
  },
) { }

export const DatabaseLayer = Drizzle.Default
