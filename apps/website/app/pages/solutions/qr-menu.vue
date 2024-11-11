<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

const { data: page } = await useAsyncData(`${route.path}`, () => queryContent(route.path.toLocaleLowerCase()).locale(locale.value).findOne(), {
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
    <ULandingSection
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      :ui="{ base: 'relative z-[1]', title: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl' }"
      class="relative mb-[calc(var(--header-height)*2)]"
      align="left"
    >
      <!-- <img
        src="https://picsum.photos/640/360"
        class="h-[320px] rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
      > -->
      <ImagePlaceholder />
    </ULandingSection>

    <template v-for="(feature, index) in page.features" :key="index">
      <BoxPlaceholder v-if="index % 2 === 0">
        <ULandingSection
          :title="feature.title"
          :description="feature.description"
        >
          <UPageGrid>
            <ULandingCard
              v-for="(item, sIndex) in feature.items"
              :key="sIndex"
              v-bind="item"
            />
          </UPageGrid>
        </ULandingSection>
      </BoxPlaceholder>

      <ULandingSection
        v-else
        :title="feature.title"
        :description="feature.description"
      >
        <UPageGrid>
          <ULandingCard
            v-for="(item, sIndex) in feature.items"
            :key="sIndex"
            v-bind="item"
          />
        </UPageGrid>
      </ULandingSection>
    </template>

    <BoxPlaceholder>
      <ULandingSection
        :title="page.sections.title"
        :description="page.sections.description"
        :align="page.sections.align"
        :features="page.sections.features"
      >
        <ImagePlaceholder />
      </ULandingSection>
    </BoxPlaceholder>

    <CallToAction />
  </div>
</template>
