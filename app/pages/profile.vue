<script lang="ts" setup>
definePageMeta({
  requiresAuth: true,
})

const userStore = inject(userStoreKey)!
const toast = useToast()

const showDeleteModal = ref(false)

async function onDeleteConfirm() {
  const res = await userStore.deleteUser()
  if (res.data?.success) {
    toast.add({
      title: "Confirmation email sent",
      description: "Click the link in the email to confirm your account deletion.",
      color: "success",
    })
  } else {
    toast.add({
      title: "Error deleting account",
      description: "Failed to send confirmation email. Please try again later.",
      color: "error",
    })
  }
}
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
            <div class="w-full">
              <h2 class="text-2xl font-bold w-full">
                {{ userStore.user!.name }}
              </h2>
              <p class="text-muted">
                {{ userStore.user!.email }}
              </p>
            </div>

            <div class="flex flex-col gap-2">
              <UserUpdateModal />
              <UButton
                label="Delete Account"
                variant="subtle"
                color="error"
                block
                @click="showDeleteModal = true"
              />
              <UserConfirmDeleteModal
                :open="showDeleteModal"
                @update:open="showDeleteModal = $event"
                @confirm="onDeleteConfirm"
              />
            </div>
          </div>
        </UPageCard>
      </UContainer>
    </template>
  </div>
</template>
