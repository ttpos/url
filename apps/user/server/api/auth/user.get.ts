import { useAuth } from '@@/server/utils'

export default defineEventHandler(async (event) => {
  const auth = useAuth(event)

  await auth.requireUserSession()
  
  const user = await auth.getCurrentUser();

  logger.log('🚀 ~ defineEventHandler ~ user:', user)

  return user

  // return {
  //   id: user.id,
  //   name: user.name,
  //   // get some additional data not stored in the session as an example
  //   email: user.email,
  // };

  // const { user } = await auth.getAuth()

  // logger.log('🚀 ~ defineEventHandler ~ user:', user)

  // return user
})
