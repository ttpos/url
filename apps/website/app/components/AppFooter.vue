<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const links = computed(() => [
  {
    label: t('footer.features.label'),
    children: [
      { label: t('footer.features.children.short_link'), to: '/features/shortLink' },
      { label: t('footer.features.children.qr_code'), to: '/features/qrc' },
      { label: t('footer.features.children.custom_domain'), to: '/features/domain' },
      { label: t('footer.features.children.marketing_campaign'), to: '/features/marketing' },
    ],
  },
  {
    label: t('footer.solutions.label'),
    children: [
      { label: t('footer.solutions.children.analytics'), to: '/solutions/analytics' },
      { label: t('footer.solutions.children.bulk_qr'), to: '/solutions/bulk-qr' },
      { label: t('footer.solutions.children.qr_menu'), to: '/solutions/qr-menu' },
      // { label: t('footer.solutions.children.print_materials') },
      // { label: t('footer.solutions.children.ab_testing') },
      { label: t('footer.solutions.children.sms_marketing'), to: '/solutions/sms-marketing' },
    ],
  },
  {
    label: t('footer.contact.label'),
    children: [
      { label: t('footer.contact.children.about'), to: '/about' },
      { label: t('footer.contact.children.terms'), to: '/terms' },
      { label: t('footer.contact.children.privacy'), to: '/privacy' },
    ],
  },
])
</script>

<template>
  <UFooter>
    <template #top>
      <UFooterColumns
        :links="links"
        :ui="{ active: 'text-primary-600 dark:text-primary-400 font-medium' }"
      >
        <template #left>
          <NuxtLink
            to="/"
            class="text-gray-900 dark:text-white text-2xl font-semibold truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200"
          >
            TinyLink
          </NuxtLink>
          <div class="text-base text-gray-500 dark:text-gray-400 mt-2">
            {{ $t('footer.slogan') }}
          </div>
          <div class="text-gray-900 dark:text-white text-2xl font-semibold truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 mt-6">
            {{ $t('footer.download.title') }}
          </div>
          <div class="flex items-start flex-col mt-4 gap-4">
            <UButton
              to="https://www.apple.com.cn/app-store/"
              target="_blank"
              icon="i-simple-icons-appstore"
              color="gray"
              :label="$t('footer.download.app_store')"
              size="lg"
            />
            <UButton
              to="https://play.google.com/"
              target="_blank"
              icon="i-simple-icons-googleplay"
              color="gray"
              :label="$t('footer.download.google_play')"
              size="lg"
            />
          </div>
        </template>
      </UFooterColumns>
    </template>

    <template #left>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
      </p>
    </template>

    <template #right>
      <UColorModeButton />
      <UButton icon="i-simple-icons-x" color="gray" variant="ghost" />
      <UButton icon="i-simple-icons-discord" color="gray" variant="ghost" />
      <UButton
        to="https://github.com/ttpos/url/"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="gray"
        variant="ghost"
      />
      <LanguageToggle />
    </template>
  </UFooter>
</template>
