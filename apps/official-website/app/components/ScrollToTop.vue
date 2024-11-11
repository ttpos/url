<script setup lang="ts">
const isScrolling = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolling.value = window.scrollY > 0
  })
})

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="fixed bottom-36 right-3 z-50 sm:bottom-20">
    <UButton
      icon="heroicons-arrow-up"
      size="sm"
      color="primary"
      square
      variant="solid"
      :class="{ 'opacity-100': isScrolling, 'opacity-0': !isScrolling }"
      @click="scrollToTop"
    />
  </div>
</template>

<style scoped></style>
