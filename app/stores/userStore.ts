import { defineStore } from "pinia"
import type { UserDetail } from "~~/shared/types/User.type"

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as UserDetail | null,
  }),
  actions: {
    setUser(user: UserDetail) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
  },
})
