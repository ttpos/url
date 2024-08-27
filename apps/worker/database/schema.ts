import { isNull } from 'drizzle-orm'
import { blob, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const links = sqliteTable('links', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  domain: text('domain').notNull(),
  shortCode: text('short_code').notNull(),
  url: text('url').notNull(),
  userId: integer('user_id').notNull(),
  expiresAt: integer('expires_at'),
  isDelete: integer('is_delete').default(0),
}, (table) => {
  return {
    domain: index('links_domain').on(table.domain),
    shortCode: index('links_short_code').on(table.shortCode),
  }
})

export const pages = sqliteTable('pages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  domain: text('domain').notNull(),
  shortCode: text('short_code').notNull(),
  userId: text('user_id').notNull(),
  template: text('template').notNull(),
  data: blob('data').notNull(),
  isDelete: integer('is_delete').default(0),
  expiresAt: integer('expires_at'),
}, (table) => {
  return {
    domain: index('pages_domain').on(table.domain),
    shortCode: index('pages_short_code').on(table.shortCode),
  }
})
