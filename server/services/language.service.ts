import { Effect } from "effect"
import { LanguageRepository, LanguageRepositoryLayer } from "../repositories/language.repository"
import type { LanguageInsert } from "../database/schema"
import { AuthorizationService } from "./authorization.service"

export class LanguageService extends Effect.Service<LanguageService>()(
  "app/services/LanguageService",
  {
    effect: Effect.gen(function* () {
      const repo = yield* LanguageRepository
      const auth = yield* AuthorizationService

      const createLanguage = (newValue: Omit<LanguageInsert, "order">) =>
        authorize(
          user => auth.canCreateLanguage(user),
          repo.createLanguage(newValue),
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
    dependencies: [LanguageRepositoryLayer],
  },
) { }

export const LanguageServiceLayer = LanguageService.DefaultWithoutDependencies
