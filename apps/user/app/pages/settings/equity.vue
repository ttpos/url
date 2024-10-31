<script setup lang="ts">
const { t } = useI18n()

const sections = computed(() => [
  {
    name: 'shortLink',
    label: t('setting.equity.sections.shortLink'),
    value: 5,
    maximum: 10,
  },
  {
    name: 'qrCode',
    label: t('setting.equity.sections.qrCode'),
    value: 5,
    maximum: 10,
  },
  {
    name: 'customDomain',
    label: t('setting.equity.sections.customDomain'),
    value: 0,
    maximum: 0,
  },
])
</script>

<template>
  <UDashboardPanelContent class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800">
    <UDashboardSection
      :title="$t('setting.equity.title')"
      :description="$t('setting.equity.description')"
      orientation="horizontal"
      class="px-4 py-6"
    >
      <UCard :ui="{ body: { base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col' } }">
        <template #header>
          <UBadge
            :label="$t('setting.equity.freePlan')"
            variant="subtle"
            class="capitalize"
          />
        </template>

        <UFormGroup
          v-for="field in sections"
          :key="field.name"
          :name="field.name"
          :label="field.label"
          class="flex items-center justify-between pt-4 first:pt-0 gap-2"
          :ui="{ container: 'flex' }"
        >
          {{ field.value }} / {{ field.maximum }}
        </UFormGroup>
      </UCard>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>
