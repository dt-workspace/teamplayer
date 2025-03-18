// src/components/personal-task/PersonalTaskList.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { PersonalTask, TaskListProps, FilterOptions, SortOption } from './components/types';
import SearchSection from './components/SearchSection';
import FilterSection from './components/FilterSection';
import TaskItem from './components/TaskItem';

export const PersonalTaskList: React.FC<TaskListProps> = ({
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

  // Memoized callbacks
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handleFilterChange = useCallback((newOptions: FilterOptions) => {
    setFilterOptions(newOptions);
  }, []);

  const handleSortChange = useCallback((field: SortOption) => {
    if (sortBy === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortBy(field);
      setSortAscending(true);
    }
  }, [sortBy, sortAscending]);

  const handleSortDirectionChange = useCallback(() => {
    setSortAscending(!sortAscending);
  }, [sortAscending]);

  const handleResetFilters = useCallback(() => {
    setFilterOptions({
      status: 'All',
      priority: 'All',
      category: 'All',
    });
  }, []);

  // Render task item
  const renderTaskItem = useCallback(({ item }: { item: PersonalTask }) => (
    <TaskItem
      task={item}
      onPress={onTaskPress}
      onDelete={onDeleteTask}
    />
  ), [onTaskPress, onDeleteTask]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddTask}>
          <Icon name="plus" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
      />

      <FilterSection
        show={showFilters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        sortAscending={sortAscending}
        onSortChange={handleSortChange}
        onSortDirectionChange={handleSortDirectionChange}
        onReset={handleResetFilters}
      />

      <FlatList
        data={sortedTasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id.toString()}
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:15,
    paddingVertical: 5
  },
  title: {
    fontSize: 24,
    color: colors.text
  },
  addButton: {
    padding: 10,
    backgroundColor: colors.card,
    borderRadius: 20
  },
  taskList: {
    flex: 1
  },
  taskListContent: {
    paddingHorizontal: 15,
    paddingBottom: 10
  }
});

