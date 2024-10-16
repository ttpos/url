import { useAuth } from '@@/server/utils'

export default defineEventHandler(async (event) => {
  const auth = useAuth(event)

  await auth.requireUserSession()

  const user = await auth.getCurrentUser();

  logger.log('🚀 ~ defineEventHandler ~ user:', user)

  return user
})
