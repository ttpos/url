import { eq } from 'drizzle-orm'
import { sha256 } from '@noble/hashes/sha2'
import { bytesToHex } from '@noble/hashes/utils'
import { links } from '@@/database/schema'

export default defineEventHandler(async (event) => {
  const { db } = event.context
  const url = new URL(
    event.node.req.headers.host || '',
    `http://${event.node.req.headers.host}`,
  )
  const domain = url.hostname

  try {
    const shortCode = event.context.params?.shortCode
    logger.warn('🚀 ~ defineEventHandler ~ shortCode:', shortCode)

    if (!shortCode) {
      logger.warn('Short code not provided')
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Short code not provided',
      }
    }

    const userAgent = event.node.req.headers['user-agent'] || ''
    if (userAgent.includes('facebookexternalhit') || userAgent.includes('twitterbot')) {
      return sendRedirect(event, `/u/${shortCode}/og`, 302)
    }

    const hash = bytesToHex(sha256(`${domain}:${shortCode}`))

    const urlData = await db
      ?.select()
      .from(links)
      .where(eq(links.hash, hash))
      .limit(1)
      .get()

    if (!urlData) {
      logger.warn('Short code not found:', shortCode)
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'Short code not found',
      }
    }

    const { url, expiresAt, isDelete } = urlData

    if (isDelete === 1) {
      logger.warn('Short code deleted:', shortCode)

      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'Short code deleted',
      }
    }

    if (expiresAt && Date.now() > expiresAt) {
      logger.warn('Short code expired:', shortCode)

      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'Short code expired',
      }
    }

    return sendRedirect(event, url, 302)
  }
  catch (error) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    event.node.res.statusCode = 500
    let errorMessage = 'Internal Server Error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      code: 500,
      message: errorMessage,
      data: [],
    }
  }
})
