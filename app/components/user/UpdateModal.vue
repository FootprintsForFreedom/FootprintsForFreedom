<script lang="ts" setup>
import { defineProps, defineEmits } from "vue"
import type { FormSubmitEvent } from "@nuxt/ui"
import { updateUserSchema } from "#shared/schemas/User"

const props = defineProps({
  open: { type: Boolean, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(["update:open", "submit", "cancel"])

const formState = reactive({
  username: props.username,
  email: props.email,
})

watch(() => [props.username, props.email], ([newUsername, newEmail]) => {
  formState.username = newUsername ?? ""
  formState.email = newEmail ?? ""
})

function hide() {
  emit("update:open", false)
}

function onSubmit(event: FormSubmitEvent<UpdateUserSchema>) {
  emit("submit", { username: event.data.username, email: event.data.email })
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
    title="Update your account"
    description="Change your username or email"
    :close-on-esc="true"
    :close-on-backdrop="true"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm
        :schema="updateUserSchema"
        :state="formState"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Username"
          name="username"
        >
          <UInput
            v-model="formState.username"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="formState.email"
            class="w-full"
          />
        </UFormField>
        <UAlert
          color="neutral"
          variant="subtle"
          icon="lucide:info"
          title="E-Mail Change"
          description="Your email will be changed after you verify the new email address."
        />
        <div class="flex gap-2 justify-end">
          <UButton
            label="Cancel"
            variant="subtle"
            color="neutral"
            type="button"
            @click="onCancel"
          />
          <UButton
            type="submit"
            :loading="loading"
          >
            Update
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
