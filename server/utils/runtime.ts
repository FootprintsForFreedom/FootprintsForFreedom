import { Layer, ManagedRuntime, Logger } from "effect"
import { RepositoryLayer } from "../repositories"
import { ServiceLayer } from "../services"
import { DatabaseLayer } from "./drizzle"

const MainLayer = Layer.mergeAll(
  Logger.pretty,
  DatabaseLayer,
  RepositoryLayer.pipe(Layer.provide(DatabaseLayer)),
  ServiceLayer.pipe(Layer.provide(RepositoryLayer), Layer.provide(DatabaseLayer)),
)

export const RuntimeClient = ManagedRuntime.make(MainLayer)
