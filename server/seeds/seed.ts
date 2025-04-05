import { Effect } from "effect"
import { SeedService } from "../services/seed-status.service"

export default abstract class Seed {
  runtimeConfig = useRuntimeConfig()

  constructor(public name: string) { }

  shouldRunSeed(): Effect.Effect<boolean, SqlError, SeedService> {
    return Effect.gen(function* (this: Seed) {
      const service = yield* SeedService
      const exists = yield* service.checkSeedExists(this.name)
      return !exists
    }.bind(this)) // bind(this) keeps `this.name` intact inside the generator
  }

  abstract seed(): Effect.Effect<void, Error, SeedService>

  afterRunSeed(): Effect.Effect<void, Error, SeedService> {
    return Effect.gen(function* (this: Seed) {
      const service = yield* SeedService
      yield* service.createSeedRecord(this.name)
    }.bind(this)) // bind(this) keeps `this.name` intact inside the generator
  }
}
