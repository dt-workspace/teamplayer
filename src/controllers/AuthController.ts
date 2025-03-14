// src/controllers/AuthController.ts
import {
    createUser,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser,
    loginUser,
    resetPin,
  } from '@services/authService';
  import { User, NewUser } from '@models/User';
  import type { ControllerResponse } from '../types/response';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
  export class AuthController {
    /**
     * Creates a new user.
     * @param username - Unique username
     * @param pin - User's PIN (4-6 digits)
     * @param profileName - Optional profile name
     * @param recoveryAnswer - Optional recovery answer
     */
    async createUser(
      username: string,
      pin: string,
      profileName?: string,
      recoveryAnswer?: string
    ): Promise<ControllerResponse<User>> {
      try {
        if (pin.length < 4 || pin.length > 6) {
          return { success: false, error: 'PIN must be 4-6 digits' };
        }
        const user = await createUser(username, pin, profileName, recoveryAnswer);
        return { success: true, data: user, message: 'User created successfully' };
      } catch (error) {
        return { success: false, error: `Failed to create user: ${error}` };
      }
    }
  
    /**
     * Gets a user by ID.
     * @param id - User ID
     */
    async getUserById(id: number): Promise<ControllerResponse<User>> {
      try {
        const user = await getUserById(id);
        if (!user) return { success: false, error: 'User not found' };
        return { success: true, data: user };
      } catch (error) {
        return { success: false, error: `Failed to get user: ${error}` };
      }
    }

    async getCurrentUser(): Promise<ControllerResponse<User>> {
      try {
        const user = await AsyncStorage.getItem('currentUser');
        if (!user) return { success: false, error: 'User not found' };
        return JSON.parse(user)
      } catch (error) {
        return { success: false, error: `Failed to get user: ${error}` };
      }
    }
  
    /**
     * Updates a user's profile or settings.
     * @param id - User ID
     * @param updates - Partial user data
     */
    async updateUser(id: number, updates: Partial<NewUser>): Promise<ControllerResponse<User>> {
      try {
        const user = await updateUser(id, updates);
        return { success: true, data: user, message: 'User updated successfully' };
      } catch (error) {
        return { success: false, error: `Failed to update user: ${error}` };
      }
    }
  
    /**
     * Deletes a user (soft delete).
     * @param id - User ID
     */
    async deleteUser(id: number): Promise<ControllerResponse<User>> {
      try {
        const user = await deleteUser(id);
        return { success: true, data: user, message: 'User deactivated successfully' };
      } catch (error) {
        return { success: false, error: `Failed to delete user: ${error}` };
      }
    }
  
    /**
     * Logs in a user.
     * @param username - Username
     * @param pin - User's PIN
     */
    async login(username: string, pin: string): Promise<ControllerResponse<User>> {
      try {
        const user = await loginUser(username, pin);
        if (!user) return { success: false, error: 'Invalid credentials or inactive user' };
        return { success: true, data: user, message: 'Login successful' };
      } catch (error) {
        return { success: false, error: `Login failed: ${error}` };
      }
    }
  
    /**
     * Resets a user's PIN.
     * @param username - Username
     * @param recoveryAnswer - Recovery answer
     * @param newPin - New PIN
     */
    async resetPin(
      username: string,
      recoveryAnswer: string,
      newPin: string
    ): Promise<ControllerResponse<User>> {
      try {
        if (newPin.length < 4 || newPin.length > 6) {
          return { success: false, error: 'New PIN must be 4-6 digits' };
        }
        const user = await resetPin(username, recoveryAnswer, newPin);
        if (!user) return { success: false, error: 'Invalid recovery answer' };
        return { success: true, data: user, message: 'PIN reset successfully' };
      } catch (error) {
        return { success: false, error: `PIN reset failed: ${error}` };
      }
    }
  }