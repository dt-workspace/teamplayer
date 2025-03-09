// src/controllers/AvailabilityController.ts
import {
    createAvailability,
    getAvailabilityById,
    getAvailabilityByMember,
    updateAvailability,
    deleteAvailability,
  } from '@services/availabilityService';
  import { Availability, NewAvailability } from '@models/Availability';
  import { ControllerResponse } from '../types/response';
  
  export class AvailabilityController {
    /**
     * Creates a new availability entry.
     * @param userId - Owning user's ID
     * @param entry - Availability data
     */
    async createAvailability(
      userId: number,
      entry: Omit<NewAvailability, 'userId'>
    ): Promise<ControllerResponse<Availability>> {
      try {
        const newEntry = await createAvailability(userId, entry);
        return { success: true, data: newEntry, message: 'Availability created successfully' };
      } catch (error) {
        return { success: false, error: `Failed to create availability: ${error}` };
      }
    }
  
    /**
     * Gets availability by ID.
     * @param id - Availability ID
     */
    async getAvailabilityById(id: number): Promise<ControllerResponse<Availability>> {
      try {
        const entry = await getAvailabilityById(id);
        if (!entry) return { success: false, error: 'Availability not found' };
        return { success: true, data: entry };
      } catch (error) {
        return { success: false, error: `Failed to get availability: ${error}` };
      }
    }
  
    /**
     * Gets availability for a team member within a date range.
     * @param userId - User ID
     * @param memberId - Team member ID
     * @param startDate - Start date (ISO 8601)
     * @param endDate - End date (ISO 8601)
     */
    async getAvailabilityByMember(
      userId: number,
      memberId: number,
      startDate: string,
      endDate: string
    ): Promise<ControllerResponse<Availability[]>> {
      try {
        const entries = await getAvailabilityByMember(userId, memberId, startDate, endDate);
        return { success: true, data: entries };
      } catch (error) {
        return { success: false, error: `Failed to get availability: ${error}` };
      }
    }
  
    /**
     * Updates an availability entry.
     * @param id - Availability ID
     * @param updates - Partial availability data
     */
    async updateAvailability(
      id: number,
      updates: Partial<NewAvailability>
    ): Promise<ControllerResponse<Availability>> {
      try {
        const entry = await updateAvailability(id, updates);
        return { success: true, data: entry, message: 'Availability updated successfully' };
      } catch (error) {
        return { success: false, error: `Failed to update availability: ${error}` };
      }
    }
  
    /**
     * Deletes an availability entry.
     * @param id - Availability ID
     */
    async deleteAvailability(id: number): Promise<ControllerResponse<Availability>> {
      try {
        const entry = await deleteAvailability(id);
        return { success: true, data: entry, message: 'Availability deleted successfully' };
      } catch (error) {
        return { success: false, error: `Failed to delete availability: ${error}` };
      }
    }
  }