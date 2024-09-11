<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="relative">
    <div class="container mx-auto py-10 px-4">
      <h2>{{ error?.message }}</h2>
      <br>
      <button @click="handleError">
        Clear error
      </button>
      <br>
      <br>
      <NuxtLink class="text-primary" to="/">
        Navigate home
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.relative {
  position: relative;
}

.container {
  width: 100%;
}

.py-10 {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.text-primary {
  color: rgb(74 222 128);
}
</style>
