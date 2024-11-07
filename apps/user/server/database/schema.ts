/* eslint-disable ts/no-use-before-define */

import type { SessionSource, VerificationType } from '~~/server/types'
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'

import { blob, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

const trackingFields = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
  isDeleted: integer('is_deleted')
    .notNull()
    .default(0),
}

export type GatewayType = 'http' | 'other'

export const gatewayTable = sqliteTable(
  'gateway',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    area: text('area').notNull(),
    type: text('type').notNull().$type<GatewayType>(),
    domains: text('domains').notNull(),
    className: text('class_name').notNull(),
    defaultCerts: text('default_certs'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
    isDeleted: integer('is_deleted')
      .notNull()
      .default(0),
  },
  (table) => {
    return {
      gatewayUniqueIndex: uniqueIndex('gateway_unique_index').on(
        table.name,
        table.area,
      ),
    }
  },
)

export const userTable = sqliteTable(
  'user',
  {
    id: text('id').primaryKey(),
    email: text('email'),
    emailHash: text('email_hash'),
    phone: text('phone'),
    phoneHash: text('phone_hash'),
    oauthRegisterId: text('oauth_register_id').references((): AnySQLiteColumn => usersOauthTable.id),
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
    ...trackingFields,
  },
  (table) => {
    return {
      userUniqueIndex: uniqueIndex('user_unique_index').on(
        table.email,
        table.phone,
        table.oauthRegisterId,
      ),
    }
  },
)

export const usersOauthTable = sqliteTable(
  'users_oauth',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => userTable.id),
    /** github/google */
    provider: text('provider').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: integer('expires_at'),
    ...trackingFields,
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
    type: text('type').$type<VerificationType>().notNull(),
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
    ...trackingFields,
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
    ...trackingFields,
  },
)

export const sessionTable = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    source: text('source').$type<SessionSource>().notNull(),
    expiresAt: integer('expires_at').notNull(),
    status: text('status').notNull(),
    mfaId: text('mfa_id')
      .references(() => mfaTable.id),
    /**
     * Example metadata structure:
     * [
     *   {
     *     ip: '',
     *     country: '',
     *     deviceInfo: '',
     *     createdAt: Date.now(),
     *   }
     * ]
     */
    metadata: blob('metadata').notNull(),
    ...trackingFields,
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
    ...trackingFields,
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
    lastUsedAt: integer('last_used_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    ...trackingFields,
  },
)
