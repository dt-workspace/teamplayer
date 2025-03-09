// src/models/Project.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from './User';
import { relations } from 'drizzle-orm';

/**
 * Projects table schema for project management in the Team Player app.
 */
export const projects = sqliteTable('Projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description', { length: 500 }).notNull(),
  startDate: text('start_date').notNull(), // ISO 8601 string
  deadline: text('deadline').notNull(), // ISO 8601 string
  priority: text('priority', { enum: ['High', 'Medium', 'Low'] }).notNull(),
  assignedMembers: text('assigned_members'), // JSON string of team member IDs
  groupIds: text('group_ids'), // JSON string of group IDs
});

// Define relationships
export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

// Inferred TypeScript types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;