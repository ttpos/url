<script setup lang="ts">
const { locale } = useI18n()
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')
const htmlAttrs = computed(() => ({
  lang: locale.value,
}))

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: '/logo.svg' },
  ],
  htmlAttrs,
})

// SEO config
const title = '@ttpos/a-app-website'
const description = '@ttpos/a-app-website SaaS'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogLocale: () => locale.value,
  ogImage: 'https://web.a.app/20241112141248.png',
  twitterImage: 'https://web.a.app/20241112141248.png',
  twitterCard: 'summary_large_image',
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
