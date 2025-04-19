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
      <UContainer>
        <PageHeader title="Profile" />
        <UPageCard>
          <div class="flex items-center md:flex-row md:justify-start md:space-x-4 md:space-y-0 space-y-4 flex-col text-center md:text-start">
            <UAvatar
              :src="userStore.user!.image ?? undefined"
              :alt="userStore.user!.name"
              size="3xl"
              class="w-24 h-24"
            />
            <div class="">
              <h2 class="text-2xl font-bold">
                {{ userStore.user!.name }}
              </h2>
              <p class="text-muted">
                {{ userStore.user!.email }}
              </p>
            </div>
          </div>
        </UPageCard>
      </UContainer>
    </template>
  </div>
</template>
