<script lang="ts" setup>
const userStore = inject(userStoreKey)!
const router = useRouter()

definePageMeta({
  middleware: "auth",
})

watchEffect(() => {
  if (!userStore.loading && !userStore.loggedIn) {
    router.replace("/login")
  }
})
</script>

<template>
  <div>
    <template v-if="userStore.loading">
      <!-- Optionally show a loading spinner here -->
    </template>
    <template v-else-if="!userStore.loggedIn">
      <div>
        <h2>Please log in</h2>
      </div>
    </template>
    <template v-else>
      <div>
        <h2>Your Profile</h2>
        <p><strong>Username:</strong> {{ userStore.user?.name }}</p>
        <p><strong>Email:</strong> {{ userStore.user?.email }}</p>
        <UButton @click="userStore.signOut()">
          Sign out
        </UButton>
      </div>
    </template>
  </div>
</template>
