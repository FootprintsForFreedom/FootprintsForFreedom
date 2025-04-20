<script lang="ts" setup>
definePageMeta({
  requiresAuth: true,
})

const userStore = inject(userStoreKey)!
const toast = useToast()

const showDeleteModal = ref(false)
const showUpdateModal = ref(false)
const updateLoading = ref(false)

async function onUpdateSubmit({ username, email }: { username: string, email: string }) {
  updateLoading.value = true
  try {
    await userStore.updateUser({ name: username, email })
    toast.add({
      title: "Profile updated",
      description: "Your profile information was updated.",
      color: "success",
    })
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      toast.add({
        title: "Email already exists",
        description: "The email address is already in use.",
        color: "error",
      })
    } else {
      toast.add({
        title: "Error updating profile",
        description: "Failed to update your profile. Please try again later.",
        color: "error",
      })
    }
  } finally {
    updateLoading.value = false
  }
}

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
              <UButton
                label="Change name or email"
                variant="subtle"
                block
                @click="showUpdateModal = true"
              />
              <UserUpdateModal
                :open="showUpdateModal"
                :username="userStore.user?.name ?? ''"
                :email="userStore.user?.email ?? ''"
                :loading="updateLoading"
                @update:open="showUpdateModal = $event"
                @submit="onUpdateSubmit"
              />
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
