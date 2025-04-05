import { Effect, pipe } from "effect"
import type Seed from "../seeds/seed"
import type { SeedStatusService } from "../services/seed-status.service"

export default defineNitroPlugin(async () => {
  const seeds: Seed[] = [
    // Add your seed classes here
    // new YourSeedClass(),
  ]

  const executeSeed = (seed: Seed): Effect.Effect<void, Error, SeedStatusService> =>
    seed.seed().pipe(
      Effect.flatMap(() => seed.afterRunSeed()),
      Effect.tap(() => Effect.logInfo(`Seeded ${seed.name}`)),
    )

  const checkAndSeed = (seed: Seed): Effect.Effect<boolean, Error, SeedStatusService> =>
    seed.shouldRunSeed().pipe(
      Effect.flatMap(shouldRunSeed => shouldRunSeed
        ? pipe(
            executeSeed(seed),
            Effect.map(() => true),
          )
        : pipe(
            Effect.logInfo(`Seed ${seed.name} already exists`),
            Effect.map(() => false),
          ),
      ),
    )

  const program = Effect.all(seeds.map(checkAndSeed))

  return RuntimeClient.runPromise(program)
})
