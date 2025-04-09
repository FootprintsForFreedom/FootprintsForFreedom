import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Effect } from "effect"

export default defineTask({
  meta: {
    name: "db:migrate",
    description: "Run database migrations",
  },
  run: async () => {
    const program = Effect.gen(function* (_) {
      const db = yield* Drizzle

      yield* Effect.log("Starting database migration...")
      yield* Effect.tryPromise({
        try: () => migrate(db.client, { migrationsFolder: "./server/database/migrations" }),
        catch: error => new Error(error instanceof Error ? error.message : String(error)),
      })
      yield* Effect.log("Database migration completed successfully.")
    })
      .pipe(
        Effect.catchAll(error =>
          Effect.logError(`Database migration failed: ${error.message}`),
        ),
      )

    await RuntimeClient.runPromise(program)
    return { result: true }
  },
})
