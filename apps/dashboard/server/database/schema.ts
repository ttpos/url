import { blob, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
})

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
})
