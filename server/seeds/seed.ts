import { createClient } from "edgedb"

export default class Seed {
  name: string
  seed: () => Promise<void>

  client = createClient()

  constructor(name: string, seed: () => Promise<void>) {
    this.name = name
    this.seed = seed
  }
}
