import { Layer, ManagedRuntime, Logger } from "effect"
import { RepositoryLayer } from "../repositories"
import { ServiceLayer } from "../services"
import { LanguageRepositoryLayer } from "../repositories/language.repository"
import { AuthorizationServiceLayer } from "../services/authorization.service"

export const MainLayer = Layer.mergeAll(
  Logger.pretty,
  DatabaseLayer,
  RepositoryLayer.pipe(Layer.provide(DatabaseLayer)),
  ServiceLayer.pipe(Layer.provide(RepositoryLayer), Layer.provide(LanguageRepositoryLayer), Layer.provide(AuthorizationServiceLayer), Layer.provide(DatabaseLayer)),
)

export const RuntimeClient = ManagedRuntime.make(MainLayer)

// This is the trick! We use a mapped type to extract the Service Requirements (R)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LayerRequirements<L extends Layer.Layer<any, any, any>> = [L] extends [Layer.Layer<infer R, any, any>] ? R : never

// Now you can get the type!
export type MainLayerRequirements = LayerRequirements<typeof MainLayer>
