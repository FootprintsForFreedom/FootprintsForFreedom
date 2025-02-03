import { Effect } from "effect"
import type { H3Error } from "h3"

export const internalServerError = createError({ status: 500, message: "Internal Server Error" })

export function rethrowDatabaseError(error: unknown): Error {
  if (error instanceof Error) {
    if (error instanceof TypeError) {
      return new DatabaseTypeError({ message: error.message })
    } else {
      return new UnknownDatabaseError({ message: error.message })
    }
  } else {
    return new UnknownDatabaseError({ message: "Unknown error" })
  }
}

export function handleError(error: unknown): Effect.Effect<H3Error> {
  return Effect.gen(function* () {
    if (error instanceof UnauthorizedError) {
      yield * Effect.logInfo(`Unauthorized error at path ${error.path}`)
      return createError({ status: 401, message: "Unauthorized" })
    } else if (error instanceof UserNotFoundError) {
      yield * Effect.logInfo(`User with id ${error.id} not found`)
      return createError({ status: 404, message: `User with id ${error.id} not found` })
    } else if (error instanceof DatabaseTypeError) {
      yield * Effect.logInfo(`Database type error: ${error.message}`)
      return createError({ status: 400, message: error.message })
    }
    yield * Effect.logError(`Unexpected error: ${error}`)
    return internalServerError
  })
}
