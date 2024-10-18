export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  const data = await useRequestFetch()('/api/auth/sessions')

  if (data) {
    user.value = data
  }
})
