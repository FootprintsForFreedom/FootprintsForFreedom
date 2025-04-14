<script lang="ts" setup>
definePageMeta({
  validate: ({ params }) => {
    return params.slug === "imprint" || params.slug === "privacy" || params.slug === "terms"
  },
})

const route = useRoute()
const slug = route.params.slug as string

const { data: legal } = await useFetch(`/api/legal/${slug}`)
</script>

<template>
  <div v-if="legal">
    <UContainer class="py-12 prose">
      <ProseH1>
        {{ legal.title }}
      </ProseH1>

      <ProseP>
        {{ legal.content }}
      </ProseP>
    </UContainer>
  </div>
</template>
