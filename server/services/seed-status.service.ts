import { Effect } from "effect"
import { SeedStatusRepository, SeedStatusRepositoryLayer } from "../repositories/seed-status.repository"

export class SeedStatusService extends Effect.Service<SeedStatusService>()(
  "app/services/SeedStatusService",
  {
    effect: Effect.gen(function* () {
      const repo = yield* SeedStatusRepository

      const checkSeedExists = (seedName: string) => repo.checkSeedExists(seedName)
      const createSeedRecord = (seedName: string) => repo.createSeedRecord(seedName)

      return { checkSeedExists, createSeedRecord } as const
    }),
    dependencies: [SeedStatusRepositoryLayer],
  },
) { }

export const SeedStatusServiceLayer = SeedStatusService.Default
