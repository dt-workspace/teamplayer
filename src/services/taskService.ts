// src/services/taskService.ts
import { localDB } from '@database/db';
import { personalTasks, PersonalTask, NewPersonalTask } from '@models/PersonalTask';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

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
    try {
        if (!userId) throw new Error('User ID is required');
        if (!task) throw new Error('Task data is required');

        const db = await localDB();
        if (!db) throw new Error('Database connection failed');

        // Validate required fields and data types
        const requiredFields = ['name', 'dueDate', 'priority', 'status', 'taskType', 'points'];
        for (const field of requiredFields) {
            if (!task[field] || (field === 'dueDate' && !task[field].toString())) {
                throw new Error(`${field} is required and must have a valid value`);
            }
        }

        // Format data for SQLite
        const formattedTask = {
            name: task.name,
            dueDate: task.dueDate.toString(),
            priority: task.priority,
            status: task.status,
            taskType: task.taskType,
            points: task.points,
            category: task.category || null,
            notes: task.notes || null,
            subtasks: task.subtasks ? JSON.stringify(task.subtasks) : null,
            projectId: task.projectId || null,
            processId: task.processId || null,
            milestoneId: task.milestoneId || null,
            assignedToId: task.assignedToId || null
        };

        console.log('Task data is valid', formattedTask, userId);

        // Validate task type and points correlation
        const pointsMap = { Small: 1, Medium: 3, Large: 5 };
        if (task.points !== pointsMap[task.taskType]) {
            throw new Error(`Invalid points for task type ${task.taskType}`);
        }

        const [newTask] = await db
            .insert(personalTasks)
            .values({ ...formattedTask, userId })
            .returning();

        if (!newTask) throw new Error('Failed to create task');

        return newTask;
    } catch (error) {
        console.error('Error in createPersonalTask:', error);
        throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
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
): Promise<PersonalTask[]> => {
    const db = await localDB();
    return db
        .select()
        .from(personalTasks)
        .where(
            eq(personalTasks.userId, userId),
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

/**
 * Gets all tasks for a project.
 * @param projectId - Project ID
 * @returns Array of tasks
 */
export const getTasksByProject = async (projectId: number): Promise<PersonalTask[]> => {
    const db = await localDB();
    return db
        .select()
        .from(personalTasks)
        .where(eq(personalTasks.projectId, projectId));
};

/**
 * Calculates task run rate for a project.
 * @param projectId - Project ID
 * @param startDate - Start date (ISO 8601)
 * @param endDate - End date (ISO 8601)
 * @returns Run rate metrics
 */
export const calculateTaskRunRate = async (
    projectId: number,
    startDate: string,
    endDate: string
): Promise<{ completed: number; total: number; runRate: number }> => {
    const db = await localDB();
    const tasks = await db
        .select({
            completed: sql<number>`sum(case when status = 'Completed' then 1 else 0 end)`,
            total: sql<number>`count(*)`
        })
        .from(personalTasks)
        .where(
            and(
                eq(personalTasks.projectId, projectId),
                gte(personalTasks.dueDate, startDate),
                lte(personalTasks.dueDate, endDate)
            )
        );

    const { completed, total } = tasks[0];
    const runRate = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, runRate };
};

/**
 * Gets all tasks for a process.
 * @param processId - Process ID
 * @returns Array of tasks
 */
export const getTasksByProcess = async (processId: number): Promise<PersonalTask[]> => {
    const db = await localDB();
    return db
        .select()
        .from(personalTasks)
        .where(eq(personalTasks.processId, processId));
};

/**
 * Gets all tasks for a milestone.
 * @param milestoneId - Milestone ID
 * @returns Array of tasks
 */
export const getTasksByMilestone = async (milestoneId: number): Promise<PersonalTask[]> => {
    const db = await localDB();
    return db
        .select()
        .from(personalTasks)
        .where(eq(personalTasks.milestoneId, milestoneId));
};