<script setup lang="ts">
definePageMeta({
  middleware: ['protected'],
})

const page = ref(1)

const shortLinks = ref([
  {
    id: 1,
    title: 'Prototype_Insights2024',
    createdAt: '2024-10-22 16:49:46',
  },
  {
    id: 2,
    title: 'DataShowcase_Promo',
    createdAt: '2024-10-26 11:02:06',
  },
])
const isOperateModalOpen = ref(false)

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
function handleDetails(_item) {}

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
function handleDelete(_item) {}

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <div class="flex flex-col border-b border-gray-200 dark:border-gray-800 p-4 gap-x-4 min-w-0">
        <UDashboardNavbarToggle class="pb-4 pl-0" />

        <div class="pt-2 pb-6">
          <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {{ $t('marketing.title') }}
          </p>

          <p class="mt-3 text-lg text-gray-500 dark:text-gray-400">
            {{ $t('marketing.description') }}
          </p>
        </div>

        <div class="grid lg:grid-cols-2 lg:items-start gap-8">
          <div class="flex items-start gap-4">
            <UButton
              :label="$t('marketing.createButton')"
              icon="i-heroicons-plus"
              @click="() => isOperateModalOpen = true"
            />
          </div>
        </div>
      </div>

      <UDashboardPanelContent>
        <div class="grid gap-8">
          <MarketingCard
            v-for="item in shortLinks"
            :key="item.id"
            :item="item"
            :dropdown-items="[
              [
                {
                  label: $t('common.operation.details'),
                  click: (item) => handleDetails(item),
                },
                {
                  label: $t('common.operation.delete'),
                  labelClass: 'text-red-500 dark:text-red-400',
                  click: (item) => handleDelete(item),
                },
              ],
            ]"
          />
        </div>

        <div class="flex justify-end mt-8">
          <UPagination
            v-model="page"
            :page-count="5"
            :total="shortLinks.length"
            show-last
            show-first
          />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>

    <MarketingOperateModal
      v-model="isOperateModalOpen"
      @close="() => isOperateModalOpen = false"
    />
  </UDashboardPage>
</template>
