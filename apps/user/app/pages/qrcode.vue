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
          TinyLink QR Code
        </p>

        <div class="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          TinyLink QR Code 可通过移动设备的摄像头读取，是短链接的可扫描形式。
        </div>

        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <div class="flex items-start gap-4">
            <UButton
              label="创建 QR Code"
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
