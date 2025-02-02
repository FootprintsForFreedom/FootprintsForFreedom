import { Layer, ManagedRuntime, Logger } from "effect"

const MainLayer = Layer.mergeAll(
  Logger.pretty,
)

export const RuntimeClient = ManagedRuntime.make(MainLayer)
