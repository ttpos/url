import { userTable } from '@@/server/database/schema'
import { hashPassword, isValidEmail, useDrizzle, verifyPassword } from '@@/server/utils'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import type { EventHandlerRequest, H3Event } from 'h3'

interface ValidationResult {
  user: {
    [x: string]: any
  }
  isValid: boolean
  message?: string
}

class UserManager {
  private db: ReturnType<typeof useDrizzle>

  constructor(event: H3Event<EventHandlerRequest>) {
    this.db = useDrizzle(event)
  }

  private validateInputs({ email, phone, password }: {
    email?: string
    phone?: string
    password: string
  }): ValidationResult {
    // Ensure that at least one of email or phone is provided
    if (!email && !phone) {
      return {
        user: null,
        isValid: false,
        message: 'Email and phone cannot both be empty',
      }
    }

    // Validate email if provided
    if (email && (typeof email !== 'string' || !isValidEmail(email))) {
      return {
        user: null,
        isValid: false,
        message: 'Invalid Email',
      }
    }

    // Validate phone if provided
    if (phone && typeof phone !== 'string') {
      return {
        user: null,
        isValid: false,
        message: 'Invalid Phone',
      }
    }

    // Validate password
    if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
      return {
        user: null,
        isValid: false,
        message: 'Invalid Password Length',
      }
    }

    return {
      user: null,
      isValid: true,
    }
  }

  /**
   * Handle OAuth sign-in scenarios where the user doesn't have a password.
   * @param {string} userId -User ID
   * @param {string} email - User's email
   * @returns Promise<ValidationResult>
   */
  private async handleOauthSignIn(userId: string, email: string): Promise<ValidationResult> {
    const checkUserSignedWithOauth = await this.db.query.usersOauthTable.findFirst({
      where: table => eq(table.userId, userId),
    })

    if (checkUserSignedWithOauth) {
      return {
        user: null,
        isValid: false,
        message: `${email} was first used to sign in with '${checkUserSignedWithOauth.provider}', sign in again and set your password.`,
      }
    }
    else {
      return {
        user: null,
        isValid: false,
        message: `${email} was first used to sign in with Magic Link, sign in again and set your password.`,
      }
    }
  }

  /**
   * signin - Validate user credentials.
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns Promise<ValidationResult>
   */
  public async validateUserSignin(
    email: string,
    password: string,
  ): Promise<ValidationResult> {
    // Validate inputs
    const inputValidation = this.validateInputs({ email, password })
    if (!inputValidation.isValid) {
      return inputValidation
    }

    // Check if user exists
    const user = await this.db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    })

    if (!user) {
      return {
        user: null,
        isValid: false,
        message: `${email} doesn't exist!`,
      }
    }

    // Check if the user has a password
    if (!user.password) {
      return this.handleOauthSignIn(user.id, email)
    }

    // Verify the password
    const validPassword = await verifyPassword(user.password, password)

    if (!validPassword) {
      return {
        user: null,
        isValid: false,
        message: 'Password incorrect!',
      }
    }

    return {
      user,
      isValid: true,
    }
  }

  public async validateUserSignup({
    email,
    phone,
    password,
  }: {
    email?: string
    phone?: string
    password: string
  }): Promise<ValidationResult> {
    // Validate inputs
    const inputValidation = this.validateInputs({ email, phone, password })
    if (!inputValidation.isValid) {
      return inputValidation
    }

    const passwordHash = await hashPassword(password)
    const userId = generateId(15)

    if (email) {
      // Check if user exists
      const existingUser = await this.db.query.userTable.findFirst({
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
          return {
            user: null,
            isValid: false,
            message: 'Email already used',
          }
        }
      }
    }

    // TODO: pseudo-code
    // Optionally check for existing phone number
    if (phone) {
      const existingPhoneUser = await this.db.query.userTable.findFirst({
        where: eq(userTable.phone, phone),
      })
      if (existingPhoneUser) {
        return {
          user: null,
          isValid: false,
          message: 'Phone number already used',
        }
      }
    }

    // Insert user into userTable
    await this.db.insert(userTable).values({
      id: userId,
      email: email || null,
      phone: phone || null,
      password: passwordHash,
      status: 1,
    })

    const user = await this.db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
    })

    return {
      user,
      isValid: true,
    }
  }

  public async createUser() {}

  // Add other user-related methods here, such as:
  // async createUser(userData: UserData): Promise<User>
  // async updateUser(userId: string, userData: Partial<UserData>): Promise<User>
  // async deleteUser(userId: string): Promise<void>
  // async verifyEmail(userId: string): Promise<void>
  // etc.
}

export function useUser(event: H3Event<EventHandlerRequest>) {
  return new UserManager(event)
}
