export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value)
    return navigateTo('/auth/signin')

  // const userSession = useUserSession()
  // console.log('🚀 ~ defineNuxtRouteMiddleware ~ userSession:', userSession.user.value)

  // const user = useUser()
  // if (!user.value)
  //   return navigateTo('/auth/signin')
})
