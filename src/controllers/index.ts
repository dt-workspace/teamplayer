// src/controllers/index.ts
import { AuthController } from './AuthController';
import { TeamController } from './TeamController';
import { ProjectController } from './ProjectController';
import { AvailabilityController } from './AvailabilityController';
import { TaskController } from './TaskController';
import { MilestoneController } from './MilestoneController';

export const authController = new AuthController();
export const teamController = new TeamController();
export const projectController = new ProjectController();
export const availabilityController = new AvailabilityController();
export const taskController = new TaskController();
export { MilestoneController };