import { userTable, verificationTable } from '@@/server/database/schema'
import { isValidEmail, lucia, useDrizzle, verifyPassword } from '@@/server/utils'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { createDate, TimeSpan } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'

interface Query {
  email: string
}

export default defineEventHandler(async (event) => {
  const { email } = await readBody<Query>(event)

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    throw createError({
      message: 'Invalid Email',
      statusCode: 400,
    })
  }

  try {
    const db = useDrizzle()

    // Check if user exists
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    })

    if (!user) {
      throw createError({
        message: `${email} does't exists!`,
        statusCode: 400,
      })
    }

    // generate a random 8 digit code
    const code = generateRandomString(8, alphabet('0-9')) // 8 digit code

    // await db
    //   .insert(verificationTable)
    //   .values({
    //     code,
    //     userId: user?.id,
    //     id: generateId(15),
    //     expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
    //   })

    await db.insert(verificationTable).values({
      id: generateId(15), // 生成唯一ID
      userId: user?.id,
      status: 0, // 默认状态为0（未验证）
      verifyId: generateId(15),
      expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
      createIp: null, // 根据需求填写 IP 地址
      verifyIp: null, // 根据需求填写验证时的 IP 地址
      verifyData: code, // 存储验证码数据
      serial: generateRandomUppercaseString(4), // 随机 4 位序列号
      // type: email ? 'email' : phone ? 'phone' : null, // 类型（'email' 或 'phone'）
      type: 'email', // 类型（'email' 或 'phone'）
      action: '/auth/reset-password', // 代表某个动作，传入 URL
      createdAt: Date.now(), // 创建时间
      updatedAt: Date.now(), // 更新时间
      isDeleted: 0, // 默认未删除（0表示未删除）
    })

    // TODO: pseudo-code
    // const htmlTemplate = resetPasswordCodeRequest(code)
    // await sendEmail({
    //   html: htmlTemplate,
    //   to: email,
    //   subject: 'Reset your password!',
    // })

    return {
      message:
        'We\'ve sent a reset password code to your inbox. Please use the code to reset your password.',
    }
  }
  catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: 400,
    })
  }
})
