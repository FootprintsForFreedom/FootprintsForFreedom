<script lang="ts" setup>
import * as v from "valibot"
import type { FormSubmitEvent } from "@nuxt/ui"

const userStore = inject(userStoreKey)!

const usernameSchema = v.object({
  username: v.pipe(v.string("Invalid username"), v.minLength(3, "Username must be at least 3 characters long")),
})

type UsernameSchema = v.InferOutput<typeof usernameSchema>

const state = reactive({
  loading: false,
  username: "",
})

async function onSubmit(event: FormSubmitEvent<UsernameSchema>) {
  state.loading = true
  try {
    await userStore.updateUser({ name: event.data.username })
  } finally {
    state.loading = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <UPageCard
      class="w-full max-w-md relative mt-12"
      title="Welcome to Footprints for Freedom"
      description="Please set a username to get started."
    >
      <UForm
        :schema="usernameSchema"
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

        <UButton
          type="submit"
          :loading="state.loading"
        >
          Submit
        </UButton>
      </UForm>
    </UPageCard>
  </div>
</template>
