import { createAuthClient } from "better-auth/vue"

export default defineNuxtPlugin(() => {
  const authClient = createAuthClient({
    // Your client configuration here
  })

  return {
    provide: {
      auth: authClient,
    },
  }
})
