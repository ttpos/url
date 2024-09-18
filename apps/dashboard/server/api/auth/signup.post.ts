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
  const db = useDrizzle()
  const { email, password } = await readBody<Query>(event)

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    throw createError({
      message: 'Invalid Email',
      statusCode: 400,
    })
  }

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    throw createError({
      message: 'Invalid Password Length',
      statusCode: 400,
    })
  }

  const passwordHash = await hashPassword(password)
  const userId = generateId(15)

  try {
    // Check if user exists
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    })

    if (user) {
      throw createError({
        message: 'Username already used',
        statusCode: 400,
      })
    }

    await db.insert(userTable).values({
      id: userId,
      email,
      emailHash: '',
      phone: null,
      phoneHash: '',
      password: passwordHash,
      // isEmailVerified: 0,
      // isPhoneVerified: 0,
      // status: 1,
      // created: Date.now(),
      // updated: Date.now(),
    })

    // generate a random 8 digit code
    const code = generateRandomString(8, alphabet('0-9')) // 8 digit code

    await db
      .insert(emailVerificationTable)
      .values({
        code,
        userId,
        id: generateId(15),
        expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
      })

    const htmlTemplate = emailVerificationTemplate(code)

    await sendEmail({
      html: htmlTemplate,
      to: email,
      subject: 'Verify your email address!',
    })

    const session = await lucia.createSession(userId, {})

    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize(),
    )

    return {
      message:
        'We\'ve sent a verification email to your inbox. Please verify your email.',
    }
  }
  catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: 400,
    })
  }
})
