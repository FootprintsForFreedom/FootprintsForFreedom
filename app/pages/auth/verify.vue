<script lang="ts" setup>
definePageMeta({
  layout: "auth",
})

const { update } = useEdgeDbIdentity()
const user = useUserStore()
const toast = useToast()
async function checkAndLinkUser(check: () => Promise<unknown>) {
  const verificationToken = useRoute().query.verification_token
  if (!verificationToken) {
    navigateTo("/")
    return
  }

  const result = await check()
  if (!result) {
    toast.add({
      title: "Verification failed",
      icon: "i-lucide-circle-alert",
      color: "error",
    })
    return
  }
  const res = await $fetch("/api/users/link", {
    method: "POST",
  })
  await update()
  if (!res) {
    toast.add({
      title: "Verification failed",
      description: "Please try again",
      icon: "i-lucide-circle-alert",
      color: "error",
    })
    return
  }
  user.setUser(res)
  navigateTo("/")
}
</script>

<template>
  <EdgeDbAuthEmailVerify
    v-slot="{ loading, check }"
    :redirect-to="undefined"
    :check-on-setup="false"
  >
    <UCard class="max-w-sm font-medium w-full bg-white/75 dark:bg-gray-950/50 backdrop-blur">
      <p class="text-xl mb-4">
        Email Verification
      </p>
      <UButton
        :loading="loading"
        color="primary"
        block
        @vue:mounted="checkAndLinkUser(check)"
      >
        Loading...
      </UButton>
    </UCard>
  </EdgeDbAuthEmailVerify>
</template>
