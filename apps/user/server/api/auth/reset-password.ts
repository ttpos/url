import { userTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { eq, sql } from 'drizzle-orm'
import { isWithinExpirationDate } from 'oslo'

interface Query {
  email: string
  code: string
  password: string
}

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle(event)
    const { debug } = useRuntimeConfig()
    const { code, password, email } = await readBody<Query>(event)

    if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
      throw createError({
        message: 'Invalid Password Length',
        statusCode: 400,
      })
    }

    if (typeof code !== 'string' || code.length !== 8) {
      throw createError({
        statusMessage: 'Invalid Code!',
        statusCode: 400,
      })
    }

    const user = await db.query.userTable.findFirst({
      where: table => eq(table.email, email),
    })

    if (!user) {
      throw createError({
        statusMessage: 'Invalid User!',
        statusCode: 400,
      })
    }

    // * dev mode only
    if (!debug) {
      const resetPasswordRequest = await db.query.verificationTable.findFirst({
        where: table =>
          sql`${table.userId} = ${user?.id}` && eq(table.verifyData, code),
      })

      if (!resetPasswordRequest) {
        throw createError({
          statusMessage: 'Invalid reset password code!',
          statusCode: 498,
        })
      }

      if (!isWithinExpirationDate(new Date(resetPasswordRequest.expiresAt))) {
        throw createError({
          statusMessage: 'Password reset code expired!',
          statusCode: 498,
        })
      }
    }

    // await db
    //   .delete(verificationTable)
    //   .where(sql`${verificationTable.userId} = ${user?.id}`)

    const hashedPassword = await hashPassword(password)

    await db
      .update(userTable)
      .set({
        password: hashedPassword,
      })
      .where(sql`${userTable.id} = ${user?.id}`)

    return {
      message: 'Password reset was successfully!',
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
