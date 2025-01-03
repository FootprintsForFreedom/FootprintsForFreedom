<script setup lang="ts">
import * as v from "valibot"
import type { FormSubmitEvent } from "#ui/types"
import { UserLoginSchema, type UserLoginInput } from "~~/shared/schemas/User"

definePageMeta({
  layout: "auth",
})

const state = reactive({
  email: "",
  password: "",
})

const toast = useToast()
async function onSubmit(
  event: FormSubmitEvent<UserLoginInput>,
  updateEmail: (value: string) => void,
  updatePassword: (value: string) => void,
  submit: () => Promise<unknown>,
) {
  updateEmail(event.data.email)
  updatePassword(event.data.password)
  const response = await submit()
  if (!response) {
    console.log("Login failed")
    toast.add({
      title: "Login failed",
      description: "Please check your credentials and try again.",
      icon: "i-heroicons-exclamation-circle",
      color: "error",
    })
  }
}
</script>

<template>
  <EdgeDbAuthEmailLogin
    v-slot="{ updateEmail, updatePassword, submit, loading }"
    redirect-to="/"
  >
    <UCard class="max-w-sm w-full bg-white/75 dark:bg-gray-950/50 backdrop-blur">
      <template #header>
        <h2>Login</h2>
      </template>

      <UForm
        :schema="v.safeParser(UserLoginSchema)"
        :state="state"
        class="space-y-4"
        @submit="onSubmit($event, updateEmail, updatePassword, submit)"
      >
        <UFormField
          label="E-Mail"
          name="email"
        >
          <UInput
            v-model="state.email"
            class="max-w-sm w-full"
          />
        </UFormField>
        <UFormField
          label="Password"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            class="max-w-sm w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="loading"
          class="max-w-sm w-full"
          block
        >
          Login
        </UButton>

        <OAuthProviders />
      </UForm>
    </UCard>
  </EdgeDbAuthEmailLogin>
</template>
