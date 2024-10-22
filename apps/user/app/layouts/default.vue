<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const { locale, t } = useI18n()

const links = [
  {
    id: 'home',
    label: '短链接',
    icon: 'i-heroicons-home',
    to: '/',
    tooltip: {
      text: '短链接',
      shortcuts: ['S', 'L'],
    },
  },
  {
    id: 'qrcode',
    label: 'QR Code',
    icon: 'i-heroicons-inbox',
    to: '/qrcode',
    badge: '4',
    tooltip: {
      text: 'QR Code',
      shortcuts: ['Q', 'R'],
    },
  },
  {
    id: 'marketing',
    label: '营销活动',
    icon: 'i-heroicons-user-group',
    to: '/marketing',
    tooltip: {
      text: '营销活动',
      shortcuts: ['M', 'A'],
    },
  },
  {
    id: 'domain',
    label: '自定义域名',
    icon: 'i-heroicons-user-group',
    to: '/domain',
    tooltip: {
      text: '自定义域名',
      shortcuts: ['D', 'L'],
    },
  },
  {
    id: 'settings',
    label: '设置',
    to: '/settings',
    icon: 'i-heroicons-cog-8-tooth',
    children: [
      {
        label: '通用',
        to: '/settings',
        exact: true,
      },
    ],
    tooltip: {
      text: '设置',
      shortcuts: ['G', 'S'],
    },
  },
]

const groups = [
  {
    key: 'links',
    label: 'Go to',
    commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts })),
  },
  {
    key: 'code',
    label: 'Code',
    commands: [{
      id: 'source',
      label: 'View page source',
      icon: 'i-simple-icons-github',
      click: () => {
        window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
      },
    }],
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
        key: 'enUs',
        click: () => changeLanguage('enUs'),
        active: locale.value === 'enUs',
      },
      {
        label: '简体中文',
        key: 'zhCn',
        click: () => changeLanguage('zhCn'),
        active: locale.value === 'zhCn',
      },
    ],
  },
])

function changeLanguage(lang: string) {
  locale.value = lang
  // TODO: key read in env
  const i18nRedirected = useCookie('user_i18n_redirected')
  i18nRedirected.value = lang
}
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
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
          @update:links="colors => defaultColors = colors"
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
