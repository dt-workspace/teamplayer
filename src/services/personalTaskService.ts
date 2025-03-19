// ...existing imports and code...

/**
 * Validates that the points value matches the task type
 */
export function validateTaskPoints(taskType: string, points: number): boolean {
  if (taskType === 'Small' && points !== 1) return false;
  if (taskType === 'Medium' && points !== 3) return false;
  if (taskType === 'Large' && points !== 5) return false;
  return true;
}

/**
 * Creates a new personal task
 */
export async function createPersonalTask(taskData: NewPersonalTask): Promise<PersonalTask> {
  // Validate points match task type
  if (!validateTaskPoints(taskData.taskType, taskData.points)) {
    // Auto-correct the points based on task type
    if (taskData.taskType === 'Small') taskData.points = 1;
    if (taskData.taskType === 'Medium') taskData.points = 3;
    if (taskData.taskType === 'Large') taskData.points = 5;
  }
  
  // Now proceed with creating the task
  // ...existing code to create the task...
}

/**
 * Updates an existing personal task
 */
export async function updatePersonalTask(id: number, taskData: Partial<NewPersonalTask>): Promise<PersonalTask> {
  // If task type is updated, ensure points are updated accordingly
  if (taskData.taskType) {
    if (taskData.taskType === 'Small') taskData.points = 1;
    if (taskData.taskType === 'Medium') taskData.points = 3;
    if (taskData.taskType === 'Large') taskData.points = 5;
  }
  
  // ...existing code to update the task...
}

// ...rest of the service file...
