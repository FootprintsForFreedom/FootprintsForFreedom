import { Effect, Option } from "effect"
import type { User } from "../database/auth-schema"

export class AuthorizationService extends Effect.Service<AuthorizationService>()(
  "app/services/AuthorizationService",
  {
    effect: Effect.sync(() => {
      const canCreateLanguage = (user: Option.Option<User>) =>
        Option.match(user, {
          onNone: () => false,
          onSome: u => u.role === "admin",
        })
      const canViewLanguages = (_user: Option.Option<User>) => true // Everyone can view

      return {
        canCreateLanguage,
        canViewLanguages,
      } as const
    }),
  },
) {}

export const AuthorizationServiceLayer = AuthorizationService.Default
