import { Effect } from "effect"
import type { GetUserReturns } from "~~/shared/dbschema/queries"

export default defineEventHandler(async (req) => {
  const handler = Effect.gen(function* () {
    const { page, per } = yield * getPageQuery(req)
    yield * Effect.logInfo(`Fetching users on page ${page} with ${per} items per page`)

    // Fetch users
    const offset = (page - 1) * per
    const limit = page * per
    const users = yield * executeDatabaseQuery(req, "getUsers", { offset, limit })
    yield * Effect.logInfo(`Found ${users.total} users`)

    return {
      metadata: {
        page,
        per,
        total: users.total,
      },
      items: users.users,
    } as Page<GetUserReturns>
  })

  return runPromiseAndCatch(handler, "get-user-list")
})
