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
  <div v-if="page">
    <ULandingHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      :ui="{ base: 'relative z-[1]', container: 'max-w-4xl', title: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl' }"
      class="relative mb-[calc(var(--header-height)*2)]"
    >
      <template #top>
        <Gradient class="absolute inset-x-0 top-0 w-full block" />
      </template>

      <template #headline>
        <UBadge
          v-if="page.hero.headline"
          variant="subtle"
          size="lg"
          class="relative rounded-full font-semibold"
        >
          <NuxtLink
            :to="page.hero.headline.to"
            target="_blank"
            class="focus:outline-none"
            tabindex="-1"
          >
            <span
              class="absolute inset-0"
              aria-hidden="true"
            />
          </NuxtLink>

          {{ page.hero.headline.label }}

          <UIcon
            v-if="page.hero.headline.icon"
            :name="page.hero.headline.icon"
            class="ml-1 w-4 h-4 pointer-events-none"
          />
        </UBadge>
      </template>

      <ClientOnly>
        <HomeTetris />
      </ClientOnly>
    </ULandingHero>

    <BoxPlaceholder>
      <!-- <TinyLinkFlow /> -->
      <!-- <ImagePlaceholder /> -->
      <ULandingSection
        :ui="{ wrapper: 'py-12 sm:py-16' }"
        title="How tinylink Works?"
        description="Visitors are redirected to the original URL while the system records their visit data."
      >
        <!-- <img
          src="https://picsum.photos/640/360"
          class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
        > -->
        <ImagePlaceholder />
      </ULandingSection>
    </BoxPlaceholder>

    <ULandingSection
      :title="page.features.title"
      :description="page.features.description"
    >
      <UPageGrid>
        <ULandingCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
        />
      </UPageGrid>
    </ULandingSection>

    <BoxPlaceholder>
      <ULandingSection
        :title="page.useCases.title"
        :description="page.useCases.description"
      >
        <UPageGrid>
          <ULandingCard
            v-for="(item, index) in page.useCases.items"
            :key="index"
            v-bind="item"
          />
        </UPageGrid>
      </ULandingSection>
    </BoxPlaceholder>

    <CallToAction />
  </div>
</template>
