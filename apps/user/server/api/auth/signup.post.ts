import { emailVerificationTable, userTable } from '@@/server/database/schema'
import { emailVerificationTemplate, hashPassword, isValidEmail, lucia, sendEmail } from '@@/server/utils'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { createDate, TimeSpan } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'

interface Query {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<Query>(event)
  logger.log('🚀 ~ defineEventHandler ~ password:', password)
  logger.log('🚀 ~ defineEventHandler ~ email:', email)

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

  const passwordHash = await hashPassword(password)
  const userId = generateId(15)

  try {
    const db = useDrizzle()

    // Check if user exists
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    })

    if (user) {
      throw createError({
        message: 'Email already used',
        statusCode: 400,
      })
    }

    // Insert user into userTable
    await db.insert(userTable).values({
      id: userId,
      email,
      emailHash: '', // 传入需要的hash，可以根据需求更新
      phone: null, // 未来可以添加处理
      phoneHash: '', // 时间仍未处理
      password: passwordHash,
      isEmailVerified: 0, // 用户注册时默认未验证
      isPhoneVerified: 0, // 默认未验证电话
      status: 1, // 用户注册后默认激活状态
      createdAt: Date.now(), // 根据新的schema，更改为createdAt
      updatedAt: Date.now(), // 根据新的schema，更改为updatedAt
      nickname: null, // 默认昵称
      language: null, // 可以设置为null
      country: null, // 可以设置为null
    })

    // Generate a random 8 digit code
    const code = generateRandomString(8, alphabet('0-9')) // 8 digit code

    await db
      .insert(emailVerificationTable)
      .values({
        id: generateId(15), // 生成唯一ID
        userId,
        code,
        expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
        verifyId: generateId(15),
      })

    // const htmlTemplate = emailVerificationTemplate(code)
    // logger.log('🚀 ~ defineEventHandler ~ htmlTemplate:', htmlTemplate)

    // await sendEmail({
    //   html: htmlTemplate,
    //   to: email,
    //   subject: 'Verify your email address!',
    // })

    const session = await lucia.createSession(userId, {
      status: 1,
      sessionToken: 'testing',
      metadata: {},
    })
    logger.log('🚀 ~ defineEventHandler ~ session:', session)

    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize(),
    )

    return {
      message: 'We\'ve sent a verification email to your inbox. Please verify your email.',
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
