import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TaskListProps, PersonalTask } from './components/types';
import SearchSection from './components/SearchSection';
import FilterSection from './components/FilterSection';
import { TaskItem } from './components/TaskItem';
import { styles } from './components/styles';
import { useTaskManager } from './hooks/useTaskManager';
import { colors } from '@constants/theme';

export const PersonalTaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskPress,
  onAddTask,
  onDeleteTask,
}) => {
  const {
    searchQuery,
    showFilters,
    filterOptions,
    sortBy,
    sortAscending,
    isImporting,
    sortedTasks,
    handleSearchChange,
    handleToggleFilters,
    handleFilterChange,
    handleSortChange,
    handleSortDirectionChange,
    handleResetFilters,
    handleImportTasks,
  } = useTaskManager(tasks);

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
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.importButton} 
            onPress={handleImportTasks}
            disabled={isImporting}
          >
            <Icon name="database-import" size={18} color={colors.card} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={onAddTask}>
            <Icon name="plus" size={22} color={colors.card} />
          </TouchableOpacity>
        </View>
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

      {sortedTasks.length > 0 ? (
        <FlatList
          data={sortedTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id.toString()}
          style={styles.taskList}
          contentContainerStyle={styles.taskListContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="check-all" size={50} color={colors.textTertiary} />
          <Text style={styles.emptyStateText}>No tasks found</Text>
        </View>
      )}
    </View>
  );
};

