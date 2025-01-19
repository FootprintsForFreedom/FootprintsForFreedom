import { Effect, pipe } from "effect"
import AuthSeed from "../seeds/auth"
import type Seed from "../seeds/seed"
import SmtpSeed from "../seeds/smtp"
import ConfigSeed from "../seeds/config"
import LanguageSeed from "../seeds/language"
import LegalSeed from "../seeds/legal"

export default defineNitroPlugin(async () => {
  const seeds: Seed[] = [
    new AuthSeed(),
    new ConfigSeed(),
    new SmtpSeed(),
    new LanguageSeed(),
    new LegalSeed(),
  ]

  const executeSeed = (seed: Seed): Effect.Effect<void, Error> =>
    seed.seed().pipe(
      Effect.flatMap(() => seed.afterRunSeed()),
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

  const program = Effect.all(seeds.map(checkAndSeed))

  return Effect.runPromise(program)
})
