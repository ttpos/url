<script setup lang="ts">
const { t } = useI18n()

const links = computed(() => [
  [
    {
      label: t('common.nav.general'),
      icon: 'i-heroicons-user-circle',
      to: '/settings',
      exact: true,
    },
    {
      label: t('common.nav.equity'),
      icon: 'i-material-symbols:interests-outline',
      to: '/settings/equity',
    },
  ],
  [
    {
      label: t('common.nav.document'),
      icon: 'i-heroicons-book-open',
      to: 'https://github.com/ttpos/url',
      target: '_blank',
    },
  ],
])
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('common.nav.settings')" />

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
