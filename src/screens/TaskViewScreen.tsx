import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { borderRadius, colors, spacing, typography } from '@constants/theme';
import { PersonalTask } from '@models/PersonalTask';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PersonalTaskModal } from '../components/personal-task/PersonalTaskModal';
import { taskController } from '../controllers';
import LinearGradient from 'react-native-linear-gradient';
import { TaskHeader } from '../components/task-view/TaskHeader';
import { TaskInfo } from '@components/task-view/TaskInfo';
import { TaskTimeRemaining } from '@components/task-view/TaskTimeRemaining';
import { TaskStatus } from '@components/task-view/TaskStatus';
import { TaskSubtasks } from '@components/task-view/TaskSubtasks';
import { TaskNotes } from '@components/task-view/TaskNotes';
import { calculateProgress, getTaskTypeIcon, getPriorityColor, getStatusColor } from '@utils/taskHelpers';

type TaskViewScreenProps = {
  route: {
    params: {
      taskId: number;
    };
  };
  navigation: any;
};

export const TaskViewScreen: React.FC<TaskViewScreenProps> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<PersonalTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const progressAnim = new Animated.Value(0);
  const modalRef = useRef(null);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const response = await taskController.getPersonalTaskById(taskId);
      console.log('Fetched task:', response);
      
      if (response.success && response.data) {
        const fetchedTask = response.data;
        // Parse subtasks if they exist as a string
        if (typeof fetchedTask.subtasks === 'string') {
          fetchedTask.subtasks = JSON.parse(fetchedTask.subtasks);
          fetchedTask.progress = calculateProgress(fetchedTask.subtasks);
        }
        setTask(fetchedTask);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch task');
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Animate progress bar on load or when progress changes
    if (task && task.progress) {
      Animated.timing(progressAnim, {
        toValue: task.progress / 100,
        duration: 800,
        useNativeDriver: false
      }).start();
    }
  }, [task?.progress]);

  // Handle subtask toggling
  const toggleSubtaskCompletion = async (index: number) => {
    if (!task || !task.subtasks) return;
    // Create a new array with the toggled subtask
    const updatedSubtasks = task.subtasks.map((subtask, i) =>
      i === index ? { ...subtask, completed: !subtask.completed } : subtask
    );

    // Calculate new progress
    const newProgress = calculateProgress(updatedSubtasks);

    // Update UI immediately (optimistic update)
    setTask({ ...task, subtasks: updatedSubtasks, progress: newProgress });

    try {
      // Prepare data for API - stringify subtasks for backend
      const taskForUpdate = {
        ...task,
        subtasks: JSON.stringify(updatedSubtasks),
        progress: newProgress
      };

      // Send update to backend
      const response = await taskController.updatePersonalTask(task.id, taskForUpdate);

      if (!response.success) {
        // Revert changes if update failed
        console.error('Failed to update subtask:', response.error);
        Alert.alert('Error', response.error || 'Failed to update subtask');
        setTask(task); // Revert to original state
      }
    } catch (error) {
      console.error('Error updating subtask:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      setTask(task); // Revert to original state
    }
  };

  const handleEdit = () => {
    console.log('Edit button pressed, opening modal');
    if (modalRef.current && modalRef.current.open) {
      setShowEditModal(true);
      modalRef.current.open();
    }
  };

  const handleSaveTask = async (updatedTask: PersonalTask) => {
    try {
      console.log('Saving updated task:', updatedTask);
      handleCloseModal();
      const response = await taskController.updatePersonalTask(task.id, updatedTask);
      if (response.success) {
        console.log('Task updated successfully');
        fetchTask();
      } else {
        Alert.alert('Error', response.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setShowEditModal(false);
    modalRef.current?.close();
  };

  const handleDelete = () => {
    if (!task) return;
    
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await taskController.deletePersonalTask(task.id);
              if (response.success) {
                navigation.goBack();
              } else {
                Alert.alert('Error', response.error || 'Failed to delete task');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading task...</Text>
      </SafeAreaView>
    );
  }

  if (error || !task) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Icon name="alert-circle-outline" size={50} color={colors.error} />
        <Text style={styles.errorText}>{error || 'Failed to load task'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchTask}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButtonError}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonErrorText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, '#4A2FBD', '#361CA3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TaskHeader 
          navigation={navigation} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete}
        />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TaskInfo 
          task={task}
          getPriorityColor={getPriorityColor}
          getTaskTypeIcon={getTaskTypeIcon}
        />
        
        
        
        <TaskStatus 
          task={task} 
          hasSubtasks={hasSubtasks} 
          progressAnim={progressAnim} 
          getStatusColor={getStatusColor}
        />

        {hasSubtasks && (
          <TaskSubtasks 
            subtasks={task.subtasks} 
            toggleSubtaskCompletion={toggleSubtaskCompletion} 
          />
        )}

        <TaskNotes notes={task.notes} />
      </ScrollView>

      <PersonalTaskModal
        ref={modalRef}
        isVisible={showEditModal}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        initialTask={task}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight || '#f8f9fa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSizes.md,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.md,
  },
  backButtonError: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  backButtonErrorText: {
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.md,
  },
});
