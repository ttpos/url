<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  subTitle: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
})

const { t } = useI18n()

const displayTitle = computed(() => props.title || t('common.cta.title'))
const displaySubTitle = computed(() => props.subTitle || t('common.cta.subTitle'))
const displayDescription = computed(() => props.description || t('common.cta.description'))
</script>

<template>
  <ULandingSection
    :links="[{
      label: $t('common.cta.get_started'),
      trailingIcon: 'i-heroicons-arrow-right-20-solid',
      size: 'xl',
      to: '/signup',
    }]"
  >
    <template #title>
      {{ displayTitle }}
      <span v-if="!subTitle" class="text-primary">{{ displaySubTitle }}</span>
    </template>

    <template v-if="description" #description>
      {{ displayDescription }}
    </template>
  </ULandingSection>
</template>
