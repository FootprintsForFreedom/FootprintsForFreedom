<script setup lang="ts">
definePageMeta({
  layout: "auth",
})
</script>

<template>
  <div class="login">
    <EdgeDbAuthEmailLogin
      v-slot="{ email, updateEmail, password, updatePassword, submit, loading }"
      redirect-to="/"
    >
      <UCard class="max-w-sm w-full bg-white/75 dark:bg-gray-950/50 backdrop-blur">
        <template #header>
          <h2>Login</h2>
        </template>

        <div class="flex flex-col gap-4">
          <UFormField label="Email">
            <UInput
              type="email"
              :value="email"
              placeholder="your@email.com"
              @change="(e: any) => updateEmail(e.target.value)"
              @keyup.enter="() => submit()"
            />
          </UFormField>
          <UFormField label="Password">
            <UInput
              type="password"
              :value="password"
              placeholder="password"
              @change="(e: any) => updatePassword(e.target.value)"
              @keyup.enter="() => submit()"
            />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex items-center gap-2">
            <UButton
              type="button"
              color="neutral"
              :loading="loading"
              @click="() => submit()"
            >
              Login
            </UButton>

            <OAuthProviders />
          </div>
        </template>
      </UCard>
    </EdgeDbAuthEmailLogin>
  </div>
</template>
