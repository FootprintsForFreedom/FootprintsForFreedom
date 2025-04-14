import { Effect } from "effect"
import { makeHttpRequestHeadersLayer } from "~~/server/services/current-user.service"
import { LegalDocumentService } from "~~/server/services/legal-document.service"

export default defineEventHandler(async (event) => {
  const program = Effect.gen(function* () {
    const legalDocumentService = yield* LegalDocumentService

    const slug = yield* getRouterParamOrCreateError(event, "slug")
    const languageCode = yield* getQueryParamOrCreateError(
      event,
      "languageCode",
      String,
      { defaultValue: "en" },
    )

    const legalDocument = yield* legalDocumentService.getLegalDocumentBySlugForLanguageCode(
      slug,
      languageCode,
    )
    return legalDocument
  })

  return await runPromiseAndCatch(
    program.pipe(
      Effect.provide(makeHttpRequestHeadersLayer(event.headers)),
    ),
    "get-legal-document",
  )
})
