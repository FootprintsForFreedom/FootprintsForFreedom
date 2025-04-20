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
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, token, url }, _request) => {
        console.log(`Sending delete account verification to ${user.email} with token ${token} and url ${url}`)
      },
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        default: "user",
        input: false,
      },
    },
  },
})
