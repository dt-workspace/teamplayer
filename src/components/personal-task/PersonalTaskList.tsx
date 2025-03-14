// src/components/personal-task/PersonalTaskList.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';

// Import types from PersonalTaskModal
type TaskPriority = 'High' | 'Medium' | 'Low';
type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'On Hold';
type TaskCategory = 'Admin' | 'Meetings' | 'Development' | 'Design' | 'Research' | 'Other';

type Subtask = {
  id: string;
  name: string;
  completed: boolean;
};

type Reminder = {
  id: string;
  time: Date;
  notificationSound?: string;
};

type PersonalTask = {
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

type PersonalTaskListProps = {
  tasks: PersonalTask[];
  onTaskPress: (task: PersonalTask) => void;
  onAddTask: () => void;
  onDeleteTask: (taskId: number) => void;
};

type FilterOptions = {
  status: TaskStatus | 'All';
  priority: TaskPriority | 'All';
  category: TaskCategory | 'All';
};

type SortOption = 'dueDate' | 'priority' | 'status' | 'name';

export const PersonalTaskList: React.FC<PersonalTaskListProps> = ({
  tasks,
  onTaskPress,
  onAddTask,
  onDeleteTask,
}) => {
  // State for search, filter, and sort
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'All',
    priority: 'All',
    category: 'All',
  });
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortAscending, setSortAscending] = useState(true);

  // Filter tasks based on search query and filter options
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filterOptions.status === 'All' || task.status === filterOptions.status;
    
    // Priority filter
    const matchesPriority = filterOptions.priority === 'All' || task.priority === filterOptions.priority;
    
    // Category filter
    const matchesCategory = filterOptions.category === 'All' || task.category === filterOptions.category;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'status':
        const statusOrder = { 'To Do': 0, 'In Progress': 1, 'On Hold': 2, 'Completed': 3 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }
    
    return sortAscending ? comparison : -comparison;
  });

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortAscending(!sortAscending);
  };

  // Change sort field
  const changeSortField = (field: SortOption) => {
    if (sortBy === field) {
      toggleSortDirection();
    } else {
      setSortBy(field);
      setSortAscending(true);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      status: 'All',
      priority: 'All',
      category: 'All',
    });
  };

  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return colors.error;
      case 'Medium': return colors.warning;
      case 'Low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  // Get status color
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return colors.success;
      case 'In Progress': return colors.primary;
      case 'On Hold': return colors.warning;
      case 'To Do': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'Admin': return 'file-document-outline';
      case 'Meetings': return 'account-group-outline';
      case 'Development': return 'code-braces';
      case 'Design': return 'palette-outline';
      case 'Research': return 'magnify';
      default: return 'dots-horizontal';
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  // Render task item
  const renderTaskItem = ({ item }: { item: PersonalTask }) => {
    const completedSubtasks = item.subtasks.filter(subtask => subtask.completed).length;
    const totalSubtasks = item.subtasks.length;
    const subtaskText = totalSubtasks > 0 ? `${completedSubtasks}/${totalSubtasks} subtasks` : 'No subtasks';
    
    return (
      <TouchableOpacity 
        style={styles.taskItem}
        onPress={() => onTaskPress(item)}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <Text style={styles.taskTitle} numberOfLines={1}>{item.name}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
              <Text style={styles.priorityText}>{item.priority}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => onDeleteTask(item.id)}
          >
            <Icon name="delete-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.taskDetails}>
          <View style={styles.taskDetailRow}>
            <Icon name="calendar" size={16} color={colors.textSecondary} />
            <Text style={styles.taskDetailText}>{formatDate(item.dueDate)}</Text>
          </View>
          
          <View style={styles.taskDetailRow}>
            <Icon name={getCategoryIcon(item.category)} size={16} color={colors.textSecondary} />
            <Text style={styles.taskDetailText}>{item.category}</Text>
          </View>
          
          <View style={styles.taskDetailRow}>
            <Icon name="format-list-checks" size={16} color={colors.textSecondary} />
            <Text style={styles.taskDetailText}>{subtaskText}</Text>
          </View>
        </View>
        
        <View style={styles.taskFooter}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Personal Tasks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={onAddTask}
        >
          <Icon name="plus" size={20} color={colors.card} />
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon 
            name={showFilters ? "filter-remove" : "filter"} 
            size={20} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollableFilterOptions 
              options={['All', 'To Do', 'In Progress', 'On Hold', 'Completed']}
              selectedOption={filterOptions.status}
              onSelect={(option) => setFilterOptions({...filterOptions, status: option as TaskStatus | 'All'})}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Priority:</Text>
            <ScrollableFilterOptions 
              options={['All', 'High', 'Medium', 'Low']}
              selectedOption={filterOptions.priority}
              onSelect={(option) => setFilterOptions({...filterOptions, priority: option as TaskPriority | 'All'})}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category:</Text>
            <ScrollableFilterOptions 
              options={['All', 'Admin', 'Meetings', 'Development', 'Design', 'Research', 'Other']}
              selectedOption={filterOptions.category}
              onSelect={(option) => setFilterOptions({...filterOptions, category: option as TaskCategory | 'All'})}
            />
          </View>
          
          <View style={styles.sortSection}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <View style={styles.sortOptions}>
              <TouchableOpacity 
                style={[styles.sortOption, sortBy === 'dueDate' && styles.sortOptionSelected]}
                onPress={() => changeSortField('dueDate')}
              >
                <Text style={[styles.sortOptionText, sortBy === 'dueDate' && styles.sortOptionTextSelected]}>Due Date</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sortOption, sortBy === 'priority' && styles.sortOptionSelected]}
                onPress={() => changeSortField('priority')}
              >
                <Text style={[styles.sortOptionText, sortBy === 'priority' && styles.sortOptionTextSelected]}>Priority</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sortOption, sortBy === 'status' && styles.sortOptionSelected]}
                onPress={() => changeSortField('status')}
              >
                <Text style={[styles.sortOptionText, sortBy === 'status' && styles.sortOptionTextSelected]}>Status</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sortOption, sortBy === 'name' && styles.sortOptionSelected]}
                onPress={() => changeSortField('name')}
              >
                <Text style={[styles.sortOptionText, sortBy === 'name' && styles.sortOptionTextSelected]}>Name</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sortDirectionButton}
                onPress={toggleSortDirection}
              >
                <Icon 
                  name={sortAscending ? "sort-ascending" : "sort-descending"} 
                  size={20} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.resetFiltersButton}
            onPress={resetFilters}
          >
            <Icon name="refresh" size={16} color={colors.primary} />
            <Text style={styles.resetFiltersText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {sortedTasks.length > 0 ? (
        <FlatList
          data={sortedTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="clipboard-text-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No tasks found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery || filterOptions.status !== 'All' || filterOptions.priority !== 'All' || filterOptions.category !== 'All' ?
              'Try changing your search or filters' :
              'Add a task to get started'}
          </Text>
        </View>
      )}
    </View>
  );
};

// Helper component for scrollable filter options
type ScrollableFilterOptionsProps = {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
};

const ScrollableFilterOptions: React.FC<ScrollableFilterOptionsProps> = ({
  options,
  selectedOption,
  onSelect,
}) => {
  return (
    <View style={styles.scrollableFilterContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[
            styles.filterOption,
            selectedOption === option && styles.filterOptionSelected
          ]}
          onPress={() => onSelect(option)}
        >
          <Text 
            style={[
              styles.filterOptionText,
              selectedOption === option && styles.filterOptionTextSelected
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    ...elevation.small,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  addButtonText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
  },
  filtersContainer: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  filterSection: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  scrollableFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  filterOptionTextSelected: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  sortSection: {
    marginBottom: spacing.md,
  },
  sortOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sortOption: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortOptionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  sortOptionTextSelected: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  sortDirectionButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resetFiltersText: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  taskList: {
    padding: spacing.md,
  },
  taskItem: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...elevation.small,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  taskTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  priorityBadge: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    fontSize: typography.fontSizes.xs,
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  taskDetails: {
    marginBottom: spacing.sm,
  },
  taskDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  taskDetailText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSizes.xs,
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    width: 60,
    height: 6,
    backgroundColor: colors.background,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});