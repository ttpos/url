<script setup lang="ts">
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

// const userSession = useUserSession()
// console.log('🚀 ~ defineNuxtRouteMiddleware ~ userSession:', userSession)

const { locale } = useI18n()

function initializeLanguage() {
  // TODO: key read in env
  const i18nRedirected = useCookie('user_i18n_redirected')
  if (i18nRedirected.value) {
    locale.value = i18nRedirected.value
  } else {
    const browserLang = navigator.language.split('-')[0]
    const supportedLangs = ['en', 'zh']
    const detectedLang = supportedLangs.includes(browserLang) ? browserLang : 'en'
    
    locale.value = detectedLang === 'en' ? 'enUs' : 'zhCn'
    i18nRedirected.value = locale.value
  }
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
