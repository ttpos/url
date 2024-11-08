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
    <ULandingHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      :ui="{ base: 'relative z-[1]', container: 'max-w-4xl', title: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl' }"
      class="relative mb-[calc(var(--header-height)*2)]"
    />

    <BoxPlaceholder>
      <ULandingSection
        :title="page.freedom.title"
        :description="page.freedom.description"
        align="center"
        :ui="{ wrapper: 'py-12 sm:py-16' }"
      >
        <!-- <img
          src="https://picsum.photos/640/360"
          class="h-[320px] rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
        > -->
        <ImagePlaceholder />
      </ULandingSection>
    </BoxPlaceholder>

    <template v-for="(section, index) in page.sections" :key="index">
      <BoxPlaceholder v-if="index % 2 !== 0">
        <ULandingSection
          :title="section.title"
          :description="section.description"
          :align="section.align"
          :features="section.features"
        >
          <ImagePlaceholder />
        </ULandingSection>
      </BoxPlaceholder>

      <ULandingSection
        v-else
        :title="section.title"
        :description="section.description"
        :align="section.align"
        :features="section.features"
      >
        <ImagePlaceholder />
      </ULandingSection>
    </template>

    <ULandingSection
      :title="page.batch.title"
      :description="page.batch.description"
      align="left"
    >
      <!-- <img
        src="https://picsum.photos/640/360"
        class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
      > -->
      <ImagePlaceholder />
    </ULandingSection>

    <BoxPlaceholder>
      <CallToAction />
    </BoxPlaceholder>
  </div>
</template>
