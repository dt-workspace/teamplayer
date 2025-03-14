// src/components/project-run-rate/types.ts
export type TaskType = 'Small' | 'Medium' | 'Large';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type ProjectStatus = 'On Track' | 'Behind' | 'Ahead';

export type Task = {
  id: number;
  type: TaskType;
  status: TaskStatus;
  completionDate?: string; // ISO date string
  points: number;
  notes?: string; // Task notes from database
};

export type ProjectRunRateProps = {
  projectId: number;
  startDate: string; // ISO date string
  deadline: string; // ISO date string
  developerCount: number;
  tasks: Task[];
  onTaskAdded: (task: Omit<Task, 'id'>) => void;
  onTaskUpdated: (taskId: number, updates: Partial<Task>) => void;
  onTaskDeleted?: (taskId: number) => void;
  onTaskEdited?: (task: Task) => void;
  selectedTask?: Task | null;
  onTaskSelected?: (task: Task | null) => void;
};

export type MetricsData = {
  prr: number;
  rprr: number;
  status: ProjectStatus;
  completedPoints: number;
  remainingPoints: number;
  totalPoints: number;
};