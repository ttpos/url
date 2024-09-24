import { createSharedComposable } from '@vueuse/core'

function _useDashboard() {
  const route = useRoute()
  const router = useRouter()
  const isHelpSlideoverOpen = ref(false)

  defineShortcuts({
    'g-h': () => router.push('/'),
    'g-s': () => router.push('/settings'),
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
