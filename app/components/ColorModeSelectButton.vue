<script lang="ts" setup>
const { t } = useLocalePro()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const items = computed(() => [
  {
    label: t("colorMode.system"),
    value: "system",
    icon: appConfig.ui.icons.system,
    type: "checkbox" as const,
    checked: colorMode.preference === "system",
    onUpdateChecked() {
      colorMode.preference = "system"
    },
  },
  {
    label: t("colorMode.light"),
    value: "light",
    icon: appConfig.ui.icons.light,
    type: "checkbox" as const,
    checked: colorMode.preference === "light",
    onUpdateChecked() {
      colorMode.preference = "light"
    },
  },
  {
    label: t("colorMode.dark"),
    value: "dark",
    icon: appConfig.ui.icons.dark,
    type: "checkbox" as const,
    checked: colorMode.preference === "dark",
    onUpdateChecked() {
      colorMode.preference = "dark"
    },
  },
])

const isDark = computed({
  get() {
    return colorMode.value === "dark"
  },
  set(_isDark: boolean) {
    colorMode.preference = _isDark ? "dark" : "light"
  },
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UContextMenu
      :items="items"
    >
      <UButton
        :icon="isDark ? appConfig.ui.icons.dark : appConfig.ui.icons.light"
        color="neutral"
        variant="ghost"
        :aria-label="isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark')"
        v-bind="$attrs"
        @click="isDark = !isDark"
      />
    </UContextMenu>

    <template #fallback>
      <slot name="fallback">
        <div class="size-8" />
      </slot>
    </template>
  </ClientOnly>
</template>
