// src/models/Process.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from './User';
import { relations } from 'drizzle-orm';

/**
 * Process table schema for grouping projects and tasks in the Team Player app.
 */
export const processes = sqliteTable('Processes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description', { length: 500 }),
  projectIds: text('project_ids'), // JSON string of project IDs
  taskIds: text('task_ids'), // JSON string of non-project task IDs
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'), // ISO 8601 string
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'), // ISO 8601 string
});

// Define relationships
export const processesRelations = relations(processes, ({ one }) => ({
  user: one(users, {
    fields: [processes.userId],
    references: [users.id],
  }),
}));

// Inferred TypeScript types
export type Process = typeof processes.$inferSelect;
export type NewProcess = typeof processes.$inferInsert;