import { Effect, pipe } from "effect"
import { H3Error } from "h3"

export default defineEventHandler(async (req) => {
  const handler = pipe(
    getRouterParamOrCreateError(req, "id"),
    Effect.tap(id => Effect.logInfo(`Fetching user with id ${id}`)),
    Effect.flatMap(id =>
      pipe(
        Effect.tryPromise({
          try: () => {
            const { getUser } = useEdgeDbQueries(req)
            return getUser({ id: id })
          },
          catch: (error) => {
            if (error instanceof Error && error.name === "TypeError") {
              return new TypeError(error.message)
            } else {
              console.log("Error fetching user", error)
            }
          },
        }),
        Effect.flatMap((user) => {
          if (user) {
            return Effect.succeed(user)
          } else {
            return Effect.fail(createError({ status: 404, message: "User not found" }))
          }
        }),
        Effect.catchAll((error) => {
          if (error instanceof H3Error) {
            return Effect.succeed(error)
          } else if (error instanceof TypeError) {
            return Effect.succeed(createError({ status: 400, message: error.message }))
          }
          return Effect.succeed(internalServerError)
        }),
      ),
    ),
  )

  return Effect.runPromise(handler)
})
