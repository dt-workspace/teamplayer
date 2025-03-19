// src/screens/TasksScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Text, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, elevation } from '@constants/theme';
import { getDB, localDB } from '@database/db';
import { personalTasks } from '@models/PersonalTask';
import { eq } from 'drizzle-orm';
import RBSheet from 'react-native-raw-bottom-sheet'; // Add this import

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
  const taskModalRef = useRef<RBSheet>(null);

  // State for tasks, loading, and modal
  const [tasks, setTasks] = useState<PersonalTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PersonalTask | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Add this state to track modal visibility

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

  // Function to fetch tasks - parse JSON data
  const fetachTasks = async () => {
    try {
      const user = await authController.getCurrentUser();
      if (!user) {
        console.error('User not found');
        return;
      }

      // setIsLoading(true);
      const db = await getDB();
      const row = await db.execute('SELECT * FROM PersonalTasks WHERE user_id = ?', [user.id]);
      
      // Process tasks to parse JSON strings
      const processedTasks = row.rows.map(task => ({
        ...task,
        // Keep subtasks as a ̉string in the main state to match database schema
      }));
      
      setTasks(processedTasks);
      // setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setIsLoading(false);
    }
  };

  // Handle adding a new task
  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalVisible(true);
    if (taskModalRef.current) {
      taskModalRef.current.open();
    }
  };

  // Handle task press - prepare data for editing in modal
  const handleTaskPress = (task: PersonalTask) => {
    
    navigation.navigate('TaskViewScreen', { taskId: task.id });
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalVisible(false);
    if (taskModalRef.current) {
      taskModalRef.current.close();
    }
  };

  // Handle saving a task (new or edited)
  const handleSaveTask = async (task: PersonalTask) => {
    try {
      const user = await authController.getCurrentUser();
      if (!user) {
        console.error('User not found');
        return;
      }

      if (selectedTask) {
        await updateTask(task);
      } else {
        await createTask(user.id, task);
      }

      setIsModalVisible(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const updateTask = async (task: PersonalTask) => {
    try {
      const response = await taskController.updatePersonalTask(selectedTask!.id, task);
      if (response.success) {
        const updatedTasks = tasks.map(t =>
          t.id === selectedTask!.id ? { ...response.data } : t
        );
        setTasks(updatedTasks);
      } else {
        console.error('Failed to update task:', response.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const createTask = async (userId: number, task: PersonalTask) => {
    try {
      const response = await taskController.createPersonalTask(userId, task);
      if (response.success && response.data) {
        fetachTasks();
      } else {
        console.error('Failed to create task:', response.error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
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
          }
        }
      ]
    );
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
            ref={taskModalRef}
            onClose={handleCloseModal}
            onSave={handleSaveTask}
            initialTask={selectedTask}
            isVisible={isModalVisible}
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