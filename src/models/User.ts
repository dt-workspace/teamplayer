// src/models/User.ts
import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';

/**
 * Users table schema for local authentication and management in the Team Player app.
 */
export const users = sqliteTable(
  'Users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    pinHash: text('pin_hash').notNull(),
    profileName: text('profile_name'),
    recoveryAnswer: text('recovery_answer'),
    createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'), // ISO 8601 string
    updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'), // ISO 8601 string
    role: text('role', { enum: ['Senior PM', 'Junior PM', 'Admin', 'Guest'] }).default('Senior PM'),
    lastLogin: text('last_login'), // ISO 8601 string, nullable
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true), // 1 = true, 0 = false
    settings: text('settings'), // JSON string for user preferences
  },
  (table) => ({
    usernameIdx: unique('username_idx').on(table.username),
  })
);

// Inferred TypeScript types
export type User = typeof users.$inferSelect; // For selecting data
export type NewUser = typeof users.$inferInsert; // For inserting data