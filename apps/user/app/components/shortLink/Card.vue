<script setup lang="ts">
import { UButton } from '#components'
// import type { FormSubmitEvent } from '#ui/types'
import { useClipboard } from '@vueuse/core'

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

const emit = defineEmits(['check', 'copy', 'share', 'edit', 'delete', 'details'])

const { t } = useI18n()
const { isSupported, copy } = useClipboard()
const toast = useToast()

const dropdownItems = computed(() => {
  const items = []
  if (props.showDetailsButton) {
    items.push({
      label: t('common.operation.edit'),
      onClick: () => emit('details', props.item),
    })
  }
  items.push({
    label: t('common.operation.delete'),
    labelClass: 'text-red-500 dark:text-red-400',
    onClick: () => emit('delete', props.item),
  })
  return [items]
})

function copyFn(str: string) {
  copy(str)
  toast.add({ title: isSupported ? t('common.operation.copySuccess') : t('common.operation.copyFailed') })
  emit('copy', props.item)
}

const titleComponent = computed(() => props.enableNavigation ? UButton : 'span')
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-start justify-between gap-4 text-gray-900 dark:text-white font-medium">
          <UCheckbox v-if="showCheckbox" :model-value="false" @change="emit('check', $event, item)" />
          <UIcon name="i-heroicons-light-bulb" class="w-5 h-5" />
          <component
            :is="titleComponent"
            v-bind="enableNavigation ? { to: `/shortLink/${item.shortUrl.split('/').pop()}/details`, padded: false, variant: 'link', color: 'black' } : {}"
            class="text-lg"
            @click="!enableNavigation && emit('details', item)"
          >
            {{ item.title }}
          </component>
        </div>

        <div class="flex items-start gap-4">
          <UTooltip :text="$t('common.operation.copy')">
            <UButton
              icon="i-ic:baseline-content-copy"
              variant="ghost"
              :ui="{ rounded: 'rounded-full' }"
              @click="copyFn(item.shortUrl)"
            />
          </UTooltip>

          <UTooltip :text="$t('common.operation.share')">
            <UButton
              icon="i-heroicons:arrow-top-right-on-square-solid"
              variant="ghost"
              :ui="{ rounded: 'rounded-full' }"
              @click="emit('share', item)"
            />
          </UTooltip>

          <UTooltip :text="$t('common.operation.edit')">
            <UButton
              :to="`/shortLink/${item.shortUrl.split('/').pop()}/edit`"
              icon="i-heroicons:pencil-square"
              variant="ghost"
              :ui="{ rounded: 'rounded-full' }"
            />
          </UTooltip>

          <UDropdown
            :items="dropdownItems"
            mode="hover"
            position="bottom-end"
          >
            <UButton
              icon="i-heroicons-ellipsis-vertical"
              variant="ghost"
              :ui="{ rounded: 'rounded-full' }"
            />
          </UDropdown>
        </div>
      </div>
    </template>

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

    <template #footer>
      <div class="flex items-start gap-4">
        <UBadge :label="item.createdAt" variant="subtle" />
        <UBadge :label="item.group" variant="subtle" />
      </div>
    </template>
  </UCard>
</template>
