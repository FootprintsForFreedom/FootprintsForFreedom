import { Effect } from "effect"

export default defineEventHandler(async (req) => {
  const handler = Effect.gen(function* () {
    Effect.logInfo("Fetching current user")

    const user = yield * executeDatabaseQuery(req, "getCurrentUser")
    if (!user) {
      return yield * new UnauthorizedError({ path: req.path })
    }
    Effect.logInfo(`Found own user ${user.id}`)
    return user
  })

  return runPromiseAndCatch(handler, "get-current-user")
})
