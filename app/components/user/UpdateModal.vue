<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui"
import * as v from "valibot"

const userStore = inject(userStoreKey)!

const updateUserSchema = v.object({
  username: v.pipe(v.string("Invalid name"), v.minLength(3, "Name must be at least 3 characters long")),
  email: v.pipe(v.string("Invalid email"), v.email("Invalid email")),
})

type UpdateUserSchema = v.InferOutput<typeof updateUserSchema>

const state = reactive({
  open: false,
  loading: false,
  username: userStore.user?.name ?? "",
  email: userStore.user?.email ?? "",
})

async function onSubmit(event: FormSubmitEvent<UpdateUserSchema>) {
  state.loading = true
  try {
    await userStore.updateUser({ name: event.data.username })
  } finally {
    state.open = false
    state.loading = false
  }
}
</script>

<template>
  <UModal
    v-model:open="state.open"
    title="Update your account"
    description="Change your username or email"
  >
    <UButton
      label="Change name or email"
      variant="subtle"
      block
    />
    <template #body>
      <UForm
        :schema="updateUserSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Username"
          name="username"
        >
          <UInput
            v-model="state.username"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
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

        <UButton
          type="submit"
          :loading="state.loading"
        >
          Update
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
