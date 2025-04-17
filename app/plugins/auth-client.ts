import { createAuthClient } from "better-auth/vue"
import { magicLinkClient } from "better-auth/client/plugins"

export default defineNuxtPlugin(() => {
  const authClient = createAuthClient({
    plugins: [
      magicLinkClient(),
    ],
  })

  return {
    provide: {
      auth: authClient,
    },
  }
})
