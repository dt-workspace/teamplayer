import { colors } from '@constants/theme';

export const calculateProgress = (subtasks: any[]) => {
  if (!subtasks || subtasks.length === 0) return 0;
  
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completedSubtasks / totalSubtasks) * 100);
};

// Get color based on priority
export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return colors.error;
    case 'medium':
      return colors.warning;
    default:
      return colors.success;
  }
};

// Get color based on status
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return colors.success;
    case 'in progress':
      return colors.primary;
    case 'not started':
      return colors.warning;
    default:
      return colors.textSecondary;
  }
};

// Helper function to get appropriate icon for task type
export const getTaskTypeIcon = (taskType?: string) => {
  switch (taskType?.toLowerCase()) {
    case 'small':
      return 'battery-10';
    case 'medium':
      return 'battery-50';
    case 'large':
      return 'battery-90';
    default:
      return 'battery-unknown';
  }
};
