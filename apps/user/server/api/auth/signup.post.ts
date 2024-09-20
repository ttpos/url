import { userTable, verificationTable } from '@@/server/database/schema'
import { emailVerificationTemplate, generateRandomUppercaseString, hashPassword, isValidEmail, lucia, sendEmail } from '@@/server/utils'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { createDate, TimeSpan } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'

interface Query {
  email?: string
  phone?: string
  password: string
}

export default defineEventHandler(async (event) => {
  const { email, phone, password } = await readBody<Query>(event)
  logger.log('🚀 ~ defineEventHandler ~ email:', email)
  logger.log('🚀 ~ defineEventHandler ~ phone:', phone)
  logger.log('🚀 ~ defineEventHandler ~ password:', password)

  // Validate email
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    throw createError({
      message: 'Invalid Email',
      statusCode: 400,
    })
  }

  // Validate phone if provided
  if (phone && (typeof phone !== 'string' || phone.trim() === '')) {
    throw createError({
      message: 'Invalid Phone',
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
    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    })

    if (existingUser) {
      throw createError({
        message: 'Email already used',
        statusCode: 400,
      })
    }

    // TODO: pseudo-code
    // Optionally check for existing phone number
    // if (phone) {
    //   const existingPhoneUser = await db.query.userTable.findFirst({
    //     where: eq(userTable.phone, phone),
    //   })
    //   if (existingPhoneUser) {
    //     throw createError({
    //       message: 'Phone number already used',
    //       statusCode: 400,
    //     })
    //   }
    // }

    // Insert user into userTable
    await db.insert(userTable).values({
      id: userId,
      email: email || null,
      emailHash: '',
      phone: phone || null,
      phoneHash: '',
      password: passwordHash,
      isEmailVerified: 0, // 未验证状态
      isPhoneVerified: 0, // 未验证状态
      status: 1, // 用户激活状态
      createdAt: Date.now(),
      updatedAt: Date.now(),
      nickname: null, // 默认昵称
      language: null, // 可选字段
      country: null, // 可选字段
    })

    // Generate a random 8 digit code
    const code = generateRandomString(8, alphabet('0-9')) // 8 digit code

    // await db.insert(verificationTable).values({
    //   id: generateId(15), // 生成唯一ID
    //   userId,
    //   code,
    //   expiresAt: createDate(new TimeSpan(10, 'm')), // 10分钟有效期
    //   verifyId: generateId(15),
    // })
    await db.insert(verificationTable).values({
      id: generateId(15), // 生成唯一ID
      userId,
      status: 0, // 默认状态为0（未验证）
      verifyId: generateId(15),
      expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
      createIp: null, // 根据需求填写 IP 地址
      verifyIp: null, // 根据需求填写验证时的 IP 地址
      verifyData: code, // 存储验证码数据
      serial: generateRandomUppercaseString(4), // 随机 4 位序列号
      type: email ? 'email' : phone ? 'phone' : null, // 类型（'email' 或 'phone'）
      action: '/auth/signup', // 代表某个动作，传入 URL
      createdAt: Date.now(), // 创建时间
      updatedAt: Date.now(), // 更新时间
      isDeleted: 0, // 默认未删除（0表示未删除）
    })

    // TODO: pseudo-code
    // const verifyId = await sendVerify({ email })
    // await db
    //   .insert(VerificationTable)
    //   .values({
    //     userId,
    //     verifyData: email,
    //     expiresAt: createDate(new TimeSpan(10, 'm')),
    //     verifyId,
    //   })

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
