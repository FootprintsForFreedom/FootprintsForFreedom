import type { User } from "#shared/dbschema/interfaces"

export type UserDetail = Pick<User, "id" | "name" | "email" | "role">
