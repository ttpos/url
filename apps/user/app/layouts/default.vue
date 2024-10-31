<script setup lang="ts">
const {
  public: {
    i18nCookieKey,
  },
} = useRuntimeConfig()
const route = useRoute()
const appConfig = useAppConfig()

const { locale, t } = useI18n()

const links = computed(() => [
  {
    id: 'home',
    label: t('common.nav.index'),
    icon: 'i-heroicons-home',
    to: '/',
    tooltip: {
      text: t('common.nav.index'),
      shortcuts: ['S', 'L'],
    },
  },
  {
    id: 'shortLink',
    label: t('common.nav.shortLink'),
    icon: 'i-heroicons-link',
    to: '/shortLink',
    tooltip: {
      text: t('common.nav.shortLink'),
      shortcuts: ['S', 'L'],
    },
  },
  {
    id: 'qrc',
    label: t('common.nav.qrCode'),
    icon: 'i-heroicons-qr-code',
    to: '/qrc',
    tooltip: {
      text: t('common.nav.qrCode'),
      shortcuts: ['Q', 'R'],
    },
  },
  {
    id: 'marketing',
    label: t('common.nav.marketing'),
    icon: 'i-hugeicons:marketing',
    to: '/marketing',
    tooltip: {
      text: t('common.nav.marketing'),
      shortcuts: ['M', 'A'],
    },
  },
  {
    id: 'domain',
    label: t('common.nav.customDomain'),
    icon: 'i-gridicons:domains',
    to: '/domain',
    tooltip: {
      text: t('common.nav.customDomain'),
      shortcuts: ['D', 'L'],
    },
  },
  {
    id: 'settings',
    label: t('common.nav.settings'),
    to: '/settings',
    icon: 'i-heroicons-cog-8-tooth',
    children: [
      {
        label: t('common.nav.general'),
        to: '/settings',
        exact: true,
      },
      {
        label: t('common.nav.equity'),
        to: '/settings/equity',
      },
    ],
    tooltip: {
      text: t('common.nav.settings'),
      shortcuts: ['G', 'S'],
    },
  },
])

const groups = [
  {
    key: 'links',
    label: 'Go to',
    commands: links.value.map(link => ({
      ...link,
      shortcuts: link.tooltip?.shortcuts,
    })),
  },
  {
    key: 'code',
    label: 'Code',
    commands: [
      {
        id: 'source',
        label: 'View page source',
        icon: 'i-simple-icons-github',
        click: () => {
          window.open(
            `https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`,
            '_blank',
          )
        },
      },
    ],
  },
]

const defaultColors = ref(
  ['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({
    label: color,
    chip: color,
    click: () => (appConfig.ui.primary = color),
  })),
)

const colors = computed(() =>
  defaultColors.value.map(color => ({
    ...color,
    active: appConfig.ui.primary === color.label,
  })),
)

const i18nLinks = computed(() => [
  {
    label: t('common.i18n'),
    icon: 'i-heroicons:language',
    children: [
      {
        label: 'English',
        key: 'en-US',
        click: () => changeLanguage('en-US'),
        active: locale.value === 'en-US',
      },
      {
        label: '简体中文',
        key: 'zh-CN',
        click: () => changeLanguage('zh-CN'),
        active: locale.value === 'zh-CN',
      },
    ],
  },
])

function changeLanguage(lang: string) {
  locale.value = lang

  const i18nRedirected = useCookie(i18nCookieKey)

  i18nRedirected.value = lang
}
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <TeamsDropdown />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <UDashboardSidebarLinks
          :links="[{ label: 'Colors', draggable: true, children: colors }]"
          @update:links="(colors) => (defaultColors = colors)"
        />

        <UDivider />

        <UDashboardSidebarLinks :links="i18nLinks" />

        <div class="flex-1" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>
