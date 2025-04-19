import { Effect } from "effect"

export default defineEventHandler((event) => {
  const program = Effect.gen(function* () {
    const ipHeader = event.node.req.headers["x-forwarded-for"] as string | undefined
    const userIp = ipHeader ? ipHeader.split(/, /)[0] : event.node.req.socket.remoteAddress
    yield* Effect.logInfo(`User from IP ${userIp} is requesting ${event.path}`)
  })

  RuntimeClient.runPromise(program)
})
