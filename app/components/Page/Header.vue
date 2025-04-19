<script lang="ts" setup>
const props = defineProps<{ title: string }>()
</script>

<template>
  <header class="py-6">
    <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
      {{ props.title }}
    </h1>
  </header>
</template>
