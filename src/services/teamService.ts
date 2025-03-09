// src/services/teamService.ts
import { localDB } from '@database/db';
import { teamMembers, TeamMember, NewTeamMember } from '@models/TeamMember';
import { eq, inArray,and } from 'drizzle-orm';

/**
 * Creates a new team member.
 * @param userId - Owning user's ID
 * @param member - Team member data
 * @returns Created team member
 */
export const createTeamMember = async (
    userId: number,
    member: Omit<NewTeamMember, 'userId'>
): Promise<TeamMember> => {
    const db = await localDB();
    
    // Check for existing team member with the same email
    const existingMember = await db
  .select()
  .from(teamMembers)
  .where(eq(teamMembers.email, member.email))
  .limit(1);

    if (existingMember.length > 0) {
        throw new Error('A team member with this email already exists');
    }

    const [newMember] = await db
        .insert(teamMembers)
        .values({ ...member, userId })
        .returning();
    return newMember;
};

/**
 * Gets a team member by ID.
 * @param id - Team member ID
 * @returns Team member or null
 */
export const getTeamMemberById = async (id: number): Promise<TeamMember | null> => {
    const db = await localDB();
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
    return member || null;
};

/**
 * Gets all team members for a user.
 * @param userId - User ID
 * @returns Array of team members
 */
export const getTeamMembersByUser = async (userId: number): Promise<TeamMember[]> => {
    const db = await localDB();
    return db.select().from(teamMembers).where(eq(teamMembers.userId, userId));
};

/**
 * Updates a team member.
 * @param id - Team member ID
 * @param updates - Partial team member data
 * @returns Updated team member
 */
export const updateTeamMember = async (
    id: number,
    updates: Partial<NewTeamMember>
): Promise<TeamMember> => {
    const db = await localDB();
    const [member] = await db
        .update(teamMembers)
        .set(updates)
        .where(eq(teamMembers.id, id))
        .returning();
    return member;
};

/**
 * Deletes a team member.
 * @param id - Team member ID
 * @returns Deleted team member
 */
export const deleteTeamMember = async (id: number): Promise<TeamMember> => {
    const db = await localDB();
    const [member] = await db.delete(teamMembers).where(eq(teamMembers.id, id)).returning();
    return member;
};

/**
 * Gets team members by group IDs.
 * @param userId - User ID
 * @param groupIds - Array of group IDs
 * @returns Array of team members in the specified groups
 */
export const getTeamMembersByGroups = async (
    userId: number,
    groupIds: string[]
): Promise<TeamMember[]> => {
    const db = await localDB();
    return db
        .select()
        .from(teamMembers)
        .where(
            eq(teamMembers.userId, userId) &&
            inArray(
                teamMembers.groupIds,
                groupIds.map((id) => JSON.stringify([id]))
            )
        );
};

/**
 * Deletes all team members for a user.
 * @param userId - User ID
 * @returns Array of deleted team members
 */
export const deleteAll = async (userId: number): Promise<TeamMember[]> => {
    const db = await localDB();
    const members = await db.delete(teamMembers).where(eq(teamMembers.userId, userId)).returning();
    return members;
};