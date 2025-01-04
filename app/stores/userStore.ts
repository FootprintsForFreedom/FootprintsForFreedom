import { defineStore } from "pinia"
import type { UserDetail } from "#shared/types/User.type"
import type { GetUserReturns } from "#edgedb/queries"

export const useUserStore = defineStore("user", () => {
  const user = ref<UserDetail | null>(null)
  const edgedbIdentity = useEdgeDbIdentity()

  async function loadUser() {
    if (!import.meta.server) {
      const loadedUser = await $fetch("/api/users/me")
      user.value = loadedUser
      return
    } else if (edgedbIdentity.isLoggedIn.value) {
      const userId = edgedbIdentity.identity.value.id
      const loadedUser = await $fetch<GetUserReturns>(`/api/users/${userId}`)
      if (loadedUser) {
        user.value = { ...loadedUser, email: "" }
      } else {
        user.value = null
      }
    }
  }

  async function logout() {
    console.log("Logging out")
    await edgedbIdentity.logout()
    clearUser()
  }

  function setUser(newUser: UserDetail) {
    user.value = newUser
  }

  function clearUser() {
    user.value = null
  }

  const isLoggedIn = edgedbIdentity.isLoggedIn
  const isAdmin = computed(() => user.value?.role === "Admin")
  const isModerator = computed(() => user.value?.role === "Moderator")

  return {
    user,
    edgedbIdentity,
    loadUser,
    logout,
    setUser,
    clearUser,
    isLoggedIn,
    isAdmin,
    isModerator,
  }
})
