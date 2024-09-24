<script setup lang="ts">
const team = ref({
  label: 'shortener',
  icon: 'i-carbon:url',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/23360933?s=200&v=4',
  },
})
</script>

<template>
  <UButton
    color="gray"
    variant="ghost"
    class="w-full"
    :icon="team.icon"
  >
    <!-- <UAvatar :src="team.avatar.src" size="2xs" /> -->

    <span class="truncate text-gray-900 dark:text-white font-semibold">{{ team.label }}</span>
  </UButton>
</template>
