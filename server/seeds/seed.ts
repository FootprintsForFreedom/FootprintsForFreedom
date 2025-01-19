import { createClient } from "edgedb"

export default class Seed {
  name: string
  seed: () => Promise<void>
  shouldRunSeed: () => Promise<boolean>
  afterRunSeed: () => Promise<void>

  client = createClient()

  constructor(name: string, { seed, shouldRunSeed, afterRunSeed }: { seed: () => Promise<void>, shouldRunSeed: () => Promise<boolean>, afterRunSeed: () => Promise<void> }) {
    this.name = name
    this.seed = seed
    this.shouldRunSeed = shouldRunSeed
    this.afterRunSeed = afterRunSeed
  }
}
