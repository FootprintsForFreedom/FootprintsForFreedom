<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: "dark:bg-(--ui-color-neutral-950)",
  },
})
</script>

<template>
  <div class="h-screen flex items-center justify-center overlay">
    <div class="gradient" />

    <slot />
  </div>
</template>

<style scoped>
.gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(50% 50% at 50% 50%, var(--ui-color-primary-300) 0, #FFF 100%);
}

.dark {
  .gradient {
    background: radial-gradient(50% 50% at 50% 50%, var(--ui-color-primary-900) 0, var(--ui-color-neutral-950) 100%);
  }
}

.overlay {
  background-size: 100px 100px;
  background-image:
    linear-gradient(to right, var(--ui-color-neutral-200) 0.5px, transparent 0.5px),
    linear-gradient(to bottom, var(--ui-color-neutral-200) 0.5px, transparent 0.5px);
}

.dark {
  .overlay {
    background-image:
      linear-gradient(to right, var(--ui-color-neutral-900) 0.5px, transparent 0.5px),
      linear-gradient(to bottom, var(--ui-color-neutral-900) 0.5px, transparent 0.5px);
  }
}
</style>
