import { defineEventHandler, readBody } from 'h3'
import { sha256 } from '@noble/hashes/sha2'
import { eq } from 'drizzle-orm'
import { links } from '@@/database/schema'
import { generateShortCode } from '@@/server/utils'

interface Query {
  url: string
  expiresAt: number
  shortCode?: string
  userId?: string
}

export default defineEventHandler(async (event) => {
  const { db } = event.context
  const url = new URL(
    event.node.req.headers.host || '',
    `https://${event.node.req.headers.host}`,
  )
  const domain = url.hostname

  try {
    const {
      url,
      expiresAt,
      userId = '',
      // domain,
      shortCode = generateShortCode(),
    } = await readBody<Query>(event)

    const hash = sha256(`${domain}:${shortCode}`)
    const hexString = Buffer.from(hash).toString('hex')

    const existingLink = await db
      ?.select()
      .from(links)
      .where(eq(links.hash, hexString))
      .get()

    if (existingLink) {
      logger.warn('Link already exists:', existingLink)
      return {
        code: 409,
        message: 'Link already exists',
        data: null,
      }
    }

    await db?.insert(links).values({
      url,
      userId,
      expiresAt,
      hash: hexString,
      isDelete: 0,
    })

    logger.log('New link created:', { url, userId, expiresAt, hexString, shortCode })

    return {
      code: 0,
      message: 'ok',
      data: {
        url,
        userId,
        expiresAt,
        hexString,
        shortCode,
      },
    }
  }
  catch (error) {
    logger.error('Error inserting new link:', error)
    event.node.res.statusCode = 500
    let errorMessage = 'Internal Server Error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      code: 500,
      message: errorMessage,
      data: null,
    }
  }
})
