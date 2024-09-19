/* eslint-disable ts/no-use-before-define */

import { blob, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable(
  'user',
  {
    id: text('id').primaryKey(),
    email: text('email'),
    emailHash: text('email_hash'),
    phone: text('phone'),
    phoneHash: text('phone_hash'),
    oauth_register_id: text('oauth_register_id').references(() => usersOauthTable.id),
    password: text('password'),
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
      userUniqueIndex: uniqueIndex('user_unique_index').on(
        table.email,
        table.phone,
        table.oauth_register_id,
      ),
    }
  },
)

export const usersOauthTable = sqliteTable(
  'users_oauth',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => userTable.id),
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
      uniqueProviderUserIndex: uniqueIndex('unique_provider_user_index').on(
        table.provider,
        table.providerUserId,
      ),
    }
  },
)

export const verificationTable = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .references(() => userTable.id),
    status: integer('status').default(0),
    verifyId: text('verify_id').notNull(),
    expiresAt: integer('expires_at').notNull(),
    createIp: text('create_ip'),
    verifyIp: text('verify_ip'),
    verifyData: text('verify_data'),
    /**
     * serial number
     */
    serial: text('serial'),
    /**
     * - email
     * - phone
     */
    type: text('type'),
    /**
     * Used to validate type records, Write routing address
     *
     * example:
     * - 1 retrieve password
     * - 2 modify email
     * - 3 modify phone
     * - 4 other
     */
    action: text('action'),
    createdAt: integer('created_at').default(Date.now()),
    updatedAt: integer('updated_at').default(Date.now()),
    isDeleted: integer('is_deleted'),
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
    value: text('value'),
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
      .references(() => mfaTable.id),
    // [
    //   {
    //     ip: '',
    //     country: '',
    //     deviceInfo: '',
    //     createdAt: Date.now(),
    //   },
    // ]
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
