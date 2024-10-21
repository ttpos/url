<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

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
          TinyLink 营销活动
        </p>

        <div class="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          营销活动可以帮您在一个地方查看、管理和量化多个链接的数据表现。
        </div>

        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
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
