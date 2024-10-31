<script setup lang="ts">
import { UButton } from '#components'
import type { DropdownItem } from '#ui/types'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  enableNavigation: {
    type: Boolean,
    default: true,
  },
  showDetailsButton: {
    type: Boolean,
    default: true,
  },
  dropdownItems: {
    type: Array as PropType<DropdownItem[][]>,
    default: () => [],
  },
})

const emit = defineEmits(['copy', 'share', 'details'])

const titleComponent = computed(() => props.enableNavigation ? UButton : 'span')
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 text-gray-900 dark:text-white font-medium">
          <component
            :is="titleComponent"
            v-bind="enableNavigation ? { to: `/marketing/details/${item.id}`, padded: false, variant: 'link', color: 'black' } : {}"
            class="text-lg"
            @click="!enableNavigation && emit('details', item)"
          >
            {{ item.title }}
          </component>
        </div>

        <div class="flex items-start gap-4">
          <UTooltip :text="$t('common.nav.shortLink')">
            <UButton
              class="!cursor-default !opacity-100"
              trailing
              disabled
              icon="i-heroicons-link"
              variant="ghost"
              label="4"
              :ui="{ rounded: 'rounded-full' }"
              @click="emit('share', item)"
            />
          </UTooltip>

          <UTooltip :text="$t('marketing.viewDetails')">
            <UButton
              v-bind="enableNavigation ? { to: `/marketing/details/${item.id}` } : { disabled: true, class: '!cursor-default !opacity-100' }"
              trailing
              icon="i-material-symbols:bar-chart-4-bars-rounded"
              variant="ghost"
              label="4"
              :ui="{ rounded: 'rounded-full' }"
            />
          </UTooltip>

          <UDropdown
            v-if="dropdownItems.length > 0"
            :items="dropdownItems"
            mode="hover"
            position="bottom-end"
          >
            <UButton
              icon="i-lucide:ellipsis-vertical"
              variant="ghost"
              :ui="{ rounded: 'rounded-full' }"
            />
          </UDropdown>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-start gap-4">
        <UBadge :label="item.createdAt" variant="subtle" />
      </div>
    </template>
  </UCard>
</template>
