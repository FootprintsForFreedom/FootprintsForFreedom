<script lang="ts" setup>
import * as v from "valibot"
import { UserSignupSchema, type UserSignupInput } from "#shared/schemas/User"
import type { FormSubmitEvent } from "#ui/types"

definePageMeta({
  layout: "auth",
})

const state = reactive({
  name: "",
  email: "",
  password: "",
})

const toast = useToast()
async function onSubmit(
  event: FormSubmitEvent<UserSignupInput>,
  updateEmail: (value: string) => void,
  updatePassword: (value: string) => void,
  submit: () => Promise<unknown>,
) {
  updateEmail(event.data.email)
  updatePassword(event.data.password)
  const response = await submit()
  console.log(response)
  if (!response) {
    console.log("Signup failed")
    toast.add({
      title: "Signup failed",
      icon: "i-lucide-circle-alert",
      color: "error",
    })
  } else {
    await $fetch("/api/users", {
      method: "POST",
      body: {
        name: state.name,
        email: state.email,
      },
    })
    navigateTo("/")
  }
}
</script>

<template>
  <EdgeDbAuthEmailSignup
    v-slot="{ updateEmail, updatePassword, submit, loading }"
    :redirect-to="undefined"
  >
    <UCard class="max-w-sm w-full bg-white/75 dark:bg-gray-950/50 backdrop-blur">
      <p class="text-xl mb-4">
        Sign Up
      </p>

      <UForm
        :schema="v.safeParser(UserSignupSchema)"
        :state="state"
        class="space-y-4"
        @submit="onSubmit($event, updateEmail, updatePassword, submit)"
      >
        <UFormField
          label="Name"
          name="name"
        >
          <UInput
            v-model="state.name"
            class="max-w-sm w-full"
          />
        </UFormField>

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
          Sign Up
        </UButton>

        <OAuthProviders />
      </UForm>
      <div class="text-center text-sm mt-4">
        Already have an account? <ULink to="/login">Login</ULink> instead.
      </div>
    </UCard>
  </EdgeDbAuthEmailSignup>
</template>
