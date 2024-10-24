<script setup lang="ts">
definePageMeta({
  middleware: ['protected'],
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <!-- <UDashboardNavbar title="Domain" /> -->

      <div class="flex flex-col border-b border-gray-200 dark:border-gray-800 p-4 gap-x-4 min-w-0">
        <UDashboardNavbarToggle class="pb-4 pl-0" />

        <p class="text-gray-900 dark:text-white font-semibold">
          TinyLink 自定义域名
        </p>

        <div class="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          使用自定义域名为短链接添加个性化域名标识，替换默认的 "tiny.com" 域名，全面掌控内容并提升品牌形象。
        </div>

        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <div class="flex items-start gap-4">
            <UButton
              label="添加域名"
              icon="i-heroicons-plus"
            />
          </div>
        </div>
      </div>

      <UDashboardPanelContent>
        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
