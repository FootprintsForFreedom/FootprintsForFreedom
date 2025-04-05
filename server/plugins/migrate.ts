import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Effect } from "effect"

export default defineNitroPlugin(() =>
  Effect.gen(function* (_) {
    const db = yield* Drizzle

    yield* Effect.log("Starting database migration...")
    yield* Effect.tryPromise(() => migrate(db.client, { migrationsFolder: "./server/database/migrations" }))
    yield* Effect.log("Database migration completed successfully.")
  })
    .pipe(
      Effect.catchAll(error =>
        Effect.logError(`Database migration failed: ${error instanceof Error ? error.message : String(error)}`),
      ),
    )
    .pipe(RuntimeClient.runPromise),
)
