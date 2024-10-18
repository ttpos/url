import { useAuth } from '@@/server/utils'

export default defineEventHandler(async (event) => {
  /**
   * Get user information in the following order
   * 1. session
   * 2. check user cookie
   */
  try {
    const auth = useAuth(event)
    const user = await auth.getCurrentUser()
    if (user) {
      return user
    }

    const userCookie = await auth.checkUserCookie()
    return userCookie || null
  }
  catch (error) {
    logger.error('Error in auth handler:', error)

    return null
  }
})
