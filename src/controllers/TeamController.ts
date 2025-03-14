// src/controllers/TeamController.ts
import {
    createTeamMember,
    getTeamMemberById,
    getTeamMembersByUser,
    updateTeamMember,
    deleteTeamMember,
    getTeamMembersByGroups,
    deleteAll
  } from '@services/teamService';
  import { TeamMember, NewTeamMember } from '@models/TeamMember';
  import { ControllerResponse } from '../types/response';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authController } from '.';
import { Alert } from 'react-native';
  
  export class TeamController {
    /**
     * Creates a new team member.
     * @param userId - Owning user's ID
     * @param member - Team member data
     */
    async createTeamMember(
      userId: number,
      member: Omit<NewTeamMember, 'userId'>
    ): Promise<ControllerResponse<TeamMember>> {
      try {
        const newMember = await createTeamMember(userId, member);
        return { success: true, data: newMember, message: 'Team member created successfully' };
      } catch (error) {
        return { success: false, error: `Failed to create team member: ${error}` };
      }
    }
  
    /**
     * Gets a team member by ID.
     * @param id - Team member ID
     */
    async getTeamMemberById(id: number): Promise<ControllerResponse<TeamMember>> {
      try {
        const member = await getTeamMemberById(id);
        if (!member) return { success: false, error: 'Team member not found' };
        return { success: true, data: member };
      } catch (error) {
        return { success: false, error: `Failed to get team member: ${error}` };
      }
    }
  
    /**
     * Gets all team members for a user.
     * @param userId - User ID
     */
    async getTeamMembersByUser(userId: number): Promise<ControllerResponse<TeamMember[]>> {
      try {
        const members = await getTeamMembersByUser(userId);
        return { success: true, data: members };
      } catch (error) {
        return { success: false, error: `Failed to get team members: ${error}` };
      }
    }
  
    /**
     * Updates a team member.
     * @param id - Team member ID
     * @param updates - Partial team member data
     */
    async updateTeamMember(
      id: number,
      updates: Partial<NewTeamMember>
    ): Promise<ControllerResponse<TeamMember>> {
      try {
        const member = await updateTeamMember(id, updates);
        return { success: true, data: member, message: 'Team member updated successfully' };
      } catch (error) {
        return { success: false, error: `Failed to update team member: ${error}` };
      }
    }
  
    /**
     * Deletes a team member.
     * @param id - Team member ID
     */
    async deleteTeamMember(id: number): Promise<ControllerResponse<TeamMember>> {
      try {
        const member = await deleteTeamMember(id);
        return { success: true, data: member, message: 'Team member deleted successfully' };
      } catch (error) {
        return { success: false, error: `Failed to delete team member: ${error}` };
      }
    }
  
    /**
     * Gets team members by group IDs.
     * @param userId - User ID
     * @param groupIds - Array of group IDs
     */
    async getTeamMembersByGroups(
      userId: number,
      groupIds: string[]
    ): Promise<ControllerResponse<TeamMember[]>> {
      try {
        const members = await getTeamMembersByGroups(userId, groupIds);
        return { success: true, data: members };
      } catch (error) {
        return { success: false, error: `Failed to get team members by groups: ${error}` };
      }
    }
  
    /**
     * Deletes all team members for a user.
     * @param userId - User ID
     */
    async deleteAllTeamMembers(userId: number): Promise<ControllerResponse<TeamMember[]>> {
      try {
        const members = await deleteAll(userId);
        return { success: true, data: members, message: 'All team members deleted successfully' };
      } catch (error) {
        return { success: false, error: `Failed to delete all team members: ${error}` };
      }
    }

    /**
     * Gets all team members (wrapper for getTeamMembersByUser with current user).
     * This is used by the ProjectsScreen and ProjectDetailScreen.
     */
    async getAllTeamMembers(): Promise<ControllerResponse<TeamMember[]>> {
      try {
        
        const user = await authController.getCurrentUser();
        if(!user){
          Alert.alert('Error', 'User not found');
        }
       
        
        const members = await getTeamMembersByUser(user?.id);
        return { success: true, data: members };
      } catch (error) {
        return { success: false, error: `Failed to get team members: ${error}` };
      }
    }
  }