// src/models/PersonalTask.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from './User';
import { relations } from 'drizzle-orm';

/**
 * PersonalTasks table schema for personal task management in the Team Player app.
 */
export const personalTasks = sqliteTable('PersonalTasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  dueDate: text('due_date').notNull(), // ISO 8601 string with time
  priority: text('priority', { enum: ['High', 'Medium', 'Low'] }).notNull(),
  category: text('category'),
  status: text('status', {
    enum: ['To Do', 'In Progress', 'Completed', 'On Hold'],
  }).notNull(),
  notes: text('notes', { length: 1000 }),
  subtasks: text('subtasks'), // JSON string of subtasks
});

// Define relationships
export const personalTasksRelations = relations(personalTasks, ({ one }) => ({
  user: one(users, {
    fields: [personalTasks.userId],
    references: [users.id],
  }),
}));

// Inferred TypeScript types
export type PersonalTask = typeof personalTasks.$inferSelect;
export type NewPersonalTask = typeof personalTasks.$inferInsert;