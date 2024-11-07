<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))

const { t } = useI18n()

const links = computed(() => [
  {
    label: t('header.product_features.label'),
    icon: 'i-heroicons-book-open',
    description: t('header.product_features.description'),
    children: [
      {
        label: t('header.product_features.children.short_link.label'),
        icon: 'i-heroicons-link',
        to: '/features/shortLink',
        description: t('header.product_features.children.short_link.description'),
      },
      {
        label: t('header.product_features.children.qr_code.label'),
        icon: 'i-heroicons-qr-code',
        to: '/features/qrc',
        description: t('header.product_features.children.qr_code.description'),
      },
      {
        label: t('header.product_features.children.custom_domain.label'),
        icon: 'i-gridicons:domains',
        to: '/features/domain',
        description: t('header.product_features.children.custom_domain.description'),
      },
      {
        label: t('header.product_features.children.marketing_campaign.label'),
        icon: 'i-hugeicons:marketing',
        to: '/features/marketing',
        description: t('header.product_features.children.marketing_campaign.description'),
      },
    ],
  },
  {
    label: t('header.solutions.label'),
    icon: 'i-heroicons-square-3-stack-3d',
    description: t('header.solutions.description'),
    children: [
      {
        label: t('header.solutions.children.qr_menu.label'),
        icon: 'i-heroicons-squares-2x2',
        to: '/solutions/qr-menu',
        description: t('header.solutions.children.qr_menu.description'),
      },
      {
        label: t('header.solutions.children.sms_marketing.label'),
        icon: 'i-heroicons-chat-bubble-left-right',
        to: '/solutions/sms-marketing',
        description: t('header.solutions.children.sms_marketing.description'),
      },
      {
        label: t('header.solutions.children.bulk_qr.label'),
        icon: 'i-heroicons-queue-list',
        to: '/solutions/bulk-qr',
        description: t('header.solutions.children.bulk_qr.description'),
      },
      {
        label: t('header.solutions.children.analytics.label'),
        icon: 'i-heroicons-chart-bar',
        to: '/solutions/analytics',
        description: t('header.solutions.children.analytics.description'),
      },
    ],
  },
  {
    label: t('header.about.label'),
    icon: 'i-heroicons-rocket-launch',
    to: '/about',
  },
])
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      TinyLink
    </template>

    <template #right>
      <UButton
        label="Sign in"
        color="gray"
        to="/login"
      />
      <UButton
        label="Sign up"
        icon="i-heroicons-arrow-right-20-solid"
        trailing
        color="black"
        to="/signup"
        class="hidden lg:flex"
      />
    </template>

    <!-- <template #panel>
      <UAsideLinks :links="links" />

      <UDivider type="dashed" class="my-4" />

      <UNavigationTree :links="mapContentNavigation(navigation)" :multiple="false" default-open />
    </template> -->

    <template #panel>
      <UNavigationAccordion :links="links" />

      <!-- <UNavigationTree
        :links="mapContentNavigation(navigation)"
        default-open
      /> -->
      <UNavigationTree :links="mapContentNavigation(navigation)" :multiple="false" default-open />
    </template>
  </UHeader>
</template>
