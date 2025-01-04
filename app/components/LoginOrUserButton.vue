<script lang="ts" setup>
const user = useUserStore()
const colorMode = useColorMode()

const colorModeOptions = computed(() => [
  {
    id: "light",
    label: "Light",
    icon: "i-lucide-sun",
    disabled: colorMode.preference === "light",
    onSelect: () => {
      colorMode.preference = "light"
    },
  },
  {
    id: "dark",
    label: "Dark",
    icon: "i-lucide-moon",
    disabled: colorMode.preference === "dark",
    onSelect: () => {
      colorMode.preference = "dark"
    },
  },
  {
    id: "auto",
    label: "System",
    icon: "i-lucide-monitor",
    disabled: colorMode.preference === "system",
    onSelect: () => {
      colorMode.preference = "system"
    },
  },
])

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
        user.logout()
      },
    },
  ],
])
</script>

<template>
  <UDropdownMenu
    :items="colorModeOptions"
    :content="{
      align: 'center',
      side: 'bottom',
      sideOffset: 8,
    }"
  >
    <UButton
      color="neutral"
      variant="link"
      icon="i-lucide-sun"
      aria-label="Login"
    />
  </UDropdownMenu>

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
