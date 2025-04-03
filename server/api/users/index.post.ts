import * as v from "valibot"
import { UserCredentialsSchema } from "#shared/schemas/User"

export default defineEventHandler(async (req) => {
  const { name, email } = await readValidatedBody(req, body => v.parse(UserCredentialsSchema, body))
  const { createUser } = useGelQueries(req)

  const res = await createUser({ name, email })
  return res
})
