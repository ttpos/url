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

        <div class="pt-2 pb-6">
          <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            TinyLink 营销活动
          </p>

          <p class="mt-3 text-lg text-gray-500 dark:text-gray-400">
            营销活动可以帮您在一个地方查看、管理和量化多个链接的数据表现。
          </p>
        </div>

        <div class="grid lg:grid-cols-2 lg:items-start gap-8">
          <div class="flex items-start gap-4">
            <UButton
              label="创建活动"
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
