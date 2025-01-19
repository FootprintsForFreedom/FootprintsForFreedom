import { createClient } from "edgedb"
import { Effect } from "effect"

export default class Seed {
  name: string

  client = createClient()
  runtimeConfig = useRuntimeConfig()

  constructor(name: string) {
    this.name = name
  }

  shouldRunSeed(): Effect.Effect<boolean, Error> {
    return Effect.fail(new Error("Not implemented"))
  }

  seed(): Effect.Effect<void, Error> {
    return Effect.fail(new Error("Not implemented"))
  }

  afterRunSeed(): Effect.Effect<void, Error> {
    return Effect.fail(new Error("Not implemented"))
  }
}
