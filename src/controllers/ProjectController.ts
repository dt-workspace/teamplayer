// src/controllers/ProjectController.ts
import {
    createProject,
    getProjectById,
    getProjectsByUser,
    updateProject,
    deleteProject,
    assignTeamMembersToProject,
  } from '@services/projectService';
  import { Project, NewProject } from '@models/Project';
  import { ControllerResponse } from '../types/response';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authController } from '.';
import { Alert } from 'react-native';
  
  export class ProjectController {
    /**
     * Creates a new project.
     * @param userId - Owning user's ID
     * @param project - Project data
     */
    async createProject(
      userId: number,
      project: Omit<NewProject, 'userId'>
    ): Promise<ControllerResponse<Project>> {
      try {
        const newProject = await createProject(userId, project);
        return { success: true, data: newProject, message: 'Project created successfully' };
      } catch (error) {
        return { success: false, error: `Failed to create project: ${error}` };
      }
    }
  
    /**
     * Gets a project by ID.
     * @param id - Project ID
     */
    async getProjectById(id: number): Promise<ControllerResponse<Project>> {
      try {
        const project = await getProjectById(id);
        if (!project) return { success: false, error: 'Project not found' };
        return { success: true, data: project };
      } catch (error) {
        return { success: false, error: `Failed to get project: ${error}` };
      }
    }
  
    /**
     * Gets all projects for a user.
     * @param userId - User ID
     */
    async getProjectsByUser(userId: number): Promise<ControllerResponse<Project[]>> {
      try {
        const projects = await getProjectsByUser(userId);
        return { success: true, data: projects };
      } catch (error) {
        return { success: false, error: `Failed to get projects: ${error}` };
      }
    }
  
    /**
     * Updates a project.
     * @param id - Project ID
     * @param updates - Partial project data
     */
    async updateProject(
      id: number,
      updates: Partial<NewProject>
    ): Promise<ControllerResponse<Project>> {
      try {
        const project = await updateProject(id, updates);
        return { success: true, data: project, message: 'Project updated successfully' };
      } catch (error) {
        return { success: false, error: `Failed to update project: ${error}` };
      }
    }
  
    /**
     * Deletes a project.
     * @param id - Project ID
     */
    async deleteProject(id: number): Promise<ControllerResponse<Project>> {
      try {
        const project = await deleteProject(id);
        return { success: true, data: project, message: 'Project deleted successfully' };
      } catch (error) {
        return { success: false, error: `Failed to delete project: ${error}` };
      }
    }
  
    /**
     * Assigns team members to a project.
     * @param projectId - Project ID
     * @param memberIds - Array of team member IDs
     */
    async assignTeamMembers(
      projectId: number,
      memberIds: number[]
    ): Promise<ControllerResponse<Project>> {
      try {
        const project = await assignTeamMembersToProject(projectId, memberIds);
        return { success: true, data: project, message: 'Team members assigned successfully' };
      } catch (error) {
        return { success: false, error: `Failed to assign team members: ${error}` };
      }
    }

    /**
     * Gets all projects (wrapper for getProjectsByUser with current user).
     * This is used by the ProjectsScreen.
     */
    async getAllProjects(): Promise<ControllerResponse<Project[]>> {
      try {
        const user = await authController.getCurrentUser();
        if(!user){
          Alert.alert('Error', 'User not found');
        }
        const projects = await getProjectsByUser(user?.id);
        return { success: true, data: projects };
      } catch (error) {
        return { success: false, error: `Failed to get projects: ${error}` };
      }
    }

    /**
     * Updates project progress.
     * @param id - Project ID
     * @param progress - New progress value (0-100)
     */
    async updateProjectProgress(
      id: number,
      progress: number
    ): Promise<ControllerResponse<Project>> {
      try {
        // Ensure progress is between 0 and 100
        const validProgress = Math.max(0, Math.min(100, progress));
        const project = await updateProject(id, { progress: validProgress });
        return { success: true, data: project, message: 'Project progress updated successfully' };
      } catch (error) {
        return { success: false, error: `Failed to update project progress: ${error}` };
      }
    }
  }