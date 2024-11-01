import { createSharedComposable } from '@vueuse/core'

function _useDashboard() {
  const route = useRoute()
  const isHelpSlideoverOpen = ref(false)

  defineShortcuts({
    'u-h': () => navigateTo('/'),
    'u-l': () => navigateTo('/shortLink'),
    'u-q': () => navigateTo('/qrc'),
    'u-m': () => navigateTo('/marketing'),
    'u-d': () => navigateTo('/domain'),
    'u-s': () => navigateTo('/settings'),
    '?': () => isHelpSlideoverOpen.value = true,
  })

  watch(() => route.fullPath, () => {
    isHelpSlideoverOpen.value = false
  })

  return {
    isHelpSlideoverOpen,
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
