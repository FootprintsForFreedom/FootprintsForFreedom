import { Effect } from "effect"

export function runPromiseAndCatch<T>(
  handler: Effect.Effect<T, Error>,
  name: string,
) {
  const main = handler.pipe(
    Effect.catchAll(handleError),
    Effect.withSpan(name),
  )

  return RuntimeClient.runPromise(main)
}
