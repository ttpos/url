import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  email: text('email').unique(),
  emailHash: text('email_hash').notNull(),
  phone: text('phone').unique(),
  phoneHash: text('phone_hash').notNull(),
  password: text('password').notNull(),
  isEmailVerified: integer('is_email_verified').default(0),
  isPhoneVerified: integer('is_phone_verified').default(0),
  /**
   * 状态
   * - 0 禁用
   * - 1 激活
   */
  status: integer('status').default(0),
  created: integer('created_at').default(Date.now()),
  updated: integer('updated_at').default(Date.now()),
  nickname: text('nickname'),
  language: text('language'),
  country: text('country'),
}, (table) => {
  return {
    emailIndex: uniqueIndex('email_index').on(table.email),
    phoneIndex: uniqueIndex('phone_index').on(table.phone),
  }
})

export const emailVerificationTable = sqliteTable(
  'email_verification',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    code: text('code').notNull(),
    expiresAt: integer('expires_at').notNull(),
    ip: text('ip_address').notNull(),
  },
  table => ({
    index: uniqueIndex('idx_email_verification_userId_code').on(table.userId, table.code),
  }),
)

export const passwordResetTable = sqliteTable(
  'password_reset',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    code: text('code').notNull(),
    expiresAt: integer('expires_at').notNull(),
  },
  table => ({
    index: uniqueIndex('idx_password_reset_userId_code').on(table.userId, table.code),
  }),
)

export const usersOauthTable = sqliteTable('users_oauth', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  provider: text('provider').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: integer('expires_at'),
  created: integer('created_at').default(Date.now()),
  updated: integer('updated_at').default(Date.now()),
}, (table) => {
  return {
    uniqueProviderUserIndex: uniqueIndex('unique_provider_user_index').on(table.provider, table.providerUserId),
  }
})

export const mfaTable = sqliteTable('mfa', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  type: text('type').notNull(),
  name: text('name').notNull(),
  status: text('status').notNull(),
  lastVerified: integer('last_verified_at'),
  lastMfaId: text('last_mfa_id'),
  created: integer('created_at').default(Date.now()),
  updated: integer('updated_at').default(Date.now()),
})

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  sessionToken: text('session_token').notNull(),
  created: integer('created_at').default(Date.now()),
  updated: integer('updated_at').default(Date.now()),
  expiresAt: integer('expires_at').notNull(),
  status: text('status').notNull(),
  date: integer('date').default(Date.now()),
  ip: text('ip_address').notNull(),
  country: text('country'),
  deviceInfo: text('device_info'),
})

export const activityLogTable = sqliteTable('activity_log', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  action: text('action').notNull(),
  timestamp: integer('timestamp').default(Date.now()),
  ipAddress: text('ip_address').notNull(),
  details: text('details'),
  sessionId: text('session_id'),
})
