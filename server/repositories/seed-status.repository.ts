import { eq } from "drizzle-orm"
import { Effect } from "effect"
import { DatabaseLayer, type SqlError } from "../utils/drizzle"

export class SeedStatus extends Effect.Service<SeedStatus>()("app/repositories/SeedStatus", {
  effect: Effect.gen(function* () {
    const drizzle = yield* Drizzle

    const checkSeedExists = (seedName: string): Effect.Effect<boolean, SqlError> =>
      drizzle.runQuery(
        drizzle.client.query.seedStatus.findFirst({
          where: eq(tables.seedStatus.seedName, seedName),
        }),
      ).pipe(Effect.map(result => result !== undefined))

    const createSeedRecord = (seedName: string): Effect.Effect<void, SqlError> =>
      drizzle.runQuery(
        drizzle.client.insert(tables.seedStatus).values({ seedName }),
      ).pipe(Effect.map(() => undefined))

    return { checkSeedExists, createSeedRecord } as const
  }),
  dependencies: [DatabaseLayer],
}) { }

export const SeedStatusLayer = SeedStatus.DefaultWithoutDependencies
