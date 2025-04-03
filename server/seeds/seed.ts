import { Effect } from "effect"

export default abstract class Seed {
  name: string

  client = useGel().withGlobals({
    server_admin: true,
  })

  runtimeConfig = useRuntimeConfig()

  constructor(name: string) {
    this.name = name
  }

  shouldRunSeed(): Effect.Effect<boolean, Error> {
    const { checkSeed } = useGelQueries()
    return Effect.tryPromise(() => checkSeed({ seed_name: this.name })).pipe(
      Effect.map(exists => !exists),
    )
  }

  abstract seed(): Effect.Effect<void, Error>

  afterRunSeed(): Effect.Effect<void, Error> {
    const { createSeed } = useGelQueries()
    return Effect.tryPromise(() => createSeed({ seed_name: this.name }))
  }
}
