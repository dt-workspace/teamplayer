// src/controllers/MilestoneController.ts
import { createMilestone, getMilestoneById, getMilestonesByProject, updateMilestone, deleteMilestone, updateMilestoneStatus } from '@services/milestoneService';
import type { Milestone, NewMilestone } from '@models/Milestone';

/**
 * Controller for milestone management operations.
 */
export class MilestoneController {
  /**
   * Creates a new milestone for a project.
   * @param userId - Owning user's ID
   * @param projectId - Project ID
   * @param milestoneData - Milestone data
   * @returns Created milestone
   */
  static async createMilestone(
    userId: number,
    projectId: number,
    milestoneData: Omit<NewMilestone, 'userId' | 'projectId'>
  ): Promise<Milestone> {
    try {
      return await createMilestone(userId, projectId, milestoneData);
    } catch (error) {
      console.error('Error in MilestoneController.createMilestone:', error);
      throw error;
    }
  }

  /**
   * Gets a milestone by ID.
   * @param id - Milestone ID
   * @returns Milestone or null
   */
  static async getMilestoneById(id: number): Promise<Milestone | null> {
    try {
      return await getMilestoneById(id);
    } catch (error) {
      console.error('Error in MilestoneController.getMilestoneById:', error);
      throw error;
    }
  }

  /**
   * Gets all milestones for a project.
   * @param projectId - Project ID
   * @returns Array of milestones
   */
  static async getMilestonesByProject(projectId: number): Promise<Milestone[]> {
    try {
      return await getMilestonesByProject(projectId);
    } catch (error) {
      console.error('Error in MilestoneController.getMilestonesByProject:', error);
      throw error;
    }
  }

  /**
   * Updates a milestone.
   * @param id - Milestone ID
   * @param updates - Partial milestone data
   * @returns Updated milestone
   */
  static async updateMilestone(
    id: number,
    updates: Partial<NewMilestone>
  ): Promise<Milestone> {
    try {
      return await updateMilestone(id, updates);
    } catch (error) {
      console.error('Error in MilestoneController.updateMilestone:', error);
      throw error;
    }
  }

  /**
   * Deletes a milestone.
   * @param id - Milestone ID
   * @returns Deleted milestone
   */
  static async deleteMilestone(id: number): Promise<Milestone> {
    try {
      return await deleteMilestone(id);
    } catch (error) {
      console.error('Error in MilestoneController.deleteMilestone:', error);
      throw error;
    }
  }

  /**
   * Updates milestone status.
   * @param id - Milestone ID
   * @param status - New status
   * @returns Updated milestone
   */
  static async updateMilestoneStatus(
    id: number,
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed'
  ): Promise<Milestone> {
    try {
      return await updateMilestoneStatus(id, status);
    } catch (error) {
      console.error('Error in MilestoneController.updateMilestoneStatus:', error);
      throw error;
    }
  }
}