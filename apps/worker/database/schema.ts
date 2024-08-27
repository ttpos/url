import { blob, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const links = sqliteTable('links', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  domain: text('domain').notNull(),
  shortCode: text('short_code').notNull(),
  url: text('url').notNull(),
  expiresAt: integer('expires_at').notNull(),
  isDelete: integer('is_delete').notNull(),
  userId: integer('user_id').notNull(),
}, (table) => {
  return {
    domain: index('links_domain').on(table.domain),
    shortCode: index('links_short_code').on(table.shortCode),
  }
})

export const pages = sqliteTable('pages', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  domain: text('domain').notNull(),
  shortCode: text('short_code').notNull(),
  userId: text('user_id').notNull(),
  template: text('template').notNull(),
  data: blob('data').notNull(),
  isDelete: integer('is_delete').notNull(),
  expiresAt: integer('expires_at').notNull(),
  createAt: integer('create_at').notNull(),
}, (table) => {
  return {
    domain: index('pages_domain').on(table.domain),
    shortCode: index('pages_short_code').on(table.shortCode),
  }
})
