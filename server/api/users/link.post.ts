import { Effect } from "effect"

export default defineEventHandler(async (req) => {
  const handler = Effect.gen(function* () {
    yield * Effect.logInfo("Linking user identity")

    const user = yield * executeDatabaseQuery(req, "linkUserIdentity")
    if (!user) {
      return yield * new UnauthorizedError({ path: req.path })
    }
    yield * Effect.logInfo(`Linked user identity of ${user.id}`)

    return user
  })

  return runPromiseAndCatch(handler, "link-user-identity")
})
