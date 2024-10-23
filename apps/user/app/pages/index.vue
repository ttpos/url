<script setup lang="ts">
definePageMeta({
  middleware: ['protected'],
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('index.dashboard')" />

      <UDashboardPanelContent>
        <ULandingCTA
          :title="$t('index.ctaTitle')"
          :description="$t('index.ctaDescription')"
          align="center"
          card
          :links="[
            { label: $t('index.getStarted'), to: '/shortLink' },
            {
              label: $t('index.learnMore'),
              variant: 'link',
              color: 'gray',
              trailingIcon: 'i-heroicons-arrow-right-20-solid',
            },
          ]"
        >
          <!-- <img
            src="https://picsum.photos/640/360"
            class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
          > -->
        </ULandingCTA>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
