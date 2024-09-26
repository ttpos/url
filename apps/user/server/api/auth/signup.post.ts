import { userTable } from '@@/server/database/schema'
import { hashPassword, isValidEmail, useDrizzle } from '@@/server/utils'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'

interface Query {
  email?: string
  phone?: string
  password: string
  captchaToken: string
}

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle(event)
    const { lucia } = event.context

    const body = await readBody<Query>(event)
    const { email, phone, password, captchaToken } = body

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

    const turnstileResponse = await verifyTurnstileToken(captchaToken || body['cf-turnstile-response'])
    if (!turnstileResponse.success) {
      throw createError({
        message: `The provided Turnstile token was not valid! \n${JSON.stringify(turnstileResponse)}`,
        statusCode: 400,
      })
    }
    logger.log('🚀 ~ defineEventHandler ~ turnstileResponse:', turnstileResponse)

    const passwordHash = await hashPassword(password)
    const userId = generateId(15)

    if (email) {
      // Check if user exists
      const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
      })

      // TODO
      // const existingUser = await db.query.userTable.findFirst({
      //   where: table =>
      //     sql`${table.email} = ${email}` && eq(table.oauthRegisterId, 1),
      // })

      // if (existingUser) {
      //   if (existingUser.isEmailVerified) {
      //     throw createError({
      //       message: 'Email already used',
      //       statusCode: 400,
      //     })
      //   }

      //   if (verifyCode) {
      //     verifyCode({ email, code })
      //     goto signup
      //   }

      //   sendVerify({ email })
      //   return {
      //     message: 'We\'ve sent a verification email to your inbox. Please verify your email./ verify code',
      //   }
      //   throw createError({
      //     message: 'Email already used',
      //     statusCode: 400,
      //   })
      // }

      if (existingUser) {
        if (existingUser.oauthRegisterId) {
          throw createError({
            message: 'Email already used',
            statusCode: 400,
          })
        }
      }
    }

    if (phone) {
      // TODO: pseudo-code
      // Optionally check for existing phone number
      if (phone) {
        const existingPhoneUser = await db.query.userTable.findFirst({
          where: eq(userTable.phone, phone),
        })
        if (existingPhoneUser) {
          throw createError({
            message: 'Phone number already used',
            statusCode: 400,
          })
        }
      }
    }

    // Insert user into userTable
    await db.insert(userTable).values({
      id: userId,
      email: email || null,
      phone: phone || null,
      password: passwordHash,
      status: 1, // 用户激活状态
    })

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
