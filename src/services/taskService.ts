// src/services/taskService.ts
import { localDB } from '@database/db';
import { personalTasks, PersonalTask, NewPersonalTask } from '@models/PersonalTask';
import { eq, and, gte, lte } from 'drizzle-orm';

/**
 * Creates a new personal task.
 * @param userId - Owning user's ID
 * @param task - Task data
 * @returns Created task
 */
export const createPersonalTask = async (
    userId: number,
    task: Omit<NewPersonalTask, 'userId'>
): Promise<PersonalTask> => {
    const db = await localDB();
    const [newTask] = await db
        .insert(personalTasks)
        .values({ ...task, userId })
        .returning();
    return newTask;
};

/**
 * Gets a personal task by ID.
 * @param id - Task ID
 * @returns Task or null
 */
export const getPersonalTaskById = async (id: number): Promise<PersonalTask | null> => {
    const db = await localDB();
    const [task] = await db.select().from(personalTasks).where(eq(personalTasks.id, id)).limit(1);
    return task || null;
};

/**
 * Gets all personal tasks for a user within a date range.
 * @param userId - User ID
 * @param startDate - Start date (ISO 8601)
 * @param endDate - End date (ISO 8601)
 * @returns Array of tasks
 */
export const getPersonalTasksByUser = async (
    userId: number,
    startDate: string,
    endDate: string
): Promise<PersonalTask[]> => {
    const db = await localDB();
    return db
        .select()
        .from(personalTasks)
        .where(
            and(
                eq(personalTasks.userId, userId),
                gte(personalTasks.dueDate, startDate),
                lte(personalTasks.dueDate, endDate)
            )
        );
};

/**
 * Updates a personal task.
 * @param id - Task ID
 * @param updates - Partial task data
 * @returns Updated task
 */
export const updatePersonalTask = async (
    id: number,
    updates: Partial<NewPersonalTask>
): Promise<PersonalTask> => {
    const db = await localDB();
    const [task] = await db
        .update(personalTasks)
        .set(updates)
        .where(eq(personalTasks.id, id))
        .returning();
    return task;
};

/**
 * Deletes a personal task.
 * @param id - Task ID
 * @returns Deleted task
 */
export const deletePersonalTask = async (id: number): Promise<PersonalTask> => {
    const db = await localDB();
    const [task] = await db.delete(personalTasks).where(eq(personalTasks.id, id)).returning();
    return task;
};

/**
 * Marks a task as completed.
 * @param id - Task ID
 * @returns Updated task
 */
export const completePersonalTask = async (id: number): Promise<PersonalTask> => {
    const db = await localDB();
    const [task] = await db
        .update(personalTasks)
        .set({ status: 'Completed' })
        .where(eq(personalTasks.id, id))
        .returning();
    return task;
};