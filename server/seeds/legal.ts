import { Effect } from "effect"
import { LegalDocumentService } from "../services/legal-document.service"
import type { CurrentUserService, HttpRequestHeaders } from "../services/current-user.service"
import Seed from "./seed"

export default class LegalSeed extends Seed {
  constructor() {
    super("legal")
  }

  private legalDocuments = [
    {
      title: "Terms of Service",
      slug: "terms-of-service",
      content: "This is the terms of service",
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      content: "This is the privacy policy",
    },
    {
      title: "Imprint",
      slug: "imprint",
      content: "This is the imprint",
    },
  ]

  createLegalDocument(document: { title: string, slug: string, content: string }): Effect.Effect<void, Error, LegalDocumentService | CurrentUserService | HttpRequestHeaders> {
    const effect = Effect.gen(function* () {
      const legalDocumentService = yield* LegalDocumentService
      yield* legalDocumentService.createLegalDocument({
        title: document.title,
        slug: document.slug,
        content: document.content,
        languageId: "en",
      })
    })
    return effect
  }

  seed(): Effect.Effect<void, Error, LegalDocumentService | CurrentUserService | HttpRequestHeaders> {
    return Effect.all(
      this.legalDocuments.map(doc => this.createLegalDocument(doc)),
    )
  }
}
