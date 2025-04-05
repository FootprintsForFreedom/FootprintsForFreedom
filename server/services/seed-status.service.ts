import { Effect } from "effect"
import { SeedStatus, SeedStatusLayer } from "../repositories/seed-status.repository"

export class SeedService extends Effect.Service<SeedService>()("app/services/SeedService", {
  effect: Effect.gen(function* () {
    const repo = yield* SeedStatus

    const checkSeedExists = (seedName: string) => repo.checkSeedExists(seedName)
    const createSeedRecord = (seedName: string) => repo.createSeedRecord(seedName)

    return { checkSeedExists, createSeedRecord } as const
  }),
  dependencies: [SeedStatusLayer],
}) { }

export const SeedServiceLayer = SeedService.DefaultWithoutDependencies
