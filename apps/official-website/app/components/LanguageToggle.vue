<script setup lang="ts">
const { locale: current, setLocaleCookie } = useI18n()

interface Locale {
  code: 'en-US' | 'zh-CN'
  name: string
}

const locales: Locale[] = [
  { code: 'en-US', name: 'En' },
  { code: 'zh-CN', name: '简' },
]

const currentLocale = computed(() => {
  return locales.find(locale => locale.code === current.value)
})

watch(current, (newLocale) => {
  setLocaleCookie(newLocale)
})
</script>

<template>
  <div class="z-99 flex items-center gap-3 rounded-lg border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 px-3 py-1 backdrop-blur-xl">
    <ClientOnly>
      <div
        v-for="locale in locales"
        :key="locale.code"
        class="cursor-pointer select-none"
        @click="$i18n.locale = locale.code"
      >
        <span
          class="font-semibold"
          :class="locale.code === currentLocale.code
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500'"
        >
          {{ locale.name }}
        </span>
      </div>
      <template #fallback>
        <div class="h-2 w-5" />
      </template>
    </ClientOnly>
  </div>
</template>
