<script setup lang="ts">
definePageMeta({
  middleware: ['protected'],
})

const { t } = useI18n()

// Variables
const peopleSelected = ref('')
const typeSelected = ref()
const shortLinks = ref([
  {
    id: 1,
    title: 'OpenAI 任命政治老将莱恩为全球政策主管',
    shortUrl: 'tiny.com/4g4eaaa',
    originalUrl: 'https://readhub.cn/topic/8cUL78YJZ5P',
    createdAt: '2024-10-22 16:49:46',
    group: 'Default Group',
  },
  {
    id: 2,
    title: 'OpenAI 任命政治老将莱恩为全球政策主管2',
    shortUrl: 'tiny.com/4g4ebbbb',
    originalUrl: 'https://readhub.cn/1111topic/8cUL78YJZ5P',
    createdAt: '2024-10-26 11:02:06',
    group: 'Group 1',
  },
])

const isAddGroupModalOpen = ref(false)
const page = ref(1)

const isShareModalOpen = ref(false)
const shareUrl = ref('')

// Computed
const peopleOptions = computed(() =>
  [
    {
      value: 'add',
      label: t('shortLink.addGroup'),
      icon: 'i-ep:circle-plus',
    },
  ],
)

const typeOptions = computed(() =>
  [
    {
      value: '',
      label: t('shortLink.all'),
    },
    {
      value: '2',
      label: t('shortLink.randomSuffix'),
    },
    {
      value: '3',
      label: t('shortLink.customSuffix'),
    },
    {
      value: '4',
      label: t('shortLink.batchShortLink'),
    },
  ],
)

// Functions
function handleGroupsChange(val: string) {
  // eslint-disable-next-line no-console
  console.log('groups changed', val)

  if (val === 'add') {
    isAddGroupModalOpen.value = true
  }
}

function handleCardAction(action: string, item: any) {
  switch (action) {
    case 'check':
      break
    case 'copy':
      break
    case 'share':
      isShareModalOpen.value = true
      shareUrl.value = item.shortUrl
      break
    case 'edit':
      break
    case 'delete':
      break

    default:
    // eslint-disable-next-line no-console
      console.log('unknown action', action)
      break
  }
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <div class="flex flex-col border-b border-gray-200 dark:border-gray-800 p-4 gap-x-4 min-w-0">
        <UDashboardNavbarToggle class="pb-4 pl-0" />

        <div class="pt-2 pb-6">
          <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {{ $t('qrc.title') }}
          </p>

          <p class="mt-3 text-lg text-gray-500 dark:text-gray-400">
            {{ $t('qrc.description') }}
          </p>
        </div>

        <div class="grid lg:grid-cols-2 lg:items-start gap-8">
          <div class="flex items-start gap-4">
            <UButton
              :label="$t('qrc.createButton')"
              icon="i-heroicons-plus"
              :to="{ path: '/qrc/create' }"
            />
          </div>
          <div class="flex lg:justify-end gap-4">
            <div class="flex items-center gap-2">
              <span class="text-gray-500 dark:text-gray-400 text-sm hidden lg:inline">
                {{ $t('qrc.group') }}
              </span>
              <USelectMenu
                v-model="peopleSelected"
                class="w-[9rem]"
                :clear-search-on-close="true"
                searchable
                :options="peopleOptions"
                :placeholder="$t('qrc.selectGroups')"
                value-attribute="value"
                option-attribute="label"
                @change="handleGroupsChange"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 dark:text-gray-400 text-sm hidden lg:inline">
                {{ $t('qrc.type') }}
              </span>
              <USelectMenu
                v-model="typeSelected"
                class="w-[9rem]"
                :options="typeOptions"
                :placeholder="$t('qrc.selectType')"
                value-attribute="value"
                option-attribute="label"
              />
            </div>
          </div>
        </div>
      </div>

      <UDashboardPanelContent>
        <div class="grid gap-8">
          <QrcCard
            v-for="item in shortLinks"
            :key="item.id"
            :item="item"
            :show-checkbox="true"
            @check="handleCardAction('check', $event)"
            @copy="handleCardAction('copy', $event)"
            @share="handleCardAction('share', $event)"
            @edit="handleCardAction('edit', $event)"
            @delete="handleCardAction('delete', $event)"
          />
        </div>

        <div class="flex justify-end mt-8">
          <UPagination v-model="page" :page-count="5" :total="shortLinks.length" show-last show-first />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
