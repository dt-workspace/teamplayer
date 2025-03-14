// src/services/processService.ts
import { localDB } from '@database/db';
import { processes, Process, NewProcess } from '@models/Process';
import { eq, and } from 'drizzle-orm';

/**
 * Creates a new process.
 * @param userId - Owning user's ID
 * @param process - Process data
 * @returns Created process
 */
export const createProcess = async (
    userId: number,
    process: Omit<NewProcess, 'userId'>
): Promise<Process> => {
    const db = await localDB();
    const [newProcess] = await db
        .insert(processes)
        .values({ ...process, userId })
        .returning();
    return newProcess;
};

/**
 * Gets a process by ID.
 * @param id - Process ID
 * @returns Process or null
 */
export const getProcessById = async (id: number): Promise<Process | null> => {
    const db = await localDB();
    const [process] = await db.select().from(processes).where(eq(processes.id, id)).limit(1);
    return process || null;
};

/**
 * Gets all processes for a user.
 * @param userId - User ID
 * @returns Array of processes
 */
export const getProcessesByUser = async (userId: number): Promise<Process[]> => {
    const db = await localDB();
    return db.select().from(processes).where(eq(processes.userId, userId));
};

/**
 * Gets all processes for a project.
 * @param projectId - Project ID
 * @returns Array of processes
 */
export const getProcessesByProject = async (projectId: number): Promise<Process[]> => {
    const db = await localDB();
    return db.select().from(processes).where(eq(processes.projectId, projectId));
};

/**
 * Updates a process.
 * @param id - Process ID
 * @param updates - Partial process data
 * @returns Updated process
 */
export const updateProcess = async (
    id: number,
    updates: Partial<NewProcess>
): Promise<Process> => {
    const db = await localDB();
    const [process] = await db
        .update(processes)
        .set(updates)
        .where(eq(processes.id, id))
        .returning();
    return process;
};

/**
 * Deletes a process.
 * @param id - Process ID
 * @returns Deleted process
 */
export const deleteProcess = async (id: number): Promise<Process> => {
    const db = await localDB();
    const [process] = await db.delete(processes).where(eq(processes.id, id)).returning();
    return process;
};

