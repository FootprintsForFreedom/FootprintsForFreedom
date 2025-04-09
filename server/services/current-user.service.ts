import { Context, Effect, Layer, Option } from "effect"
import type { User } from "../database/auth-schema"

export class HttpRequestHeaders extends Context.Tag("HttpRequestHeaders")<HttpRequestHeaders, Headers>() {}

export const makeHttpRequestHeadersLayer = (headers: Headers): Layer.Layer<HttpRequestHeaders> =>
  Layer.succeed(HttpRequestHeaders, headers)

export class CurrentUserService extends Effect.Service<CurrentUserService>()(
  "app/services/CurrentUserService",
  {
    effect: Effect.sync(() => {
      const getCurrentUser = () => {
        return Effect.gen(function* () {
          const headers = yield* HttpRequestHeaders

          const session = yield* Effect.tryPromise({
            try: () => auth.api.getSession({ headers }),
            catch: () => new NoSessionAvailableError(),
          })

          if (session?.user) {
            return Option.some(session.user as User)
          } else {
            return Option.none<User>()
          }
        })
      }

      return {
        getCurrentUser,
      }
    }),
  },
) { }

export const CurrentUserServiceLayer = CurrentUserService.Default
