// src/components/project-run-rate/TaskList.tsx
import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { colors, spacing, elevation, typography, borderRadius } from '@constants/theme';
import { Task, TaskStatus } from './types';
import { SearchBar } from './SearchBar';
import { TaskItem } from './TaskItem';
import { TaskFilters } from './TaskFilters';
import { EmptyTasksView } from './EmptyTasksView';
import { PersonalTask } from '@models/PersonalTask';

type TaskListProps = {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus) => void;
  onEditTask?: (task: PersonalTask) => void;
  onDeleteTask?: (taskId: number) => void;
};

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onUpdateTaskStatus,
  onEditTask,
  onDeleteTask
}) => {
  // State to track which tasks are expanded
  const [expandedTaskIds, setExpandedTaskIds] = useState<number[]>([]);
  // State for filtering tasks
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle task expansion
  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTaskIds(prevIds => 
      prevIds.includes(taskId)
        ? prevIds.filter(id => id !== taskId)
        : [...prevIds, taskId]
    );
  };

  // Get status color
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return colors.success;
      case 'In Progress': return colors.primary;
      case 'To Do': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  // Get task type icon
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'Small': return 'checkbox-blank-circle-outline';
      case 'Medium': return 'checkbox-intermediate';
      case 'Large': return 'checkbox-marked-circle-outline';
      default: return 'checkbox-blank-circle-outline';
    }
  };

  // Filter tasks by status and search query
  const filteredTasks = tasks
    .filter(task => {
      // First filter by status
      if (filterStatus !== 'All' && task.status !== filterStatus) {
        return false;
      }
      
      // Then filter by search query if it exists
      if (searchQuery.trim() !== '') {
        // Search by task type (could extend to search other properties)
        return task.type.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      return true;
    });

  // Handle search query changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Handle edit task
  const handleEditTask = (task: PersonalTask) => {
    if (onEditTask) {
      onEditTask(task);
    }
  };

  // Handle delete task
  const handleDeleteTask = (taskId: number) => {
    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
  };

  // Render a single task item using the extracted TaskItem component
  const renderTaskItem = ({ item }: { item: Task }) => {
    const isExpanded = expandedTaskIds.includes(item.id);
    const statusColor = getStatusColor(item.status);
    
    return (
      <TaskItem
        task={item as unknown as PersonalTask}
        isExpanded={isExpanded}
        statusColor={statusColor}
        onToggleExpansion={toggleTaskExpansion}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />
    );
  };

  return (
    <View style={styles.tasksContainer}>
      <TaskFilters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        taskCount={filteredTasks.length}
      />
      
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />
      
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id.toString()}
          style={styles.taskList}
          contentContainerStyle={styles.taskListContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyTasksView
          searchQuery={searchQuery}
          filterStatus={filterStatus}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tasksContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...elevation.medium,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tasksTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: 'semibold',
    color: colors.text,
  },
  taskCountContainer: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCount: {
    color: colors.card,
    fontSize: typography.fontSizes.xs,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  filterButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.card,
    fontWeight: 'medium',
  },
  taskList: {
    maxHeight: 400,
  },
  taskListContent: {
    paddingBottom: spacing.sm,
  },
  taskCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...elevation.small,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
  },
  taskHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTypeIconContainer: {
    marginRight: spacing.sm,
  },
  taskHeaderInfo: {
    flex: 1,
  },
  taskHeaderRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  taskType: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginRight: spacing.sm,
  },
  pointsBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  pointsBadgeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.card,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
  },
  taskStatus: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  taskDetails: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  notesContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  notesText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginLeft: spacing.xs,
  },
  actionButtonText: {
    fontSize: typography.fontSizes.sm,
    marginLeft: spacing.xs,
  },
  emptyTasksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTasksText: {
    fontSize: typography.fontSizes.md,
    fontWeight: 'medium',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyTasksSubtext: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});