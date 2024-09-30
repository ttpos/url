import { useAuth } from '@@/server/utils'

export default defineEventHandler(async (event) => {
  const auth = useAuth(event)
  const { user } = await auth.getAuth()

  logger.log('🚀 ~ defineEventHandler ~ user:', user)

  return user
})
