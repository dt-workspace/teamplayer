import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TaskListProps, PersonalTask } from './components/types';
import SearchSection from './components/SearchSection';
import FilterSection from './components/FilterSection';
import { TaskItem } from './components/TaskItem';
import { styles } from './components/styles';
import { useTaskManager } from './hooks/useTaskManager';
import { colors } from '@constants/theme';

// Header Section Component
const HeaderSection = ({ taskCount, onAddTask, onImportTasks, isImporting }) => (
  <View style={styles.modernHeader}>
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149011361.jpg' }}
      style={styles.headerBackground}
      imageStyle={styles.headerBackgroundImage}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.modernTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>
            You have <Text style={styles.highlightText}>{taskCount}</Text> tasks to complete
          </Text>
        </View>

        <View style={styles.headerIllustration}>
          <Image 
            source={{ uri: 'https://img.freepik.com/free-vector/task-concept-illustration_114360-1715.jpg' }}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.headerButtonsContainer}>
        <TouchableOpacity 
          style={styles.modernImportButton} 
          onPress={onImportTasks}
          disabled={isImporting}
        >
          <Icon name="database-import" size={18} color={colors.card} />
          <Text style={styles.buttonText}>Import</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modernAddButton} onPress={onAddTask}>
          <Icon name="plus" size={18} color={colors.card} />
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </View>
);

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
      <HeaderSection 
        taskCount={sortedTasks.length}
        onAddTask={onAddTask}
        onImportTasks={handleImportTasks}
        isImporting={isImporting}
      />

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

