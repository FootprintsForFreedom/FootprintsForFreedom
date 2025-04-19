<script lang="ts" setup>
import { inject } from "vue"

definePageMeta({
  requiresAuth: true,
})

const userStore = inject(userStoreKey)!
</script>

<template>
  <div>
    <template v-if="userStore.loggedIn && !userStore.user!.name">
      <UserSetInitialUsernameForm />
    </template>

    <template v-else-if="userStore.loggedIn && userStore.user!.name">
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
