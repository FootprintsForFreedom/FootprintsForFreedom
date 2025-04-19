export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()

  await userStore.loadUser()
  if (!userStore.loggedIn) {
    return navigateTo("/login")
  }
})
