import { Effect, pipe } from "effect"
import type { H3Event, EventHandlerRequest, H3Error } from "h3"

export function getRouterParamOrCreateError(req: H3Event<EventHandlerRequest>, paramName: string): Effect.Effect<string, H3Error> {
  return pipe(
    Effect.sync(() => getRouterParam(req, paramName)),
    Effect.flatMap(param =>
      param
        ? Effect.succeed(param)
        : Effect.fail(createError({ status: 400, message: `Missing ${paramName}` })),
    ),
  )
}
