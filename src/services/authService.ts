// src/services/authService.ts
import { localDB } from '@database/db';
import { users, User, NewUser } from '@models/User';
import { eq } from 'drizzle-orm';
import CryptoJS from 'crypto-js';

/**
 * Hashes a PIN using SHA-256.
 * @param pin - User's PIN
 * @returns Hashed PIN
 */
const hashPin = (pin: string): string => CryptoJS.SHA256(pin).toString();

// CRUD Operations
/**
 * Creates a new user with a hashed PIN.
 * @param username - Unique username
 * @param pin - User's PIN (4-6 digits)
 * @param profileName - Optional profile name
 * @param recoveryAnswer - Optional recovery answer
 * @returns Created user
 */
export const createUser = async (
  username: string,
  pin: string,
  profileName?: string,
  recoveryAnswer?: string
): Promise<User> => {
  const db = await localDB()
  const pinHash = hashPin(pin);
  const [user] = await db
    .insert(users)
    .values({
      username,
      pinHash,
      profileName,
      recoveryAnswer,
    })
    .returning();
  return user;
};

/**
 * Retrieves a user by ID.
 * @param id - User ID
 * @returns User or null if not found
 */
export const getUserById = async (id: number): Promise<User | null> => {
    const db = await localDB()
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
};

/**
 * Retrieves a user by username.
 * @param username - Username
 * @returns User or null if not found
 */
export const getUserByUsername = async (username: string): Promise<User | null> => {
    const db = await localDB()
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user || null;
};

/**
 * Updates a user's profile or settings.
 * @param id - User ID
 * @param updates - Partial user data to update
 * @returns Updated user
 */
export const updateUser = async (id: number, updates: Partial<NewUser>): Promise<User> => {
    const db = await localDB()
  const updatedAt = new Date().toISOString();
  const [user] = await db
    .update(users)
    .set({ ...updates, updatedAt })
    .where(eq(users.id, id))
    .returning();
  return user;
};

/**
 * Deletes a user (soft delete by setting isActive to false).
 * @param id - User ID
 * @returns Updated user
 */
export const deleteUser = async (id: number): Promise<User> => {
    const db = await localDB()
  const [user] = await db
    .update(users)
    .set({ isActive: false, updatedAt: new Date().toISOString() })
    .where(eq(users.id, id))
    .returning();
  return user;
};

// Authentication Operations
/**
 * Logs in a user by verifying the PIN.
 * @param username - Username
 * @param pin - User's PIN
 * @returns User if authenticated, null otherwise
 */
export const loginUser = async (username: string, pin: string): Promise<User | null> => {
    const db = await localDB()
  const user = await getUserByUsername(username);
  if (!user || !user.isActive || hashPin(pin) !== user.pinHash) {
    return null;
  }
  const lastLogin = new Date().toISOString();
  const [updatedUser] = await db
    .update(users)
    .set({ lastLogin })
    .where(eq(users.id, user.id))
    .returning();
  return updatedUser;
};

/**
 * Resets a user's PIN using the recovery answer.
 * @param username - Username
 * @param recoveryAnswer - Recovery answer
 * @param newPin - New PIN
 * @returns Updated user or null if recovery fails
 */
export const resetPin = async (
  username: string,
  recoveryAnswer: string,
  newPin: string
): Promise<User | null> => {
    const db = await localDB()
  const user = await getUserByUsername(username);
  if (!user || user.recoveryAnswer !== recoveryAnswer) {
    return null;
  }
  const pinHash = hashPin(newPin);
  const [updatedUser] = await db
    .update(users)
    .set({ pinHash, updatedAt: new Date().toISOString() })
    .where(eq(users.id, user.id))
    .returning();
  return updatedUser;
};