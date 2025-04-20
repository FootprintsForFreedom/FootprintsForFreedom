<script lang="ts" setup>
const userStore = inject(userStoreKey)!

const dropdownItems = computed(() => [
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/settings",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      onSelect: () => {
        userStore.logout()
      },
    },
  ],
])
</script>

<template>
  <ColorModeSelectButton />
  <UDropdownMenu
    v-if="user.isLoggedIn"
    :items="dropdownItems"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8,
    }"
  >
    <UButton
      variant="link"
      aria-label="User"
      :avatar="{
        alt: user.user?.name,
        size: 'lg',
      }"
    />
  </UDropdownMenu>
  <UButton
    v-else
    color="primary"
    to="/login"
    icon="i-lucide-log-in"
    aria-label="Login"
  >
    Login
  </UButton>
</template>
