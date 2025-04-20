<script lang="ts" setup>
import { defineProps, defineEmits } from "vue"

const { open } = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(["confirm", "cancel", "update:open"])

function hide() {
  emit("update:open", false)
}
function onConfirm() {
  console.log("Confirm delete")
  emit("confirm")
  hide()
}
function onCancel() {
  emit("cancel")
  hide()
}
</script>

<template>
  <UModal
    :open="open"
    title="Delete Account"
    description="Are you sure you want to delete your account? This action cannot be undone. To confirm you will need to click the link in the confirmation email."
    :close-on-esc="true"
    :close-on-backdrop="true"
    :ui="{
      footer: 'justify-end',
    }"
    @update:open="emit('update:open', $event)"
  >
    <template #footer>
      <UButton
        label="Cancel"
        variant="subtle"
        color="neutral"
        @click="onCancel"
      />
      <UButton
        label="Delete"
        variant="solid"
        color="error"
        @click="onConfirm"
      />
    </template>
  </UModal>
</template>
