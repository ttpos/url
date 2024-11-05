<script setup lang="ts">
const links = [
  {
    label: 'Features',
    children: [
      { label: '短链接' },
      { label: 'QR code' },
      { label: '自定义域名' },
      { label: '营销活动' },
    ],
  },
  {
    label: 'Solutions',
    children: [
      { label: '营销活动访问量统计' },
      { label: '预先生成二维码' },
      { label: '二维码菜单' },
      { label: '简化印刷材料' },
      { label: '页面 A/B 测试' },
      { label: '短信营销' },
    ],
  },
  {
    label: 'Contact US',
    children: [
      { label: 'About US' },
      { label: 'Terms of Service' },
      { label: 'Privacy Policy' },
    ],
  },
]
</script>

<template>
  <UFooter>
    <template #top>
      <UFooterColumns
        :links="links"
        :ui="{
          wrapper: 'xl:grid xl:grid-cols-4 xl:gap-8 xl:text-center',
          left: 'xl:text-left',
          right: 'xl:text-right',
        }"
      >
        <template #left>
          <div class="text-gray-900 dark:text-white text-2xl font-semibold truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
            TinyLink
          </div>
          <div class="text-base text-gray-500 dark:text-gray-400 mt-1">
            简单好用，即刻上手！
          </div>
        </template>
        <template #right>
          <div class="text-gray-900 dark:text-white text-2xl font-semibold truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
            Download the App
          </div>
          <div class="flex xl:flex-col xl:items-center xl:ml-16 mt-4 gap-16 sm:gap-y-6">
            <UButton
              to="https://www.apple.com.cn/app-store/"
              target="_blank"
              icon="i-simple-icons-appstore"
              color="gray"
              label="App Store"
              size="lg"
            />
            <UButton
              to="https://play.google.com/"
              target="_blank"
              icon="i-simple-icons-googleplay"
              color="gray"
              label="Google Play"
              size="lg"
            />
          </div>
        </template>
      </UFooterColumns>
    </template>

    <template #left>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Copyright © {{ new Date().getFullYear() }}. XXX Co., Ltd.
      </p>
    </template>

    <template #right>
      <UColorModeButton size="sm" />
      <UButton icon="i-simple-icons-x" color="gray" variant="ghost" to="https://x.com/nuxt_js" target="_blank" />
      <UButton icon="i-simple-icons-discord" color="gray" variant="ghost" to="https://discord.com/invite/ps2h6QT" target="_blank" />
      <UButton
        to="https://github.com/ttpos/url/"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="gray"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
