<script setup lang="ts">
const { locale } = useI18n()
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: '/logo.svg' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

// SEO config
const title = '@ttpos/a-app-official-website'
const description = '@ttpos/a-app-official-website SaaS'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogLocale: () => locale.value,
  // ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  // twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  // twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ScrollToTop />
    <UNotifications />
  </div>
</template>
