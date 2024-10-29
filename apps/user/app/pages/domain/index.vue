<script setup lang="ts">
definePageMeta({
  middleware: ['protected'],
})

const { t } = useI18n()

const columns = computed(() => [
  {
    key: 'domain',
    label: t('domain.domainName'),
  },
  {
    key: 'shortLinkCount',
    label: t('domain.shortLinkCount'),
  },
  {
    key: 'addedTime',
    label: t('domain.addedTime'),
  },
  {
    key: 'resolutionStatus',
    label: t('domain.resolutionStatus'),
  },
  {
    key: 'actions',
    label: t('common.operation.index'),
  },
])

const people = [{
  id: 1,
  domain: 'Lindsay Walton',
  shortLinkCount: '10',
  addedTime: '2023-08-01',
  min: 1,
  max: 100,
  resolutionStatus: 'Active',
}, {
  id: 2,
  domain: 'Courtney Henry',
  shortLinkCount: '5',
  addedTime: '2023-08-02',
  min: 1,
  max: 100,
  resolutionStatus: 'Inactive',
}, {
  id: 3,
  domain: 'Tom Cook',
  shortLinkCount: '8',
  addedTime: '2023-08-03',
  min: 1,
  max: 100,
  resolutionStatus: 'Active',
}, {
  id: 4,
  domain: 'Whitney Francis',
  shortLinkCount: '12',
  addedTime: '2023-08-04',
  min: 1,
  max: 100,
  resolutionStatus: 'Inactive',
}, {
  id: 5,
  domain: 'Leonard Krasner',
  shortLinkCount: '7',
  addedTime: '2023-08-05',
  min: 1,
  max: 100,
  resolutionStatus: 'Active',
}, {
  id: 6,
  domain: 'Floyd Miles',
  shortLinkCount: '3',
  addedTime: '2023-08-06',
  min: 1,
  max: 100,
  resolutionStatus: 'Inactive',
}]

const page = ref(1)
const pageCount = 5
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <div class="flex flex-col border-b border-gray-200 dark:border-gray-800 p-4 gap-x-4 min-w-0">
        <UDashboardNavbarToggle class="pb-4 pl-0" />

        <div class="pt-2 pb-6">
          <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {{ t('domain.title') }}
          </p>

          <p class="mt-3 text-lg text-gray-500 dark:text-gray-400">
            {{ t('domain.description') }}
          </p>
        </div>

        <div class="grid lg:grid-cols-2 lg:items-start gap-8">
          <div class="flex items-start gap-4">
            <UButton
              :label="t('domain.createButton')"
              icon="i-heroicons-plus"
              :to="{ path: '/domain/create' }"
            />
          </div>
        </div>
      </div>

      <UDashboardPanelContent>
        <UTable :rows="people" :columns="columns">
          <template #shortLinkCount-data="{ row }">
            <div class="flex items-center gap-3">
              {{ row.min }} / {{ row.max }}
            </div>
          </template>

          <template #resolutionStatus-data="{ row }">
            <UBadge
              :label="row.resolutionStatus"
              :color="row.resolutionStatus === 'Active' ? 'green' : 'red'"
              variant="subtle"
              class="capitalize"
            />
          </template>

          <template #actions-data>
            <UButton
              variant="link"
              :padded="false"
              class="mr-4"
            >
              {{ $t('common.nav.settings') }}
            </UButton>
            <UButton
              color="red"
              variant="link"
              :padded="false"
            >
              {{ $t('common.operation.delete') }}
            </UButton>
          </template>
        </UTable>

        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
          <UPagination v-model="page" :page-count="pageCount" :total="people.length" show-last show-first />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
