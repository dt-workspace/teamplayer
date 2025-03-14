// src/models/Milestone.ts
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { users } from './User';
import { projects } from './Project';
import { personalTasks } from './PersonalTask';
import { relations } from 'drizzle-orm';

/**
 * Milestones table schema for project milestone management in the Team Player app.
 */
export const milestones = sqliteTable('Milestones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  startDate: text('start_date').notNull(), // ISO 8601 string
  deadline: text('deadline').notNull(), // ISO 8601 string
  paymentDate: text('payment_date'), // ISO 8601 string, optional
  paymentPercentage: real('payment_percentage'), // Percentage of total payment, optional
  weeklyMeetingDay: text('weekly_meeting_day', { 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
  }), // Day of the week for regular meetings, optional
  description: text('description', { length: 500 }),
  status: text('status', { enum: ['Not Started', 'In Progress', 'Completed', 'Delayed'] }).default('Not Started'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'), // ISO 8601 string
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'), // ISO 8601 string
});

// Define relationships
export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  user: one(users, {
    fields: [milestones.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [milestones.projectId],
    references: [projects.id],
  }),
  tasks: many(personalTasks),
}));

// Inferred TypeScript types
export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;