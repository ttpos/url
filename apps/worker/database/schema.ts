import { blob, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const links = sqliteTable('links', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  url: text('url').notNull(),
  userId: text('user_id').notNull(),
  expiresAt: integer('expires_at'),
  isDelete: integer('is_delete').default(0),
  hash: text('hash').notNull(),
  attribute: blob('attribute'),
}, (table) => {
  return {
    sha1: uniqueIndex('links_hash').on(table.hash),
  }
})

export const pages = sqliteTable('pages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  template: text('template').notNull(),
  data: blob('data').notNull(),
  isDelete: integer('is_delete').default(0),
  expiresAt: integer('expires_at'),
  hash: text('hash').notNull(),
  attribute: blob('attribute'),
}, (table) => {
  return {
    sha1: uniqueIndex('pages_hash').on(table.hash),
  }
})
