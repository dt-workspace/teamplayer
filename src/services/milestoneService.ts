// src/services/milestoneService.ts
import { localDB } from '@database/db';
import { milestones, Milestone, NewMilestone } from '@models/Milestone';
import { eq, and } from 'drizzle-orm';

/**
 * Creates a new milestone for a project.
 * @param userId - Owning user's ID
 * @param projectId - Project ID
 * @param milestone - Milestone data
 * @returns Created milestone
 */
export const createMilestone = async (
    userId: number,
    projectId: number,
    milestone: Omit<NewMilestone, 'userId' | 'projectId'>
): Promise<Milestone> => {
    const db = await localDB();
    const [newMilestone] = await db
        .insert(milestones)
        .values({ ...milestone, userId, projectId })
        .returning();
    return newMilestone;
};

/**
 * Gets a milestone by ID.
 * @param id - Milestone ID
 * @returns Milestone or null
 */
export const getMilestoneById = async (id: number): Promise<Milestone | null> => {
    const db = await localDB();
    const [milestone] = await db.select().from(milestones).where(eq(milestones.id, id)).limit(1);
    return milestone || null;
};

/**
 * Gets all milestones for a project.
 * @param projectId - Project ID
 * @returns Array of milestones
 */
export const getMilestonesByProject = async (projectId: number): Promise<Milestone[]> => {
    const db = await localDB();
    return db.select().from(milestones).where(eq(milestones.projectId, projectId));
};

/**
 * Gets all milestones for a user.
 * @param userId - User ID
 * @returns Array of milestones
 */
export const getMilestonesByUser = async (userId: number): Promise<Milestone[]> => {
    const db = await localDB();
    return db.select().from(milestones).where(eq(milestones.userId, userId));
};

/**
 * Updates a milestone.
 * @param id - Milestone ID
 * @param updates - Partial milestone data
 * @returns Updated milestone
 */
export const updateMilestone = async (
    id: number,
    updates: Partial<NewMilestone>
): Promise<Milestone> => {
    const db = await localDB();
    const [milestone] = await db
        .update(milestones)
        .set(updates)
        .where(eq(milestones.id, id))
        .returning();
    return milestone;
};

/**
 * Deletes a milestone.
 * @param id - Milestone ID
 * @returns Deleted milestone
 */
export const deleteMilestone = async (id: number): Promise<Milestone> => {
    const db = await localDB();
    const [milestone] = await db.delete(milestones).where(eq(milestones.id, id)).returning();
    return milestone;
};

/**
 * Updates milestone status.
 * @param id - Milestone ID
 * @param status - New status
 * @returns Updated milestone
 */
export const updateMilestoneStatus = async (
    id: number,
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed'
): Promise<Milestone> => {
    const db = await localDB();
    const [milestone] = await db
        .update(milestones)
        .set({ status })
        .where(eq(milestones.id, id))
        .returning();
    return milestone;
};