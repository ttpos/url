<script setup lang="ts">
interface Props {
  showUrl?: boolean
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showUrl: true,
  center: true,
})
</script>

<template>
  <section>
    <div
      class="container flex flex-col items-center mx-auto sm:flex-row"
      :class="{
        'justify-center': props.center,
      }"
    >
      <a
        v-if="props.showUrl"
        href="/"
        class="text-xl font-black leading-none text-gray-900 select-none dark:text-gray-100 logo"
        title="Url"
      >
        Url
      </a>
      <a
        class="text-sm text-gray-500"
        :class="{
          'sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-200 sm:mt-0': props.showUrl,
        }"
        href="https://github.com/ttpos/url"
        target="_blank"
        rel="noopener noreferrer"
      >
        Copyright (c) {{ new Date().getFullYear() }} - PRESENT
      </a>
    </div>
  </section>
</template>
