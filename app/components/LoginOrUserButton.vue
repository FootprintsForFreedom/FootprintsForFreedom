<script lang="ts" setup>
const userStore = inject(userStoreKey)!

const dropdownItems = computed(() => [
  [
    {
      label: "Profile",
      icon: "lucide:user",
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "lucide:settings",
      to: "/settings",
    },
  ],
  [
    {
      label: "Logout",
      icon: "lucide:log-out",
      onSelect: () => {
        userStore.signOut()
      },
    },
  ],
])
</script>

<template>
  <ColorModeSelectButton />
  <UDropdownMenu
    v-if="userStore.loggedIn"
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
        alt: userStore.user?.name,
        size: 'lg',
      }"
    />
  </UDropdownMenu>
  <UButton
    v-else
    color="primary"
    to="/login"
    icon="lucide:log-in"
    aria-label="Login"
  >
    Login
  </UButton>
</template>
