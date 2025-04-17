import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, magicLink } from "better-auth/plugins"

export const auth = betterAuth({
  database: drizzleAdapter(dbClient, {
    provider: "pg",
  }),
  plugins: [
    admin(),
    magicLink({
      sendMagicLink: async ({ email, token, url }, _request) => {
        console.log(`Sending magic link to ${email} with token ${token} and url ${url}`)
      },
    }),
  ],
})
