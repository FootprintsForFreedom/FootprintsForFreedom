import { Effect } from "effect"

export default defineEventHandler(async (req) => {
  const handler = Effect.gen(function* () {
    // Extract id or fail with error
    const id = yield * getRouterParamOrCreateError(req, "id")
    yield * Effect.logInfo(`Fetching user with id ${id}`)

    // Fetch user
    const user = yield * executeDatabaseQuery(req, "getUser", { id })
    if (!user) {
      return yield * new UserNotFoundError({ id: id })
    }
    yield * Effect.logInfo(`Found user ${user.id}`)
    return user
  })

  return runPromiseAndCatch(handler, "get-user-detail")
})
