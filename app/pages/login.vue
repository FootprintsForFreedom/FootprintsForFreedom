<script setup lang="ts">
import * as v from "valibot"
import type { FormSubmitEvent } from "#ui/types"

definePageMeta({
  layout: "auth",
})

const schema = v.object({
  email: v.pipe(
    v.string("E-Mail wird benötigt."),
    v.trim(),
    v.nonEmpty("E-Mail wird benötigt."),
    v.email("E-Mail ist ungültig."),
  ),
  password: v.pipe(
    v.string("Passwort wird benötigt."),
    v.trim(),
    v.nonEmpty("Passwort wird benötigt."),
  ),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  email: "",
  password: "",
})
const loginForm = ref()

const toast = useToast()
async function onSubmit(
  event: FormSubmitEvent<Schema>,
  updateEmail: (value: string) => void,
  updatePassword: (value: string) => void,
  submit: () => Promise<void>,
) {
  updateEmail(event.data.email)
  updatePassword(event.data.password)
  await submit()
  if (!loginForm.value?.success) {
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
  <div class="login">
    <EdgeDbAuthEmailLogin
      :ref="loginForm"
      v-slot="{ updateEmail, updatePassword, submit, loading }"
      redirect-to="/"
    >
      <UCard class="max-w-sm w-full bg-white/75 dark:bg-gray-950/50 backdrop-blur">
        <template #header>
          <h2>Login</h2>
        </template>

        <UForm
          :schema="v.safeParser(schema)"
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
            />
          </UFormField>
          <UFormField
            label="Password"
            name="password"
          >
            <UInput
              v-model="state.password"
              type="password"
            />
          </UFormField>

          <UButton
            type="submit"
            :loading="loading"
          >
            Login
          </UButton>

          <OAuthProviders />
        </UForm>
      </UCard>
    </EdgeDbAuthEmailLogin>
  </div>
</template>
