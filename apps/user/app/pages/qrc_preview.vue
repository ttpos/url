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
    description="If you are seeing this message, your QR Code is still a preview. Make sure you finish customizating your QR Code and then select 'Create QR Code'."
    align="center"
    :ui="{ title: 'text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl' }"
  >
    <template #title>
      <p>
        You're almost there!
      </p>
      <p class="mt-6 text-2xl text-gray-600 dark:text-gray-300">
        Don't forget to finish creating your QR Code.
      </p>
    </template>

    <!-- <template #default>
      <img
        src="https://picsum.photos/360/640"
        class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
      >
    </template> -->

    <template #links>
      <p class="text-center mt-6 text-xl text-gray-600 dark:text-gray-300">
        While you are here... <br>
        Check out what else you can do with TinyLink
      </p>
      <ULandingGrid>
        <ULandingCard
          class="col-span-6 row-span-2"
          icon="icon-park-outline:link-two"
          title=""
          description="Personalize, share, and track your short links"
        />
        <ULandingCard
          class="col-span-6 row-span-2"
          icon="i-heroicons-wrench-screwdriver"
          title=""
          description="Showcase your important links with a TinyLink page"
        />
      </ULandingGrid>
    </template>
  </ULandingSection>
</template>
