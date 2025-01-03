import * as v from "valibot"

const UserNameSchema = v.object({
  name: v.pipe(
    v.string("Name is required"),
    v.trim(),
    v.nonEmpty("Name is required"),
  ),
})

const UserEmailSchema = v.object({
  email: v.pipe(
    v.string("Email is required"),
    v.trim(),
    v.nonEmpty("Email is required"),
    v.email("Invalid email"),
  ),
})

const UserSimplePasswordSchema = v.object({
  password: v.pipe(
    v.string("Password is required"),
    v.trim(),
    v.nonEmpty("Password is required"),
  ),
})

const UserPasswordSchema = v.object({
  password: v.pipe(
    v.string("Password is required"),
    v.trim(),
    v.nonEmpty("Password is required"),
    v.minLength(8, "Password must be at least 8 characters"),
    v.regex(/[a-z]/, "Password must contain at least one lowercase letter"),
    v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
    v.regex(/[0-9]/, "Password must contain at least one number"),
  ),
})

export const UserCredentialsSchema = v.intersect([
  UserNameSchema,
  UserEmailSchema,
])

export const UserLoginSchema = v.intersect([
  UserEmailSchema,
  UserSimplePasswordSchema,
])

export type UserLoginInput = v.InferOutput<typeof UserLoginSchema>

export const UserSignupSchema = v.intersect([
  UserNameSchema,
  UserEmailSchema,
  UserPasswordSchema,
])

export type UserSignupInput = v.InferOutput<typeof UserSignupSchema>
