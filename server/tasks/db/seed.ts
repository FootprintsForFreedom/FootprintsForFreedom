import { Effect, Layer, pipe } from "effect"
import LanguageSeed from "~~/server/seeds/language"
import type Seed from "~~/server/seeds/seed"
import type { HttpRequestHeaders } from "~~/server/services/current-user.service"
import { makeHttpRequestHeadersLayer } from "~~/server/services/current-user.service"
import { SeededCurrentUserServiceLayer } from "~~/server/services/seed-current-user.service"

export default defineTask({
  meta: {
    name: "db:seed",
    description: "Run database seeds",
  },
  run: async () => {
    const seeds: Seed[] = [
      new LanguageSeed(),
    ]

    const executeSeed = (seed: Seed): Effect.Effect<void, Error, MainLayerRequirements | HttpRequestHeaders> =>
      seed.runSeed().pipe(
        Effect.flatMap(() => seed.afterRunSeed()),
        Effect.tap(() => Effect.logInfo(`Seeded ${seed.name}`)),
      )

    const checkAndSeed = (seed: Seed): Effect.Effect<boolean, Error, MainLayerRequirements | HttpRequestHeaders> =>
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

    const programWithLayers = program.pipe(
      Effect.provide(
        Layer.mergeAll(
          makeHttpRequestHeadersLayer(new Headers()),
          SeededCurrentUserServiceLayer,
        ),
      ),
    )

    await RuntimeClient.runPromise(programWithLayers)
    return { result: true }
  },
})
