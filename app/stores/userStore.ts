import type { User } from "better-auth"

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

  async function updateUser({ email, ...dataWithoutEmail }: Partial<User>) {
    if (Object.keys(dataWithoutEmail).length > 0) {
      const res = await $auth.updateUser(dataWithoutEmail)
      if (res.error) {
        throw new Error(res.error.message)
      }
    }
    if (email && email !== user.value?.email) {
      const res = await $auth.changeEmail({
        newEmail: email,
        callbackURL: "/profile",
      })
      if (res.error) {
        if (res.error.code === "COULDNT_UPDATE_YOUR_EMAIL") {
          throw new EmailAlreadyExistsError()
        } else {
          throw new Error(res.error.message)
        }
      }
    }
    await fetchUser()
  }

  async function deleteUser() {
    return await $auth.deleteUser({ callbackURL: "/login" })
  }

  return {
    user,
    loadUser,
    loggedIn,
    signOut,
    loading,
    updateUser,
    deleteUser,
  }
})
