import type { User } from "better-auth"
import { defineStore } from "pinia"
import type { InjectionKey } from "vue"

export const userStoreKey: InjectionKey<ReturnType<typeof useUserStore>> = Symbol("userStore")

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  async function loadUser() {
    loading.value = true
    const { $auth } = useNuxtApp()
    try {
      if (!user.value) {
        const { data: session, error } = await $auth.useSession(useFetch)
        if (error.value) {
          console.error("Error loading user session:", error.value)
          user.value = null
          return
        }
        user.value = session.value?.user || null
      }
    } finally {
      loading.value = false
    }
  }

  const loggedIn = computed(() => !!user.value)

  async function signOut() {
    const { $auth } = useNuxtApp()
    await $auth.signOut()
    user.value = null
  }

  return {
    user,
    loadUser,
    loggedIn,
    signOut,
    loading,
  }
})
