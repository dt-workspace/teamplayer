// src/controllers/TaskController.ts
import {
    createPersonalTask,
    getPersonalTaskById,
    getPersonalTasksByUser,
    updatePersonalTask,
    deletePersonalTask,
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
        const newTask = await createPersonalTask(userId, task);
        return { success: true, data: newTask, message: 'Task created successfully' };
      } catch (error) {
        return { success: false, error: `Failed to create task: ${error}` };
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
      startDate: string,
      endDate: string
    ): Promise<ControllerResponse<PersonalTask[]>> {
      try {
        const tasks = await getPersonalTasksByUser(userId, startDate, endDate);
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