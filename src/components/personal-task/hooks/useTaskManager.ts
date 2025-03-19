import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { FilterOptions, PersonalTask, SortOption } from '../components/types';
import { TaskController } from '@controllers/TaskController';
import { authController } from '@controllers/index';
import taskData from '@utils/taskdata.json';

export const useTaskManager = (tasks: PersonalTask[]) => {
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
  const [isImporting, setIsImporting] = useState(false);
  
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

  // Function to import tasks from JSON data
  const handleImportTasks = async () => {
    try {
      const user = await authController.getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'User not found. Please login again.');
        return;
      }

      setIsImporting(true);
      const taskController = new TaskController();
      
      // Confirm before importing
      Alert.alert(
        'Import Tasks',
        `This will import ${taskData.length} sample tasks. Continue?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsImporting(false),
          },
          {
            text: 'Import',
            onPress: async () => {
              let importedCount = 0;
              let duplicateCount = 0;
              
              // Check for existing tasks to avoid duplicates (by name)
              const existingTaskNames = tasks.map(task => task.name.toLowerCase());
              
              // Process each task in the JSON data
              for (const jsonTask of taskData) {
                // Skip if task with same name exists
                if (existingTaskNames.includes(jsonTask.name.toLowerCase())) {
                  duplicateCount++;
                  continue;
                }
                
                // Map JSON task to PersonalTask structure
                const newTask = {
                  name: jsonTask.name,
                  dueDate: jsonTask.dueDate,
                  priority: jsonTask.priority,
                  category: jsonTask.category,
                  status: jsonTask.status,
                  taskType: jsonTask.taskType,
                  points: jsonTask.points,
                  notes: jsonTask.notes,
                  subtasks: JSON.stringify(jsonTask.subtasks),
                  progress: jsonTask.progress,
                };
                
                // Create task in database
                const result = await taskController.createPersonalTask(user.id, newTask);
                if (result.success) {
                  importedCount++;
                }
              }
              
              setIsImporting(false);
              Alert.alert(
                'Import Complete',
                `Successfully imported ${importedCount} tasks.\n${duplicateCount} duplicates were skipped.`
              );
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error importing tasks:', error);
      Alert.alert('Error', 'Failed to import tasks. Please try again.');
      setIsImporting(false);
    }
  };

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

  return {
    // State
    searchQuery,
    showFilters,
    filterOptions,
    sortBy,
    sortAscending,
    isImporting,
    sortedTasks,
    
    // Actions
    handleSearchChange,
    handleToggleFilters,
    handleFilterChange,
    handleSortChange,
    handleSortDirectionChange,
    handleResetFilters,
    handleImportTasks,
  };
};
