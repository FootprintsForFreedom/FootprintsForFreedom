import { Effect, pipe } from "effect"
import AuthSeed from "../seeds/auth"
import type Seed from "../seeds/seed"
import SmtpSeed from "../seeds/smtp"

export default defineNitroPlugin(async () => {
  const seeds: Seed[] = [
    new AuthSeed(),
    new SmtpSeed(),
  ]

  const executeSeed = (seed: Seed): Effect.Effect<void, Error> =>
    seed.seed().pipe(
      Effect.map(() => seed.afterRunSeed),
      Effect.tap(() => Effect.logInfo(`Seeded ${seed.name}`)),
    )

  const checkAndSeed = (seed: Seed): Effect.Effect<boolean, Error> =>
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

  const program = Effect.all(seeds.map(checkAndSeed), { concurrency: "unbounded" })

  return Effect.runPromise(program)
})
