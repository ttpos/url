import { links } from '@@/database/schema'
import { sha256 } from '@noble/hashes/sha2'
import { bytesToHex } from '@noble/hashes/utils'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { db } = event.context
  const url = new URL(
    event.node.req.headers.host || '',
    `http://${event.node.req.headers.host}`,
  )
  const domain = url.hostname

  try {
    const shortCode = event.context.params?.shortCode || ''
    logger.warn('🚀 ~ defineEventHandler ~ shortCode:', shortCode)

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

    if (!urlData || urlData.isDelete === 1 || (urlData.expiresAt && Date.now() > urlData.expiresAt)) {
      logger.warn('Short code issue:', shortCode)

      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'Short code not found or expired or deleted',
      }
    }

    return sendRedirect(event, urlData.url, 302)
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
