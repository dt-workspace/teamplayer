// src/screens/TasksScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, elevation } from '@constants/theme';
import { getDB, localDB } from '@database/db';
import { personalTasks } from '@models/PersonalTask';
import { eq } from 'drizzle-orm';

// Import task components
import { PersonalTaskList } from '../components/personal-task/PersonalTaskList';
import { PersonalTaskModal } from '../components/personal-task/PersonalTaskModal';

// Import controllers
import { TaskController } from '../controllers/TaskController';
import { ProjectController } from '../controllers/ProjectController';
import { PersonalTask } from '../components/personal-task/types';
import { authController } from '@controllers/index';

export const TasksScreen: React.FC = () => {
  const navigation = useNavigation();
  const taskController = new TaskController();

  // State for tasks, loading, and modal
  const [tasks, setTasks] = useState<PersonalTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PersonalTask | null>(null);

  // Set up reactive query for tasks
  useEffect(() => {
    let unsubscribe = navigation.addListener('focus', fetachTasks);

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    };
  },[]);

  const fetachTasks = async () => {
    try {
      const user = await authController.getCurrentUser();
      if (!user) {
        console.error('User not found');
        return;
      }

      // setIsLoading(true);
      const db = await getDB();
      const row = await db.execute('SELECT * FROM PersonalTasks WHERE user_id = ?', [user.id])
      // console.log(row.rows)
      setTasks(row.rows);
      // Set up reactive query
    } catch (error) {
      console.error('Error setting up reactive query:', error);
      setIsLoading(false);
    }
  };

  // Handle adding a new task
  const handleAddTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  // Handle editing an existing task
  const handleTaskPress = (task: PersonalTask) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  // Handle saving a task (new or edited)
  const handleSaveTask = async (task: PersonalTask) => {

    try {
      const user = await authController.getCurrentUser();
      if (!user) {
        console.error('User not found');
      } else {
        if (selectedTask) {
          // Update existing task
          const response = await taskController.updatePersonalTask(selectedTask.id, task);
          if (response.success) {
            const updatedTasks = tasks.map(t =>
              t.id === selectedTask.id ? { ...task, id: selectedTask.id } : t
            );
            setTasks(updatedTasks);
          } else {
            console.error('Failed to update task:', response.error);
          }
        } else {

          const response = await taskController.createPersonalTask(user?.id, task); // 1 is the user ID
          if (response.success && response.data) {
            fetachTasks();
          } else {
            console.error('Failed to create task:', response.error);
          }
        }
        setShowTaskModal(false);

      }

    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await taskController.deletePersonalTask(taskId);
      if (response.success) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
      } else {
        console.error('Failed to delete task:', response.error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {/* Task list view */}
          <PersonalTaskList
            tasks={tasks}
            onTaskPress={handleTaskPress}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />

          {/* Task modal for adding/editing tasks */}
          <PersonalTaskModal
            visible={showTaskModal}
            onClose={() => setShowTaskModal(false)}
            onSave={handleSaveTask}
            initialTask={selectedTask}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});