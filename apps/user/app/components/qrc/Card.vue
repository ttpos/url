<script setup lang="ts">
import { UButton } from '#components'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  enableNavigation: {
    type: Boolean,
    default: true,
  },
  showDetailsButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['share', 'edit', 'details'])

const qrcodeRef = ref<HTMLElement | null>(null)
const titleComponent = computed(() => props.enableNavigation ? UButton : 'span')

function downloadQrCode() {
  if (!qrcodeRef.value)
    return

  const canvas = qrcodeRef.value.querySelector('canvas')
  if (!canvas)
    return

  const image = canvas.toDataURL('image/png')

  const link = document.createElement('a')
  link.download = `${props.item.title || 'qrcode'}.png`
  link.href = image
  link.click()
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex">
        <div ref="qrcodeRef">
          <QrcodeVue
            class="wh-100 rounded-md mr-6"
            :size="120"
            :margin="2"
            :value="item.shortUrl"
          />
        </div>
        <div class="flex-1 flex flex-col justify-around">
          <div class="flex items-center justify-between">
            <div class="flex items-start justify-between gap-4 text-gray-900 dark:text-white font-medium">
              <component
                :is="titleComponent"
                v-bind="enableNavigation ? { to: `/qrc/${item.shortUrl.split('/').pop()}/details`, padded: false, variant: 'link', color: 'black' } : {}"
                class="text-lg"
                @click="!enableNavigation && emit('details', item)"
              >
                {{ item.title }}
              </component>
            </div>

            <div class="flex items-start gap-4">
              <UTooltip text="编辑">
                <UButton
                  :to="`/qrc/${item.shortUrl.split('/').pop()}/edit`"
                  icon="i-heroicons:pencil-square"
                  variant="ghost"
                  :ui="{ rounded: 'rounded-full' }"
                />
              </UTooltip>

              <UTooltip text="下载 QR Code">
                <UButton
                  icon="i-material-symbols:download"
                  variant="ghost"
                  :ui="{ rounded: 'rounded-full' }"
                  @click="downloadQrCode"
                />
              </UTooltip>

              <UTooltip v-if="showDetailsButton" text="查看数据">
                <UButton
                  icon="i-material-symbols:bar-chart-4-bars-rounded"
                  variant="ghost"
                  :ui="{ rounded: 'rounded-full' }"
                  @click="emit('share', item)"
                />
              </UTooltip>
            </div>
          </div>
          <div class="flex items-start flex-col gap-4">
            <UButton
              :to="item.shortUrl"
              :padded="false"
              variant="link"
              target="_blank"
            >
              {{ item.shortUrl }}
            </UButton>
            <UButton
              :to="item.originalUrl"
              :padded="false"
              variant="link"
              target="_blank"
              color="black"
            >
              {{ item.originalUrl }}
            </UButton>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-start gap-4">
        <UBadge :label="item.createdAt" variant="subtle" />
        <UBadge :label="item.group" variant="subtle" />
      </div>
    </template>
  </UCard>
</template>
