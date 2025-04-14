<script setup lang="ts">
const items = [
  {
    label: "Imprint",
    to: "/legal/imprint",
  },
  {
    label: "Privacy Policy",
    to: "/legal/privacy",
  },
  {
    label: "Terms of Service",
    to: "/legal/terms",
  },
]
</script>

<template>
  <USeparator
    type="dashed"
    class="h-px"
  />
  <UFooter>
    <template #left>
      <p class="text-(--ui-text-muted) text-sm">
        Copyright © {{ new Date().getFullYear() }}
      </p>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      class="w-fit"
    />

    <template #right>
      <UButton
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        to="https://github.com/FootprintsForFreedom/FootprintsForFreedom"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>
