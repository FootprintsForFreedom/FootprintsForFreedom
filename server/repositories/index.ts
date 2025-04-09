import { Layer } from "effect"
import { SeedStatusRepositoryLayer } from "./seed-status.repository"

export const RepositoryLayer = Layer.mergeAll(
  SeedStatusRepositoryLayer,
)
