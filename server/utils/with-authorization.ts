import type { Option } from "effect"
import { Effect } from "effect"
import type { User } from "../database/auth-schema"
import type { HttpRequestHeaders } from "../services/current-user.service"
import { CurrentUserService } from "../services/current-user.service"

export const authorize = <R, E, A>(
  check: (user: Option.Option<User>) => boolean,
  effect: Effect.Effect<R, E, A>,
): Effect.Effect<R, E | UnauthorizedError | NoSessionAvailableError, A | CurrentUserService | HttpRequestHeaders> => {
  const program = Effect.gen(function* () {
    const currentUserService = yield* CurrentUserService
    const currentUser = yield* currentUserService.getCurrentUser()

    if (check(currentUser)) {
      // If the check passes, we can safely run the effect
      return yield* effect
    } else {
      // If the check fails, we return an UnauthorizedError
      return yield* Effect.fail(new UnauthorizedError())
    }
  })
  return program
}
