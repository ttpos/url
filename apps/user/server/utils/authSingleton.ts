import { sessionTable, userTable } from '@@/server/database/schema'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia } from 'lucia'
import type { initializeDrizzle } from '@@/server/utils'

export class AuthSingleton {
  private static instance: AuthSingleton
  // private lucia: Lucia
  private lucia: any

  private constructor(db: ReturnType<typeof initializeDrizzle>) {
    const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)
    this.lucia = new Lucia(adapter, {
      sessionCookie: {
        attributes: {
          secure: import.meta.dev,
        },
      },
      getUserAttributes: (attributes) => {
        return {
          id: attributes.id,
          nickname: attributes.nickname,
          email: attributes.email,
          isEmailVerified: attributes.isEmailVerified,
        }
      },
      getSessionAttributes: (attributes) => {
        return {
          status: attributes.status,
          sessionToken: attributes.sessionToken,
          metadata: attributes.metadata,
        }
      },
    })
  }

  public static initialize(db: ReturnType<typeof initializeDrizzle>): void {
    if (!AuthSingleton.instance) {
      AuthSingleton.instance = new AuthSingleton(db)
    }
  }

  public static getInstance(): AuthSingleton {
    // if (!AuthSingleton.instance) {
    //   throw new Error('AuthSingleton not initialized. Call initialize() first.')
    // }
    return AuthSingleton.instance
  }

  // public getLucia(): Lucia {
  public getLucia(): any {
    return this.lucia
  }
}
