import { Effect } from "effect"
import type { H3Event, EventHandlerRequest, H3Error } from "h3"

export function getRouterParamOrCreateError(
  req: H3Event<EventHandlerRequest>,
  paramName: string,
): Effect.Effect<string, H3Error> {
  return Effect.gen(function* () {
    const param = getRouterParam(req, paramName)
    if (!param) {
      return yield* Effect.fail(
        createError({ status: 400, message: `Missing ${paramName}` }),
      )
    }
    return param
  })
}
