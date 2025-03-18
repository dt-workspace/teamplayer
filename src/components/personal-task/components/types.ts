// src/components/personal-task/components/types.ts

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'On Hold';
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

export type PersonalTask = {
  id: number;
  name: string;
  dueDate: Date;
  priority: TaskPriority;
  category: TaskCategory;
  notes: string;
  status: TaskStatus;
  progress: number;
  subtasks: Subtask[];
  reminders: Reminder[];
};

export type FilterOptions = {
  status: TaskStatus | 'All';
  priority: TaskPriority | 'All';
  category: TaskCategory | 'All';
};

export type SortOption = 'dueDate' | 'priority' | 'status' | 'name';

export type TaskListProps = {
  tasks: PersonalTask[];
  onTaskPress: (task: PersonalTask) => void;
  onAddTask: () => void;
  onDeleteTask: (taskId: number) => void;
};

export type TaskItemProps = {
  task: PersonalTask;
  onPress: (task: PersonalTask) => void;
  onDelete: (taskId: number) => void;
};

export type SearchSectionProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
};

export type FilterSectionProps = {
  show: boolean;
  filterOptions: FilterOptions;
  onFilterChange: (newOptions: FilterOptions) => void;
  sortBy: SortOption;
  sortAscending: boolean;
  onSortChange: (field: SortOption) => void;
  onSortDirectionChange: () => void;
  onReset: () => void;
};