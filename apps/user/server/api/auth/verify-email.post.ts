import { userTable, verificationTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { eq } from 'drizzle-orm'
import { isWithinExpirationDate } from 'oslo'

interface Query {
  code: string
  userId: string
}

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle(event)
    const { debug } = useRuntimeConfig()
    const { code, userId } = await readBody<Query>(event)

    if (typeof userId !== 'string') {
      throw createError({
        statusMessage: 'userId required!',
        statusCode: 400,
      })
    }

    if (typeof code !== 'string' || code.length !== 8) {
      throw createError({
        statusMessage: 'Invalid Code!',
        statusCode: 400,
      })
    }

    // * dev mode only
    if (!debug) {
      const emailVerificationRequest = await db.query.verificationTable.findFirst({
        where: table => eq(table.userId, userId) && eq(table.verifyData, code),
      })

      if (!emailVerificationRequest) {
        throw createError({
          statusMessage: 'Invalid verification code!',
          statusCode: 498,
        })
      }

      // Check if the verification code is still valid (not expired)
      if (!isWithinExpirationDate(new Date(emailVerificationRequest.expiresAt))) {
        throw createError({
          statusMessage: 'Verification code expired!',
          statusCode: 498,
        })
      }
    }

    await db
      .update(verificationTable)
      .set({
        status: 1,
        isDeleted: 1,
        updatedAt: Date.now(),
      })
      .where(eq(verificationTable.userId, userId))

    await db
      .update(userTable)
      .set({
        isEmailVerified: 1,
        updatedAt: Date.now(),
      })
      .where(eq(userTable.id, userId))

    return {
      message: 'Email Verified Successfully!',
    }
  }
  catch (error: any) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    throw createError({
      statusMessage: error.message,
      statusCode: 400,
    })
  }
})
