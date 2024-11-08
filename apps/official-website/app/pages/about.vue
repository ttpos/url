<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

const { data: page } = await useAsyncData(`${route.path}`, () => queryContent(route.path).locale(locale.value).findOne(), {
  watch: [locale],
})
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})
</script>

<template>
  <div v-if="page" class="relative">
    <LandingGrid />
    <UContainer>
      <UBlogPost
        :title="page.team?.title"
        :description="page.team?.description"
        orientation="vertical"
        :image="{ src: 'https://picsum.photos/640/360', alt: 'Nuxt 3.9' }"
        class="py-24 sm:py-32 md:py-40"
      >
        <div class="text-gray-900 dark:text-white text-xl font-semibold truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 mt-4">
          {{ page.contact?.title }}
        </div>
        <template #authors>
          <UIcon name="material-symbols:attach-email-outline" class="w-5 h-5" />
        </template>
        <template #date>
          <a :href="`mailto:${page.contact?.email}`" class="hover:text-primary-500 transition-colors">
            {{ page.contact?.email }}
          </a>
        </template>
      </UBlogPost>
    </UContainer>

    <BoxPlaceholder>
      <CallToAction />
    </BoxPlaceholder>
  </div>
</template>
