import { jwtVerifyFn } from '@@/server/utils'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url

  if (url?.startsWith('/api')) {
    const { jwtPubkey } = useRuntimeConfig(event)

    if (!jwtPubkey) {
      event.node.res.statusCode = 500
      return {
        code: 500,
        message: 'JWT public key not found',
      }
    }

    const authorizationHeader = event.node.req.headers.authorization

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      event.node.res.statusCode = 401
      return {
        code: 401,
        message: 'Unauthorized',
      }
    }

    try {
      const token = authorizationHeader.substring(7)
      const verify = await jwtVerifyFn(jwtPubkey, token)

      logger.info('JWT verification succeeded', verify)

      event.context.auth = verify.payload
    }
    catch (error) {
      logger.error('JWT verification failed', error)
      event.node.res.statusCode = 401
      return {
        code: 401,
        message: 'Invalid token',
      }
    }
  }
})
