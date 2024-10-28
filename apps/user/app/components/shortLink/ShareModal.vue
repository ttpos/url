<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  shareUrl: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const { isSupported, copy } = useClipboard()
const toast = useToast()

function copyFn(str: string) {
  copy(str)
  toast.add({ title: isSupported ? t('common.operation.copySuccess') : t('common.operation.copyFailed') })
}
</script>

<template>
  <UDashboardModal
    :model-value="modelValue"
    :title="$t('common.operation.shareTitle')"
    :ui="{ width: 'sm:max-w-md' }"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <UInput :model-value="shareUrl" disabled :ui="{ icon: { trailing: { pointer: '' } } }">
      <template #trailing>
        <UButton
          v-show="shareUrl !== ''"
          color="gray"
          variant="link"
          icon="i-ic:baseline-content-copy"
          :padded="false"
          @click="copyFn(shareUrl)"
        />
      </template>
    </UInput>
    <ULandingLogos align="center" :ui="{ images: 'mt-4 mb-2' }">
      <UIcon name="i-simple-icons-github" class="w-10 h-10 flex-shrink-0" />
      <UIcon name="i-simple-icons-discord" class="w-10 h-10 flex-shrink-0" />
      <UIcon name="i-simple-icons-x" class="w-10 h-10 flex-shrink-0" />
      <UIcon name="i-simple-icons-instagram" class="w-10 h-10 flex-shrink-0" />
      <UIcon name="i-simple-icons-linkedin" class="w-10 h-10 flex-shrink-0" />
      <UIcon name="i-simple-icons-facebook" class="w-10 h-10 flex-shrink-0" />
    </ULandingLogos>
  </UDashboardModal>
</template>
