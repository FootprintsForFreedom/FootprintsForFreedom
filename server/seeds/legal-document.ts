import { Effect } from "effect"
import { LegalDocumentService } from "../services/legal-document.service"
import type { CurrentUserService, HttpRequestHeaders } from "../services/current-user.service"
import Seed from "./seed"

export default class LegalDocumentSeed extends Seed {
  constructor() {
    super("legal")
  }

  private legalDocuments = [
    {
      title: "Terms of Service",
      slug: "terms-of-service",
      content: "This is the terms of service",
      languageCode: "en",
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      content: "This is the privacy policy",
      languageCode: "en",
    },
    {
      title: "Imprint",
      slug: "imprint",
      content: "This is the imprint",
      languageCode: "en",
    },
  ]

  createLegalDocument(document: { title: string, slug: string, content: string, languageCode: string }): Effect.Effect<void, Error, LegalDocumentService | CurrentUserService | HttpRequestHeaders> {
    const effect = Effect.gen(function* () {
      const legalDocumentService = yield* LegalDocumentService
      yield* legalDocumentService.createLegalDocumentWithLanguageCode(document)
    })
    return effect
  }

  seed(): Effect.Effect<void, Error, LegalDocumentService | CurrentUserService | HttpRequestHeaders> {
    return Effect.all(
      this.legalDocuments.map(doc => this.createLegalDocument(doc)),
    )
  }
}
