import { Layer } from "effect"
import { SeedStatusServiceLayer } from "./seed-status.service"
import { AuthorizationServiceLayer } from "./authorization.service"
import { CurrentUserServiceLayer } from "./current-user.service"
import { LanguageServiceLayer } from "./language.service"
import { LegalDocumentServiceLayer } from "./legal-document.service"

export const ServiceLayer = Layer.mergeAll(
  SeedStatusServiceLayer,
  AuthorizationServiceLayer,
  CurrentUserServiceLayer,
  LanguageServiceLayer,
  LegalDocumentServiceLayer,
)
