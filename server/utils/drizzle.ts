import { Effect } from "effect"
import { drizzle } from "drizzle-orm/node-postgres"
import * as authSchema from "../database/auth-schema"
import * as schema from "../database/schema"

// Extend the NitroApp type to include _drizzleClient
declare module "nitropack" {
  interface NitroApp {
    _drizzleClient?: ReturnType<typeof drizzle<typeof tables>>
  }
}

export const tables = {
  ...schema,
  ...authSchema,
}

const { databaseUrl } = useRuntimeConfig()

export function useDrizzle() {
  const nitro = useNitroApp()

  if (!nitro._drizzleClient) {
    nitro._drizzleClient = drizzle<typeof tables>(databaseUrl, { schema: tables })
  }

  return nitro._drizzleClient
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
    const client = useDrizzle()

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
