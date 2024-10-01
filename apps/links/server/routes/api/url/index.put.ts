import { links } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { eq } from 'drizzle-orm'
import { defineEventHandler, readBody } from 'h3'

interface UpdateRecord {
  hash: string
  url?: string
  userId?: string
  expiresAt?: number
  attribute?: Blob
}

interface Query {
  records: UpdateRecord[]
}

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle(event)
    const { records } = await readBody<Query>(event)

    if (!records || records.length === 0) {
      return {
        code: 400,
        message: 'No records provided for update',
        data: null,
      }
    }

    const results = await Promise.all(
      records.map(async (record) => {
        try {
          const existingRecord = await db
            ?.select()
            .from(links)
            .where(eq(links.hash, record.hash))
            .get()

          if (!existingRecord) {
            return {
              hash: record.hash,
              success: false,
              error: 'Record not found',
            }
          }

          const updateData = {
            url: record.url,
            userId: record.userId,
            expiresAt: record.expiresAt,
            attribute: record.attribute,
            isDelete: 0,
          }

          const fieldsToUpdate = Object.fromEntries(
            Object.entries(updateData).filter(([, value]) => value !== undefined),
          )

          if (Object.keys(fieldsToUpdate).length > 0) {
            await db
              ?.update(links)
              .set(fieldsToUpdate)
              .where(eq(links.hash, record.hash))
              .execute()

            return {
              hash: record.hash,
              success: true,
            }
          }

          return {
            hash: record.hash,
            success: false,
            error: 'No fields to update',
          }
        }
        catch (error) {
          return {
            hash: record.hash,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      }),
    )

    const successes = results.filter(result => result.success)
    const failures = results.filter(result => !result.success)

    logger.log('Links updated:', { successes, failures })

    return {
      code: 0,
      message: 'ok',
      data: {
        successes,
        failures,
      },
    }
  }
  catch (error) {
    logger.error('Error updating links:', error)
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
