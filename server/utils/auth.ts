import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
  database: drizzleAdapter(() => useDrizzle(), {
    provider: "pg",
  }),
  plugins: [
    admin(),
  ],
})
