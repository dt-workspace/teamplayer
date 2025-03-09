// src/services/availabilityService.ts
import { localDB } from '@database/db';
import { availability, Availability, NewAvailability } from '@models/Availability';
import { eq, and, gte, lte } from 'drizzle-orm';

/**
 * Creates a new availability entry.
 * @param userId - Owning user's ID
 * @param entry - Availability data
 * @returns Created availability
 */
export const createAvailability = async (
    userId: number,
    entry: Omit<NewAvailability, 'userId'>
): Promise<Availability> => {
    const db = await localDB();
    const [newEntry] = await db
        .insert(availability)
        .values({ ...entry, userId })
        .returning();
    return newEntry;
};

/**
 * Gets availability by ID.
 * @param id - Availability ID
 * @returns Availability or null
 */
export const getAvailabilityById = async (id: number): Promise<Availability | null> => {
    const db = await localDB();
    const [entry] = await db.select().from(availability).where(eq(availability.id, id)).limit(1);
    return entry || null;
};

/**
 * Gets availability for a team member within a date range.
 * @param userId - User ID
 * @param memberId - Team member ID
 * @param startDate - Start date (ISO 8601)
 * @param endDate - End date (ISO 8601)
 * @returns Array of availability entries
 */
export const getAvailabilityByMember = async (
    userId: number,
    memberId: number,
    startDate: string,
    endDate: string
): Promise<Availability[]> => {
    const db = await localDB();
    return db
        .select()
        .from(availability)
        .where(
            and(
                eq(availability.userId, userId),
                eq(availability.memberId, memberId),
                gte(availability.date, startDate),
                lte(availability.date, endDate)
            )
        );
};

/**
 * Updates an availability entry.
 * @param id - Availability ID
 * @param updates - Partial availability data
 * @returns Updated availability
 */
export const updateAvailability = async (
    id: number,
    updates: Partial<NewAvailability>
): Promise<Availability> => {
    const db = await localDB();
    const [entry] = await db
        .update(availability)
        .set(updates)
        .where(eq(availability.id, id))
        .returning();
    return entry;
};

/**
 * Deletes an availability entry.
 * @param id - Availability ID
 * @returns Deleted availability
 */
export const deleteAvailability = async (id: number): Promise<Availability> => {
    const db = await localDB();
    const [entry] = await db.delete(availability).where(eq(availability.id, id)).returning();
    return entry;
};