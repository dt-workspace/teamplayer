// src/models/PersonalTask.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from './User';
import { projects } from './Project';
import { teamMembers } from './TeamMember';
import { relations } from 'drizzle-orm';
import { processes } from './Process';
import { milestones } from './Milestone';

/**
 * PersonalTasks table schema for personal task management in the Team Player app.
 */
export const personalTasks = sqliteTable('PersonalTasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  assignedToId: integer('assigned_to_id')
    .references(() => teamMembers.id, { onDelete: 'set null' }),
  projectId: integer('project_id')
    .references(() => projects.id, { onDelete: 'set null' }),
  milestoneId: integer('milestone_id')
    .references(() => milestones.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  dueDate: text('due_date').notNull(), // ISO 8601 string with time
  priority: text('priority', { enum: ['High', 'Medium', 'Low'] }).notNull(),
  category: text('category'),
  status: text('status', {
    enum: ['To Do', 'In Progress', 'Completed', 'On Hold'],
  }).notNull(),
  taskType: text('task_type', { enum: ['Small', 'Medium', 'Large'] }).notNull(),
  points: integer('points').notNull(), // 1 for Small, 3 for Medium, 5 for Large
  notes: text('notes', { length: 1000 }),
  subtasks: text('subtasks'), // JSON string of subtasks with same structure
  processId: integer('process_id')
    .references(() => processes.id, { onDelete: 'set null' }),
});

// Define relationships
export const personalTasksRelations = relations(personalTasks, ({ one }) => ({
  user: one(users, {
    fields: [personalTasks.userId],
    references: [users.id],
  }),
  assignedTo: one(teamMembers, {
    fields: [personalTasks.assignedToId],
    references: [teamMembers.id],
  }),
  project: one(projects, {
    fields: [personalTasks.projectId],
    references: [projects.id],
  }),
  milestone: one(milestones, {
    fields: [personalTasks.milestoneId],
    references: [milestones.id],
  }),
}));

// Inferred TypeScript types
export type PersonalTask = typeof personalTasks.$inferSelect;
export type NewPersonalTask = typeof personalTasks.$inferInsert;