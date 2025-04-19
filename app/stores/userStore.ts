import type { User } from "better-auth"
import { defineStore } from "pinia"
import type { InjectionKey } from "vue"

export const userStoreKey: InjectionKey<ReturnType<typeof useUserStore>> = Symbol("userStore")

export const useUserStore = defineStore("user", () => {
  const { $auth } = useNuxtApp()
  const user = ref<User | null>(null)
  const loading = ref(false)

  async function fetchUser() {
    const { data: session, error } = await $auth.useSession(useFetch)
    if (error.value) {
      console.error("Error loading user session:", error.value)
      user.value = null
      return
    }
    user.value = session.value?.user || null
  }

  async function loadUser() {
    loading.value = true
    try {
      if (!user.value) {
        await fetchUser()
      }
    } finally {
      loading.value = false
    }
  }

  const loggedIn = computed(() => !!user.value)

  async function signOut() {
    await $auth.signOut()
    user.value = null
    await navigateTo("/login")
  }

  async function updateUser(data: Partial<Omit<User, "email">>) {
    console.log("Updating user:", data)
    await $auth.updateUser(data)
    await fetchUser()
  }

  return {
    user,
    loadUser,
    loggedIn,
    signOut,
    loading,
    updateUser,
  }
})
