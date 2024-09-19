import { mfaTable, userTable } from '@@/server/database/schema'
import { isValidEmail, lucia, useDrizzle, verifyPassword } from '@@/server/utils'
import { eq } from 'drizzle-orm'

interface Query {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody<Query>(event)

    // Validate email
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      throw createError({
        message: 'Invalid Email',
        statusCode: 400,
      })
    }

    // Validate password length
    if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
      throw createError({
        message: 'Invalid Password Length',
        statusCode: 400,
      })
    }

    const db = useDrizzle()

    // Check if user exists
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    })
    logger.log('🚀 ~ defineEventHandler ~ user:', user)

    if (!user) {
      throw createError({
        message: `${email} doesn't exist!`,
        statusCode: 400,
      })
    }

    // Check if the user has a password
    if (!user.password) {
      const checkUserSignedWithOauth = await db.query.usersOauthTable.findFirst({
        where: table => eq(table.userId, user.id),
      })
      if (checkUserSignedWithOauth) {
        throw createError({
          message: `${email} was first used in sign in with '${checkUserSignedWithOauth.provider}', sign in again and set your password.`,
          statusCode: 400,
        })
      }
      else {
        throw createError({
          message: `${email} was first used in sign in with Magic Link, sign in again and set your password.`,
          statusCode: 400,
        })
      }
    }

    // Validate password
    const validPassword = await verifyPassword(user.password, password)

    if (!validPassword) {
      throw createError({
        message: 'Password incorrect!',
        statusCode: 400,
      })
    }

    // // INSERT MFA DATA
    // const mfaRecord = {
    //   id: 'mfa-1', // 在实际代码中，你应该生成唯一的 ID
    //   userId: user.id,
    //   type: 'SMS', // 假设你在这里使用 SMS 作为 MFA 类型
    //   name: 'SMS Authentication', // 记录的名称
    //   status: 'active', // 记录当前状态
    //   mfaId: null, // 初始记录，不关联其他记录
    //   lastVerifiedAt: Date.now(),
    //   createdAt: Date.now(),
    //   updatedAt: Date.now(),
    //   isDeleted: null, // 软删除标记
    // }

    // // 插入 MFA 记录
    // await db.insert(mfaTable).values(mfaRecord).returning('*')

    // Create a session
    const session = await lucia.createSession(user.id, {
      status: 1,
      sessionToken: 'testing',
      metadata: {},
    })
    logger.log('🚀 ~ defineEventHandler ~ session:', session)

    // Set the session cookie
    const token = lucia.createSessionCookie(session.id)
    setCookie(event, token.name, token.value, token.attributes)

    return {
      message: 'Signin successful!',
    }
  }
  catch (error: any) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    throw createError({
      message: error.message,
      statusCode: 400,
    })
  }
})
