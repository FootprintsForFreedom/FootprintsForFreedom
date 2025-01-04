<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
})

const title = "Nuxt UI Pro - Starter"
const description
  = "Nuxt UI Pro is a collection of premium Vue components built on top of Nuxt UI to create beautiful & responsive Nuxt applications in minutes."

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://ui-pro-starter.nuxt.dev/social-card.png",
  twitterImage: "https://ui-pro-starter.nuxt.dev/social-card.png",
  twitterCard: "summary_large_image",
})

const user = useUserStore()

await callOnce(async () => {
  await user.loadUser()
})
</script>

<template>
  <UApp>
    <WebsiteHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <WebsiteFooter />
  </UApp>
</template>
