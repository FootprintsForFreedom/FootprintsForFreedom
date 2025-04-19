declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const userStore = useUserStore()
  console.log(to.fullPath)

  await userStore.loadUser()
  // Redirect to profile if user is logged in and trying to access login
  if (to.fullPath.startsWith("/login") && userStore.loggedIn) {
    return navigateTo("/profile")
  }
  // Redirect to login if user is not logged in and trying to access protected route
  if (!userStore.loggedIn && to.meta.requiresAuth) {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  }
})
