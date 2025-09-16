import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { randomUUID } from 'node:crypto';

export const links = pgTable('links', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    url: text('url').notNull(),
    shortUrl: text('short_url').notNull().unique(),
    accessCount: integer('access_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
});