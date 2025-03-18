// src/components/personal-task/components/utils.ts
import { colors } from '@constants/theme';
import { TaskPriority, TaskStatus, TaskCategory } from './types';
import dayjs from 'dayjs';

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'High': return colors.error;
    case 'Medium': return colors.warning;
    case 'Low': return colors.success;
    default: return colors.textSecondary;
  }
};

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'Completed': return colors.success;
    case 'In Progress': return colors.primary;
    case 'On Hold': return colors.warning;
    case 'To Do': return colors.secondary;
    default: return colors.textSecondary;
  }
};

export const getCategoryIcon = (category: TaskCategory): string => {
  switch (category) {
    case 'Admin': return 'file-document-outline';
    case 'Meetings': return 'account-group-outline';
    case 'Development': return 'code-braces';
    case 'Design': return 'palette-outline';
    case 'Research': return 'magnify';
    default: return 'dots-horizontal';
  }
};

export const formatDate = (date: Date) => {
  if (!date) return date;
  return dayjs(date).format('MMM DD, YYYY');
};


export const formatTime = (date: Date) => {
  if (!date) return date;
  return  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};