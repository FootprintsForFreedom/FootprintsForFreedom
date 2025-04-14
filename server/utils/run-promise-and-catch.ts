import { Effect } from "effect"
import { H3Error } from "h3"
import type { MainLayerRequirements } from "./runtime"

export async function runPromiseAndCatch<T>(
  handler: Effect.Effect<T, Error, MainLayerRequirements>,
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
