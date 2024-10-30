<script setup lang="ts">
import { sub } from 'date-fns'

definePageMeta({
  middleware: ['protected'],
})

const range = ref<any>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<any>('daily')

const shortLinksItem = ref(
  {
    id: 1,
    title: 'OpenAI 任命政治老将莱恩为全球政策主管',
    shortUrl: 'tiny.com/4g4eaaa',
    originalUrl: 'https://readhub.cn/topic/8cUL78YJZ5P',
    createdAt: '2024-10-22 16:49:46',
    group: 'Default Group',
  },
)

const isShareModalOpen = ref(false)

function handleCardAction(action: string, item: any) {
  switch (action) {
    case 'check':
      break
    case 'copy':
      break
    case 'share':
      isShareModalOpen.value = true
      break
    case 'edit':
      break
    case 'delete':
      break

    default:
    // eslint-disable-next-line no-console
      console.log('unknown action', action, item)
      break
  }
}
</script>

<template>
  <SubPage>
    <ShortLinkCard
      :item="shortLinksItem"
      :show-checkbox="false"
      :enable-navigation="false"
      :show-details-button="false"
      @check="handleCardAction('check', $event)"
      @copy="handleCardAction('copy', $event)"
      @share="handleCardAction('share', $event)"
      @edit="handleCardAction('edit', $event)"
      @delete="handleCardAction('delete', $event)"
    />

    <!-- ~/components/home/HomeChart.vue -->
    <HomeChart
      class="mt-8"
      :period="period"
      :range="range"
    />

    <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
      <!-- ~/components/home/HomeSales.vue -->
      <HomeSales />
      <!-- ~/components/home/HomeCountries.vue -->
      <HomeCountries />
    </div>

    <ShortLinkShareModal
      v-model="isShareModalOpen"
      :share-url="shortLinksItem.shortUrl"
    />
  </SubPage>
</template>
