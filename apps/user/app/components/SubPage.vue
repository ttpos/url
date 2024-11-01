<script setup lang="ts">
interface Props {
  title?: string
}

// Props and emits
withDefaults(defineProps<Props>(), {
  title: '',
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <div class="flex flex-col border-b border-gray-200 dark:border-gray-800 p-4 gap-x-4 min-w-0">
        <UDashboardNavbarToggle class="pb-4 pl-0" />
        <UButton
          :padded="false"
          color="gray"
          variant="link"
          icon="i-gravity-ui:arrow-shape-turn-up-left"
          :label="$t('common.operation.back')"
          @click="$router.back()"
        />
      </div>

      <UDashboardPanelContent>
        <h1
          v-if="title"
          class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight pt-3 pb-5"
        >
          {{ title }}
        </h1>

        <slot />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
