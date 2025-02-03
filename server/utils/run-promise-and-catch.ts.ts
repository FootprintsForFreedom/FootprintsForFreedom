import { Effect } from "effect"
import { H3Error } from "h3"

export async function runPromiseAndCatch<T>(
  handler: Effect.Effect<T, Error>,
  name: string,
) {
  const main = handler.pipe(
    Effect.catchAll(handleError),
    Effect.withSpan(name),
  )

  const result = await RuntimeClient.runPromise(main)
  if (result instanceof H3Error) {
    throw result
  } else {
    return result
  }
}
