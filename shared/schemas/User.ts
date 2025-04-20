import * as v from "valibot"

export const userNameSchema = v.object({
  username: v.pipe(
    v.string("Name is required"),
    v.trim(),
    v.nonEmpty("Name is required"),
  ),
})

export type UserNameSchema = v.InferOutput<typeof userNameSchema>

export const userEmailSchema = v.object({
  email: v.pipe(
    v.string("Email is required"),
    v.trim(),
    v.nonEmpty("Email is required"),
    v.email("Invalid email"),
  ),
})

export type UserEmailSchema = v.InferOutput<typeof userEmailSchema>

export const updateUserSchema = v.intersect([userNameSchema, userEmailSchema])

export type UpdateUserSchema = v.InferOutput<typeof updateUserSchema>
