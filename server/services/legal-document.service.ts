import { Effect } from "effect"
import { LegalDocumentRepository, LegalDocumentRepositoryLayer } from "../repositories/legal-document.repository"
import type { LegalDocumentContentInsert, LegalDocumentInsert } from "../database/schema"
import { AuthorizationService, AuthorizationServiceLayer } from "./authorization.service"

export class LegalDocumentService extends Effect.Service<LegalDocumentService>()(
  "app/services/LegalDocumentService",
  {
    effect: Effect.gen(function* () {
      const repo = yield* LegalDocumentRepository
      const auth = yield* AuthorizationService

      const createLegalDocument = (newValue: LegalDocumentInsert & Omit<LegalDocumentContentInsert, "documentId">) =>
        authorize(
          user => auth.canCreateLegalDocument(user),
          Effect.gen(function* () {
            const documentExists = yield* repo.getLegalDocumentBySlug(newValue.slug)
            if (documentExists) {
              throw new AlreadyExistsError({
                message: `Legal document with slug ${newValue.slug} already exists`,
              })
            }
            const document = yield* repo.createLegalDocument(newValue)
            const content = yield* repo.createLegalDocumentContent({
              ...newValue,
              documentId: document[0].id,
            })
            return { ...document, content }
          }),
        )

      return { createLegalDocument } as const
    }),
    dependencies: [LegalDocumentRepositoryLayer, AuthorizationServiceLayer],
  },
) { }

export const LegalDocumentServiceLayer = LegalDocumentService.DefaultWithoutDependencies
