import { Layer, ManagedRuntime } from "effect"
import { makeHttpRequestHeadersLayer } from "../services/current-user.service"

declare module "h3" {
  interface H3EventContext {
    effectRuntime: typeof RuntimeClient
  }
}

export default defineEventHandler((event) => {
  const headersLayer = makeHttpRequestHeadersLayer(event.headers)

  const runtime = ManagedRuntime.make(
    MainLayer.pipe(Layer.provide(headersLayer)),
  )

  event.context.effectRuntime = runtime
})
