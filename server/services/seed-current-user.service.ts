import { Effect, Layer, Option } from "effect"
import type { User } from "../database/auth-schema"
import { CurrentUserService } from "../services/current-user.service"

const mockAdminUser: User = {
  id: "admin-id",
  name: "Admin User",
  email: "admin@test.test",
  emailVerified: true,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "admin",
  banned: null,
  banReason: null,
  banExpires: null,
}

export const SeededCurrentUserService = Effect.succeed<CurrentUserService>({
  _tag: "app/services/CurrentUserService",
  getCurrentUser: () => Effect.succeed(Option.some(mockAdminUser)),
})

export const SeededCurrentUserServiceLayer = Layer.effect(
  CurrentUserService,
  SeededCurrentUserService,
)
