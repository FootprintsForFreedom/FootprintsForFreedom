import { defineStore } from "pinia"
import type { UserDetail } from "#shared/types/User.type"

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as UserDetail | null,
  }),
  actions: {
    async loadUser() {
      this.user = await $fetch("/api/users/me")
    },
    async logout() {
      const { logout } = useEdgeDbIdentity()
      await logout()
      this.clearUser()
    },
    setUser(user: UserDetail) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
  },
  getters: {
    isLoggedIn(): boolean {
      return this.user !== null
    },
    isAdmin(): boolean {
      return this.user?.role === "Admin"
    },
    isModerator(): boolean {
      return this.user?.role === "Moderator"
    },
  },
})
