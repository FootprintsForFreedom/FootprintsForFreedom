import { Effect } from "effect"
import { LanguageRepository, LanguageRepositoryLayer } from "../repositories/language.repository"
import type { LanguageInsert } from "../database/schema"
import { AuthorizationService, AuthorizationServiceLayer } from "./authorization.service"

export class LanguageService extends Effect.Service<LanguageService>()(
  "app/services/LanguageService",
  {
    effect: Effect.gen(function* () {
      const repo = yield* LanguageRepository
      const auth = yield* AuthorizationService

      const createLanguage = (newValue: Omit<LanguageInsert, "order">) =>
        authorize(
          user => auth.canCreateLanguage(user),
          Effect.gen(function* () {
            const languageExists = yield* repo.getLanguageByCode(newValue.code)
            if (languageExists) {
              throw new AlreadyExistsError({
                message: `Language with code "${newValue.code}" already exists`,
              })
            }
            return yield* repo.createLanguage(newValue)
          }),
        )
      const getAllLanguages = () =>
        authorize(
          user => auth.canViewLanguages(user),
          repo.getAllLanguages(),
        )
      const getLanguageByCode = (code: string) =>
        authorize(
          user => auth.canViewLanguages(user),
          repo.getLanguageByCode(code),
        )
      const getLanguageById = (id: string) =>
        authorize(
          user => auth.canViewLanguages(user),
          repo.getLanguageById(id),
        )

      return {
        createLanguage,
        getAllLanguages,
        getLanguageByCode,
        getLanguageById,
      } as const
    }),
    dependencies: [LanguageRepositoryLayer, AuthorizationServiceLayer],
  },
) { }

export const LanguageServiceLayer = LanguageService.Default
