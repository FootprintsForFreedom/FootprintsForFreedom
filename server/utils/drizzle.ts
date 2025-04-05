import { Effect } from "effect"
import { drizzle } from "drizzle-orm/node-postgres"
import * as authSchema from "../database/auth-schema"
import * as schema from "../database/schema"

export const tables = {
  ...schema,
  ...authSchema,
}

// Custom SQL error
export class SqlError extends Error {
  constructor(message: string) {
    super(`Drizzle query failed: ${message}`)
    this.name = "SqlError"
  }
}

// Define the service using Effect.Service
export class Drizzle extends Effect.Service<Drizzle>()("app/Drizzle", {
  // Define the effect that creates the service
  effect: Effect.sync(() => {
    const { databaseUrl } = useRuntimeConfig()
    const client = drizzle<typeof tables>(databaseUrl, { schema: tables })

    const runQuery = <T>(query: Promise<T>): Effect.Effect<T, SqlError> =>
      Effect.tryPromise({
        try: () => query,
        catch: error =>
          new SqlError(error instanceof Error ? error.message : String(error)),
      })

    return { client, runQuery } as const
  }),
}) { }

export const DatabaseLayer = Drizzle.Default
