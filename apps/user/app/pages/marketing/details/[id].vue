<script setup lang="ts">
enum LinkType {
  SHORT_LINK = 'SHORT_LINK',
  QR_CODE = 'QR_CODE',
}

interface LinkStats {
  today: number
  total: number
}

interface LinkItem {
  id: number
  title: string
  type: LinkType
  shortLink: string
  originalLink: string
  visit: LinkStats
  visitorCount: LinkStats
  ip: LinkStats
}

interface MarketingItem {
  id: number
  title: string
  createdAt: string
}

function useShortLinks() {
  const links = ref<LinkItem[]>([
    {
      id: 1,
      title: 'OpenAI 任命政治老手格莱恩为主管',
      type: LinkType.SHORT_LINK,
      shortLink: 'tiny.com/4g4eaaa',
      originalLink: 'https://readhub.cn/topic/8cUL78YJZ5P',
      visit: { today: 0, total: 0 },
      visitorCount: { today: 0, total: 0 },
      ip: { today: 0, total: 0 },
    },
    {
      id: 2,
      title: 'OpenAI',
      type: LinkType.QR_CODE,
      shortLink: 'tiny.com/4g4eaaa',
      originalLink: 'https://readhub.cn/topic/8cUL78YJZ5P',
      visit: { today: 0, total: 0 },
      visitorCount: { today: 0, total: 0 },
      ip: { today: 0, total: 0 },
    },
    {
      id: 3,
      title: 'MSN',
      type: LinkType.SHORT_LINK,
      shortLink: 'tiny.com/4g4eaaa',
      originalLink: 'https://readhub.cn/topic/8cUL78YJZ5P',
      visit: { today: 0, total: 0 },
      visitorCount: { today: 0, total: 0 },
      ip: { today: 0, total: 0 },
    },
    {
      id: 4,
      title: '苹果官方商店iPhone16pro',
      type: LinkType.QR_CODE,
      shortLink: 'tiny.com/4g4eaaa',
      originalLink: 'https://readhub.cn/topic/8cUL78YJZ5P',
      visit: { today: 0, total: 0 },
      visitorCount: { today: 0, total: 0 },
      ip: { today: 0, total: 0 },
    },
  ])

  const removeLink = (id: number) => {
    links.value = links.value.filter(link => link.id !== id)
  }

  return {
    links,
    removeLink,
  }
}

definePageMeta({
  middleware: ['protected'],
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

if (!route.params.id) {
  router.replace('/marketing')
}

const marketingItem = ref<MarketingItem>({
  id: 1,
  title: 'Prototype_Insights2024',
  createdAt: '2024-10-22 16:49:46',
})
const isOperateModalOpen = ref(false)

const { links, removeLink } = useShortLinks()

const columns = computed(() => [
  {
    key: 'title',
    label: '标题',
  },
  {
    key: 'shortLink',
    label: '短链接',
  },
  {
    key: 'visit',
  },
  {
    key: 'visitView',
    label: '访问次数',
  },
  {
    key: 'visitorCount',
    label: '访问人数',
  },
  {
    key: 'ip',
    label: 'IP 数',
  },
  {
    key: 'actions',
    label: t('common.operation.index'),
  },
])

const tabs = computed(() => [
  {
    slot: 'links',
    label: t('marketing.details.links'),
  },
  {
    slot: 'data',
    label: t('marketing.details.statistics'),
  },
])

function handleAddLink(item: MarketingItem) {
  // eslint-disable-next-line no-console
  console.log('添加链接', item)
}

function handleEdit(item: MarketingItem) {
  isOperateModalOpen.value = true
  // eslint-disable-next-line no-console
  console.log('编辑', item)
}
</script>

<template>
  <SubPage>
    <MarketingCard
      :item="marketingItem"
      :enable-navigation="false"
      :dropdown-items="[
        [
          {
            label: $t('marketing.details.addLink'),
            click: handleAddLink,
          },
          {
            label: $t('marketing.details.edit'),
            click: handleEdit,
          },
        ],
      ]"
    />

    <UTabs :items="tabs" class="pt-4">
      <template #links>
        <UTable :rows="links" :columns="columns">
          <template #shortLink-data="{ row }">
            <div class="flex">
              <UButton
                v-if="row.type === 'SHORT_LINK'"
                icon="i-heroicons-link"
                color="gray"
                variant="ghost"
                size="xs"
                :padded="false"
              />
              <UButton
                v-else
                icon="i-heroicons-qr-code"
                color="gray"
                variant="ghost"
                size="xs"
                :padded="false"
              />
              <div class="flex items-start flex-col gap-4 ml-4">
                <UButton
                  :to="row.shortLink"
                  :padded="false"
                  variant="link"
                  target="_blank"
                >
                  {{ row.shortLink }}
                </UButton>
                <UButton
                  :to="row.originalLink"
                  :padded="false"
                  variant="link"
                  target="_blank"
                  color="black"
                >
                  {{ row.originalLink }}
                </UButton>
              </div>
            </div>
          </template>

          <template #visit-data>
            <div class="flex flex-col">
              <span class="py-2">{{ $t('marketing.details.today') }}</span>
              <span class="py-2">{{ $t('marketing.details.total') }}</span>
            </div>
          </template>

          <template #visitView-data="{ row }">
            <div class="flex flex-col">
              <span class="py-2">{{ row.visit.today }}</span>
              <span class="py-2">{{ row.visit.total }}</span>
            </div>
          </template>

          <template #visitorCount-data="{ row }">
            <div class="flex flex-col">
              <span class="py-2">{{ row.visitorCount.today }}</span>
              <span class="py-2">{{ row.visitorCount.total }}</span>
            </div>
          </template>

          <template #ip-data="{ row }">
            <div class="flex flex-col">
              <span class="py-2">{{ row.ip.today }}</span>
              <span class="py-2">{{ row.ip.total }}</span>
            </div>
          </template>

          <template #actions-data="{ row }">
            <UButton
              color="red"
              variant="link"
              :padded="false"
              @click="removeLink(row.id)"
            >
              {{ $t('common.operation.delete') }}
            </UButton>
          </template>
        </UTable>
      </template>

      <template #data>
        <div class="p-4">
          统计数据展示区域
        </div>
      </template>
    </UTabs>

    <MarketingOperateModal
      v-model="isOperateModalOpen"
      type="edit"
      :title="marketingItem.title"
      @close="() => isOperateModalOpen = false"
    />
  </SubPage>
</template>
