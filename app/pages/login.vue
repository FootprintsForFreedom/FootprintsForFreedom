<script lang="ts" setup>
import * as v from "valibot"
import type { FormSubmitEvent } from "@nuxt/ui"
import type { Schema } from "effect"

definePageMeta({
  layout: "auth",
})

const { $auth } = useNuxtApp()
const route = useRoute()

const loading = ref(false)
const emailSent = ref(false)

const fields = [{
  name: "email",
  type: "text" as const,
  label: "Email",
  placeholder: "Enter your email",
  required: true,
}]

const submitButton = computed(() => ({
  label: "Continue with email",
  block: true,
  loading: loading.value,
}))

const schema = v.object({
  email: v.pipe(v.string("Invalid email"), v.email("Invalid email")),
})

type Schema = v.InferOutput<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  const callbackURL = route.query["redirect"] as string | undefined ?? "/profile"

  await $auth.signIn.magicLink({
    email: payload.data.email,
    callbackURL,
  })
  loading.value = false
  emailSent.value = true
}
</script>

<template>
  <UPageCard class="w-full max-w-md relative">
    <Transition
      enter-active-class="transition duration-300 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <UAuthForm
        v-if="!emailSent"
        key="login"
        :schema="schema"
        title="Login"
        description="Enter your email to login or sign up."
        icon="i-lucide-user"
        :fields="fields"
        :submit="submitButton"
        @submit="onSubmit"
      >
        <template #footer>
          By signing in, you agree to our
          <ULink
            to="/legal/terms"
            class="text-(--ui-primary) font-medium"
          >
            Terms of Service
          </ULink>.
        </template>
      </UAuthForm>

      <UAuthForm
        v-else
        key="email-sent"
        title="Check your email"
        description="We sent you a link to your email. Click it to login."
        icon="i-lucide-check-circle"
        :submit="{
          label: 'Resend email',
          block: true,
        }"
        @submit="onSubmit"
      />
    </Transition>
  </UPageCard>
</template>
