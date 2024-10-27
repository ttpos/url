<script setup lang="ts">
definePageMeta({
  layout: 'preview',
})

useSeoMeta({
  title: 'QR Code preview - TinyLink',
})
</script>

<template>
  <ULandingSection
    :description="$t('qrPreview.description')"
    align="center"
    :ui="{
      title: 'text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl',
      description: 'mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300',
    }"
  >
    <template #title>
      <p>{{ $t('qrPreview.header.title') }}</p>
      <p class="mt-6 text-2xl text-gray-600 dark:text-gray-300">
        {{ $t('qrPreview.header.subtitle') }}
      </p>
    </template>

    <!-- <template #default>
      <img
        src="https://picsum.photos/360/640"
        class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
      >
    </template> -->

    <template #links>
      <p class="text-center my-6 text-xl text-gray-600 dark:text-gray-300">
        {{ $t('qrPreview.features.intro.text') }}<br>
        {{ $t('qrPreview.features.intro.subtext') }}
      </p>
      <ULandingGrid>
        <ULandingCard
          class="col-span-6 row-span-2"
          icon="icon-park-outline:link-two"
          :title="$t('qrPreview.features.shortLink.title')"
          :description="$t('qrPreview.features.shortLink.description')"
        />
        <ULandingCard
          class="col-span-6 row-span-2"
          icon="ic:baseline-pages"
          :title="$t('qrPreview.features.tinyPage.title')"
          :description="$t('qrPreview.features.tinyPage.description')"
        />
      </ULandingGrid>
    </template>
  </ULandingSection>
</template>
