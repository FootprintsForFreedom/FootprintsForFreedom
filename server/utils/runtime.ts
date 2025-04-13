import { Layer, ManagedRuntime, Logger } from "effect"
import { RepositoryLayer } from "../repositories"
import { ServiceLayer } from "../services"

export const MainLayer = Layer.mergeAll(
  Logger.pretty,
  DatabaseLayer,
  RepositoryLayer,
  ServiceLayer,
)

export const RuntimeClient = ManagedRuntime.make(MainLayer)

// This is the trick! We use a mapped type to extract the Service Requirements (R)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LayerRequirements<L extends Layer.Layer<any, any, any>> = [L] extends [Layer.Layer<infer R, any, any>] ? R : never

// Now you can get the type!
export type MainLayerRequirements = LayerRequirements<typeof MainLayer>
