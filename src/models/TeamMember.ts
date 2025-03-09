// src/models/TeamMember.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from './User';
import { relations } from 'drizzle-orm';

/**
 * TeamMembers table schema for team management in the Team Player app.
 */
export const teamMembers = sqliteTable('TeamMembers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  role: text('role').notNull(),
  phone: text('phone'),
  email: text('email'),
  status: text('status', { enum: ['Free', 'Occupied'] }).notNull(),
  groupIds: text('group_ids'), // JSON string of group IDs
});

// Define relationships
export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

// Inferred TypeScript types
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;