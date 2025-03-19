// src/controllers/TaskController.ts
import {
    createPersonalTask,
    getPersonalTaskById,
    getPersonalTasksByUser,
    getTasksByProject,
    updatePersonalTask,
    deletePersonalTask,
    getTasksByMilestone,
    completePersonalTask,
  } from '@services/taskService';
  import { PersonalTask, NewPersonalTask } from '@models/PersonalTask';
  import { ControllerResponse } from '../types/response';
  
  export class TaskController {
    /**
     * Creates a new personal task.
     * @param userId - Owning user's ID
     * @param task - Task data
     */
    async createPersonalTask(
      userId: number,
      task: Omit<NewPersonalTask, 'userId'>
    ): Promise<ControllerResponse<PersonalTask>> {
      try {
        if (!userId) {
          return { success: false, error: 'User ID is required' };
        }

        if (!task) {
          return { success: false, error: 'Task data is required' };
        }

        // Validate required fields
        const requiredFields = ['name', 'dueDate', 'priority', 'status', 'taskType', 'points'];
        for (const field of requiredFields) {
          if (!task[field]) {
            return { success: false, error: `${field} is required` };
          }
        }
        console.log(task)

        const newTask = await createPersonalTask(userId, task);
        return { success: true, data: newTask, message: 'Task created successfully' };
      } catch (error) {
        console.error('Error in TaskController.createPersonalTask:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { success: false, error: errorMessage };
      }
    }
    
    /**
     * Gets all tasks for a project.
     * @param projectId - Project ID
     */
    async getTasksByProject(projectId: number): Promise<ControllerResponse<PersonalTask[]>> {
      try {
        if (!projectId) {
          return { success: false, error: 'Project ID is required' };
        }
        
        const tasks = await getTasksByProject(projectId);
        return { success: true, data: tasks };
      } catch (error) {
        console.error('Error in TaskController.getTasksByProject:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { success: false, error: errorMessage };
      }
    }

    /**
     * Gets all tasks for a milestone.
     * @param milestoneId - Milestone ID
     */
    async getTasksByMilestone(milestoneId: number): Promise<ControllerResponse<PersonalTask[]>> {
      try {
        if (!milestoneId) {
          return { success: false, error: 'Milestone ID is required' };
        }
        
        const tasks = await getTasksByMilestone(milestoneId);
        return { success: true, data: tasks };
      } catch (error) {
        console.error('Error in TaskController.getTasksByMilestone:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { success: false, error: errorMessage };
      }
    }
  
    /**
     * Gets a personal task by ID.
     * @param id - Task ID
     */
    async getPersonalTaskById(id: number): Promise<ControllerResponse<PersonalTask>> {
      try {
        const task = await getPersonalTaskById(id);
        if (!task) return { success: false, error: 'Task not found' };
        return { success: true, data: task };
      } catch (error) {
        return { success: false, error: `Failed to get task: ${error}` };
      }
    }
  
    /**
     * Gets all personal tasks for a user within a date range.
     * @param userId - User ID
     * @param startDate - Start date (ISO 8601)
     * @param endDate - End date (ISO 8601)
     */
    async getPersonalTasksByUser(
      userId: number,
    ): Promise<ControllerResponse<PersonalTask[]>> {
      try {
        const tasks = await getPersonalTasksByUser(userId);
        return { success: true, data: tasks };
      } catch (error) {
        return { success: false, error: `Failed to get tasks: ${error}` };
      }
    }
  
    /**
     * Updates a personal task.
     * @param id - Task ID
     * @param updates - Partial task data
     */
    async updatePersonalTask(
      id: number,
      updates: Partial<NewPersonalTask>
    ): Promise<ControllerResponse<PersonalTask>> {
      try {
        console.log('updatessssss',updates)

        const task = await updatePersonalTask(id, updates);
        return { success: true, data: task, message: 'Task updated successfully' };
      } catch (error) {
        return { success: false, error: `Failed to update task: ${error}` };
      }
    }
  
    /**
     * Deletes a personal task.
     * @param id - Task ID
     */
    async deletePersonalTask(id: number): Promise<ControllerResponse<PersonalTask>> {
      try {
        const task = await deletePersonalTask(id);
        return { success: true, data: task, message: 'Task deleted successfully' };
      } catch (error) {
        return { success: false, error: `Failed to delete task: ${error}` };
      }
    }
  
    /**
     * Marks a task as completed.
     * @param id - Task ID
     */
    async completePersonalTask(id: number): Promise<ControllerResponse<PersonalTask>> {
      try {
        const task = await completePersonalTask(id);
        return { success: true, data: task, message: 'Task completed successfully' };
      } catch (error) {
        return { success: false, error: `Failed to complete task: ${error}` };
      }
    }
  }