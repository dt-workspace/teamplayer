// src/components/personal-task/types.ts
import { TaskType, TaskStatus } from '@components/project-run-rate/types';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type PersonalTaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'On Hold';
export type TaskCategory = 'Admin' | 'Meetings' | 'Development' | 'Design' | 'Research' | 'Other';

export type Subtask = {
  id: string;
  name: string;
  completed: boolean;
};

export type Reminder = {
  id: string;
  time: Date;
  notificationSound?: string;
};

export type RunRateValues = {
  type: TaskType;
  status: TaskStatus;
  points: number;
};

export type PersonalTask = {
  id?: number;
  name: string;
  dueDate: Date;
  priority: TaskPriority;
  category: TaskCategory;
  notes: string;
  status: PersonalTaskStatus;
  progress: number;
  subtasks: Subtask[];
  reminders: Reminder[];
  projectId?: number | null;
  milestoneId?: number | null;
  runRateValues?: RunRateValues | null;
  taskType?: 'Small' | 'Medium' | 'Large';
  points?: number;
};

export type PersonalTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (task: PersonalTask) => void;
  initialTask?: Partial<PersonalTask>;
};

export type PersonalTaskListProps = {
  tasks: PersonalTask[];
  onTaskPress: (task: PersonalTask) => void;
  onAddTask: () => void;
  onDeleteTask: (taskId: number) => void;
};

export type FilterOptions = {
  status: string;
  priority: string;
  category: string;
};

export type SortOption = 'dueDate' | 'priority' | 'status' | 'name';