import { Layer } from "effect"
import { SeedStatusRepositoryLayer } from "./seed-status.repository"
import { LegalDocumentRepositoryLayer } from "./legal-document.repository"

export const RepositoryLayer = Layer.mergeAll(
  SeedStatusRepositoryLayer,
  LegalDocumentRepositoryLayer,
)
