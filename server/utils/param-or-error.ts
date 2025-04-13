import { Effect } from "effect"
import type { H3Event, EventHandlerRequest } from "h3"

export function getRouterParamOrCreateError(
  req: H3Event<EventHandlerRequest>,
  paramName: string,
): Effect.Effect<string, MissingParameterError> {
  return Effect.sync(() => {
    const param = getRouterParam(req, paramName)
    if (!param) {
      throw new MissingParameterError({
        message: `Missing parameter: ${paramName}`,
      })
    }
    return param
  })
}

export function getQueryParamOrCreateError<T>(
  req: H3Event<EventHandlerRequest>,
  paramName: string,
  parse: (raw: string) => T,
  { defaultValue }: { defaultValue?: T } = {},
): Effect.Effect<T, MissingParameterError> {
  const test = Effect.try({
    try: () => {
      const param = getQuery(req)[paramName] as string | undefined
      if (!param) {
        if (defaultValue) {
          return defaultValue
        }
        throw new MissingParameterError({
          message: `Missing query parameter: ${paramName}`,
        })
      }

      return parse(param)
    },
    catch: err =>
      err instanceof MissingParameterError
        ? err
        : new MissingParameterError({ message: "Unknown error" }),
  })
  return test
}
