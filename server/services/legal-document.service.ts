import { Effect } from "effect"
import { LegalDocumentRepository, LegalDocumentRepositoryLayer } from "../repositories/legal-document.repository"
import type { LegalDocumentContentInsert, LegalDocumentInsert } from "../database/schema"
import { AuthorizationService, AuthorizationServiceLayer } from "./authorization.service"
import { LanguageService, LanguageServiceLayer } from "./language.service"

export class LegalDocumentService extends Effect.Service<LegalDocumentService>()(
  "app/services/LegalDocumentService",
  {
    effect: Effect.gen(function* () {
      const repo = yield* LegalDocumentRepository
      const auth = yield* AuthorizationService
      const languageService = yield* LanguageService

      const _createLegalDocument = (newValue: LegalDocumentInsert & Omit<LegalDocumentContentInsert, "documentId">) =>
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
          return {
            ...document[0],
            content: content[0],
          }
        })

      const createLegalDocument = (
        newValue: LegalDocumentInsert & Omit<LegalDocumentContentInsert, "documentId">,
      ) =>
        authorize(
          user => auth.canCreateLegalDocument(user),
          _createLegalDocument(newValue),
        )

      const createLegalDocumentWithLanguageCode = (
        newValue: LegalDocumentInsert &
          Omit<LegalDocumentContentInsert, "documentId" | "languageId"> & {
            languageCode: string
          },
      ) =>
        authorize(
          user => auth.canCreateLegalDocument(user),
          Effect.gen(function* () {
            const language = yield* languageService.getLanguageByCode(newValue.languageCode)
            if (!language) {
              throw new NotFoundError({
                message: `Language with code ${newValue.languageCode} not found`,
              })
            }

            return yield* _createLegalDocument({
              ...newValue,
              languageId: language.id,
            })
          }),
        )

      return {
        createLegalDocument,
        createLegalDocumentWithLanguageCode,
      } as const
    }),
    dependencies: [LegalDocumentRepositoryLayer, AuthorizationServiceLayer, LanguageServiceLayer],
  },
) { }

export const LegalDocumentServiceLayer = LegalDocumentService.DefaultWithoutDependencies
