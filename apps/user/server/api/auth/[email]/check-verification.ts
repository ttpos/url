import { userTable } from '@@/server/database/schema'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const email = getRouterParam(event, 'email')
    const db = useDrizzle(event)

    // Check if user exists
    const userEmail = await db.query.userTable.findFirst({
      where: sql`${userTable.email} = ${email}`,
      columns: {
        isEmailVerified: true,
      },
    })
    logger.log('🚀 ~ userEmail ~ userEmail:', userEmail)

    return {
      isEmailVerified: userEmail?.isEmailVerified,
    }
  }
  catch (error: any) {
    throw createError({
      statusMessage: error.message,
      statusCode: 400,
    })
  }
})
