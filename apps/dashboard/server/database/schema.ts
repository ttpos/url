import { blob, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable(
  'user',
  {
    id: text('id').primaryKey(),
    email: text('email').unique(),
    emailHash: text('email_hash').notNull(),
    phone: text('phone').unique(),
    phoneHash: text('phone_hash').notNull(),
    password: text('password').notNull(),
    isEmailVerified: integer('is_email_verified').default(0),
    isPhoneVerified: integer('is_phone_verified').default(0),
    /**
     * - 0 disabled
     * - 1 activate
     */
    status: integer('status').default(0),
    nickname: text('nickname'),
    language: text('language'),
    country: text('country'),
    createdAt: integer('created_at').default(Date.now()),
    updatedAt: integer('updated_at').default(Date.now()),
    isDeleted: integer('is_deleted'),
  },
  (table) => {
    return {
      userUniqueIndex: uniqueIndex('user_unique_index').on(table.email, table.phone),
    }
  },
)

export const emailVerificationTable = sqliteTable(
  'email_verification',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    status: integer('status').default(0),
    verifyId: text('verify_id').notNull(),
    expiresAt: integer('expires_at').notNull(),
    createIp: text('create_ip'),
    verifyIp: text('verify_ip'),
    createdAt: integer('created_at').default(Date.now()),
    updatedAt: integer('updated_at').default(Date.now()),
    isDeleted: integer('is_deleted'),
  },
)

export const passwordResetTable = sqliteTable(
  'password_reset',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    status: integer('status').default(0),
    verifyId: text('verify_id').notNull(),
    expiresAt: integer('expires_at').notNull(),
    createIp: text('create_ip'),
    verifyIp: text('verify_ip'),
    createdAt: integer('created_at').default(Date.now()),
    updatedAt: integer('updated_at').default(Date.now()),
    isDeleted: integer('is_deleted'),
  },
)

export const usersOauthTable = sqliteTable(
  'users_oauth',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    provider: text('provider').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: integer('expires_at'),
    createdAt: integer('created_at').default(Date.now()),
    updatedAt: integer('updated_at').default(Date.now()),
    isDeleted: integer('is_deleted'),
  },
  (table) => {
    return {
      uniqueProviderUserIndex: uniqueIndex('unique_provider_user_index').on(table.provider, table.providerUserId),
    }
  },
)

export const mfaTable = sqliteTable(
  'mfa',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    type: text('type').notNull(),
    name: text('name').notNull(),
    status: text('status').notNull(),
    mfaId: text('mfa_id')
      .notNull()
      .references(() => mfaTable.id),
    lastVerifiedAt: integer('last_verified_at'),
    createdAt: integer('created_at').default(Date.now()),
    updatedAt: integer('updated_at').default(Date.now()),
    isDeleted: integer('is_deleted'),
  },
)

export const sessionTable = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    sessionToken: text('session_token').notNull(),
    expiresAt: integer('expires_at').notNull(),
    status: text('status').notNull(),
    mfaId: text('mfa_id')
      .notNull()
      .references(() => mfaTable.id),
    metadata: blob('metadata').notNull(),
    createdAt: integer('created_at').default(Date.now()),
    updatedAt: integer('updated_at').default(Date.now()),
    isDeleted: integer('is_deleted'),
  },
)

export const activityLogTable = sqliteTable(
  'activity_log',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    action: text('action').notNull(),
    details: text('details'),
    sessionId: text('session_id')
      .notNull()
      .references(() => sessionTable.id),
    createdAt: integer('created_at').default(Date.now()),
    isDeleted: integer('is_deleted'),
  },
)

export const tokens = sqliteTable(
  'tokens',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    token: text('token').notNull(),
    resources: blob('resources'),
    accesses: blob('accesses'),
    expiresAt: integer('expires_at'),
    createdAt: integer('created_at').default(Date.now()),
    updatedAt: integer('updated_at').default(Date.now()),
    lastUsedAt: integer('last_used_at').default(Date.now()),
    isDeleted: integer('is_deleted'),
  },
)
