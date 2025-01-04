<script setup lang="ts">
const route = useRoute()

const items = computed(() => [
  {
    label: "Map",
    to: "/map",
    icon: "i-lucide-map",
    active: route.path.startsWith("/map"),
  },
  {
    label: "Discover",
    to: "/discover",
    icon: "i-lucide-compass",
    active: route.path.startsWith("/discover"),
  },
  {
    label: "Search",
    to: "/search",
    icon: "i-lucide-search",
    active: route.path.startsWith("/search"),
  },
])
</script>

<template>
  <UHeader>
    <template #title>
      Footprints
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <LoginOrUserButton />
    </template>
  </UHeader>
</template>
