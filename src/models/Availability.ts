// src/models/Availability.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from './User';
import { teamMembers } from './TeamMember';
import { relations } from 'drizzle-orm';

/**
 * Availability table schema for tracking team availability in the Team Player app.
 */
export const availability = sqliteTable('Availability', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  memberId: integer('member_id')
    .notNull()
    .references(() => teamMembers.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // ISO 8601 string
  status: text('status', { enum: ['Free', 'Occupied', 'Partial'] }).notNull(),
  timeSlots: text('time_slots'), // JSON string of time slots
});

// Define relationships
export const availabilityRelations = relations(availability, ({ one }) => ({
  user: one(users, {
    fields: [availability.userId],
    references: [users.id],
  }),
  teamMember: one(teamMembers, {
    fields: [availability.memberId],
    references: [teamMembers.id],
  }),
}));

// Inferred TypeScript types
export type Availability = typeof availability.$inferSelect;
export type NewAvailability = typeof availability.$inferInsert;