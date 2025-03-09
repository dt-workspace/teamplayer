// src/services/projectService.ts
import { localDB } from '@database/db';
import { projects, Project, NewProject } from '@models/Project';
import { eq } from 'drizzle-orm';

/**
 * Creates a new project.
 * @param userId - Owning user's ID
 * @param project - Project data
 * @returns Created project
 */
export const createProject = async (
    userId: number,
    project: Omit<NewProject, 'userId'>
): Promise<Project> => {
    const db = await localDB();
    const [newProject] = await db
        .insert(projects)
        .values({ ...project, userId })
        .returning();
    return newProject;
};

/**
 * Gets a project by ID.
 * @param id - Project ID
 * @returns Project or null
 */
export const getProjectById = async (id: number): Promise<Project | null> => {
    const db = await localDB();
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return project || null;
};

/**
 * Gets all projects for a user.
 * @param userId - User ID
 * @returns Array of projects
 */
export const getProjectsByUser = async (userId: number): Promise<Project[]> => {
    const db = await localDB();
    return db.select().from(projects).where(eq(projects.userId, userId));
};

/**
 * Updates a project.
 * @param id - Project ID
 * @param updates - Partial project data
 * @returns Updated project
 */
export const updateProject = async (
    id: number,
    updates: Partial<NewProject>
): Promise<Project> => {
    const db = await localDB();
    const [project] = await db
        .update(projects)
        .set(updates)
        .where(eq(projects.id, id))
        .returning();
    return project;
};

/**
 * Deletes a project.
 * @param id - Project ID
 * @returns Deleted project
 */
export const deleteProject = async (id: number): Promise<Project> => {
    const db = await localDB();
    const [project] = await db.delete(projects).where(eq(projects.id, id)).returning();
    return project;
};

/**
 * Assigns team members to a project.
 * @param projectId - Project ID
 * @param memberIds - Array of team member IDs
 * @returns Updated project
 */
export const assignTeamMembersToProject = async (
    projectId: number,
    memberIds: number[]
): Promise<Project> => {
    const db = await localDB();
    const assignedMembers = JSON.stringify(memberIds);
    const [project] = await db
        .update(projects)
        .set({ assignedMembers })
        .where(eq(projects.id, projectId))
        .returning();
    return project;
};