import { Effect } from "effect"
import type { H3Error } from "h3"

export const internalServerError = createError({ status: 500, message: "Internal Server Error" })

export function handleError(error: unknown): Effect.Effect<H3Error> {
  return Effect.gen(function* () {
    if (
      error instanceof Error
      && "_tag" in error
      && "code" in error
      && typeof error.code === "number"
    ) {
      yield* Effect.logError(`Tagged error: ${error._tag} - ${error.message}`)
      return createError({ status: error.code, message: error.message })
    }
    yield* Effect.logError(`Unexpected error: ${error}`)
    return internalServerError
  })
}
