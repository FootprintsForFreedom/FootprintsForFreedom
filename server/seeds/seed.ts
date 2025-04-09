import { Effect } from "effect"
import { SeedStatusService } from "../services/seed-status.service"
import type { HttpRequestHeaders } from "../services/current-user.service"

export default abstract class Seed {
  constructor(public name: string) { }

  shouldRunSeed(): Effect.Effect<boolean, SqlError, SeedStatusService> {
    return Effect.gen(function* (this: Seed) {
      const service = yield* SeedStatusService
      const exists = yield* service.checkSeedExists(this.name)
      return !exists
    }.bind(this)) // bind(this) keeps `this.name` intact inside the generator
  }

  abstract seed(): Effect.Effect<void, Error, Partial<MainLayerRequirements> | HttpRequestHeaders>

  runSeed(): Effect.Effect<void, Error, MainLayerRequirements | HttpRequestHeaders> {
    return this.seed() as Effect.Effect<void, Error, MainLayerRequirements | HttpRequestHeaders>
  }

  afterRunSeed(): Effect.Effect<void, Error, SeedStatusService> {
    return Effect.gen(function* (this: Seed) {
      const service = yield* SeedStatusService
      yield* service.createSeedRecord(this.name)
    }.bind(this)) // bind(this) keeps `this.name` intact inside the generator
  }
}
