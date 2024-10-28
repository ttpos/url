<script setup lang="ts">
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '~/composables'

// Composables
const colorMode = useColorMode()
const { locale } = useI18n()
const { public: { i18nCookieKey } } = useRuntimeConfig()

// Computed
const themeColor = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

// Head config
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: themeColor },
  ],
  link: [
    { rel: 'icon', href: '/logo.svg' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

// SEO config
const title = '@ttpos/a-app-user'
const description = '@ttpos/a-app-user Dashboard'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  // ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  // twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  // twitterCard: 'summary_large_image',
})

// Language initialization
function getPreferredLanguage(): string {
  try {
    const browserLang = navigator.language
    return SUPPORTED_LANGUAGES.includes(browserLang as typeof SUPPORTED_LANGUAGES[number])
      ? browserLang
      : DEFAULT_LANGUAGE
  }
  catch {
    return DEFAULT_LANGUAGE
  }
}

function initializeLanguage() {
  const i18nRedirected = useCookie(i18nCookieKey)

  if (i18nRedirected.value) {
    locale.value = i18nRedirected.value
    return
  }

  const preferredLang = getPreferredLanguage()
  locale.value = preferredLang
  i18nRedirected.value = preferredLang
}

onMounted(() => {
  initializeLanguage()
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>
