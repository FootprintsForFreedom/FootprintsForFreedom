import type { User } from "#edgedb/interfaces"

export type UserDetail = Pick<User, "id" | "name" | "email" | "role">
