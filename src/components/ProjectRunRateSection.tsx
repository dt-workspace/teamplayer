// src/components/ProjectRunRateSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography } from '@constants/theme';

// Import sub-components
import { MetricsDisplay } from './project-run-rate/MetricsDisplay';
import { StatusIndicator } from './project-run-rate/StatusIndicator';
import { ProgressBar } from './project-run-rate/ProgressBar';
import { TaskList } from './project-run-rate/TaskList';
import { RBSheetTaskForm, RBSheetTaskFormRef } from './personal-task/RBSheetTaskForm';

// Import types
import { 
  Task, 
  TaskType, 
  TaskStatus, 
  ProjectStatus,
  ProjectRunRateProps,
  MetricsData 
} from './project-run-rate/types';

export const ProjectRunRateSection: React.FC<ProjectRunRateProps> = ({
  projectId,
  startDate,
  deadline,
  developerCount,
  tasks,
  onTaskAdded,
  onTaskUpdated,
}) => {
  // Reference for task form bottom sheet
  const taskFormRef = useRef<RBSheetTaskFormRef>(null);
  const [newTask, setNewTask] = useState<{
    type: TaskType;
    status: TaskStatus;
  }>({
    type: 'Small',
    status: 'To Do',
  });

  // State for metrics
  const [metrics, setMetrics] = useState<MetricsData>({
    prr: 0,
    rprr: 0,
    status: 'On Track',
    completedPoints: 0,
    remainingPoints: 0,
    totalPoints: 0
  });
  
  // Calculate metrics whenever tasks or developer count changes
  useEffect(() => {
    calculateMetrics();
  }, [tasks, developerCount]);

  const calculateMetrics = () => {
    // Calculate total and completed points
    let completed = 0;
    let remaining = 0;
    let total = 0;
    
    tasks.forEach(task => {
      total += task.points;
      
      if (task.status === 'Completed') {
        completed += task.points;
      } else {
        remaining += task.points;
      }
    });
    
    // Calculate days spent and days remaining
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(deadline);
    
    const daysSpent = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(1, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate PRR and RPRR
    const calculatedPrr = developerCount > 0 ? (completed / (developerCount * daysSpent)) : 0;
    const calculatedRprr = developerCount > 0 ? (remaining / (developerCount * daysRemaining)) : 0;
    
    // Determine project status
    let projectStatus: ProjectStatus = 'On Track';
    if (calculatedPrr > calculatedRprr) {
      projectStatus = 'Ahead';
    } else if (calculatedPrr < calculatedRprr) {
      projectStatus = 'Behind';
    }
    
    // Update metrics state
    setMetrics({
      prr: calculatedPrr,
      rprr: calculatedRprr,
      status: projectStatus,
      completedPoints: completed,
      remainingPoints: remaining,
      totalPoints: total
    });
  };

  const getPointsForTaskType = (type: TaskType): number => {
    switch (type) {
      case 'Small': return 1;
      case 'Medium': return 3;
      case 'Large': return 5;
      default: return 1;
    }
  };



  const handleUpdateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    const updates: Partial<Task> = { status: newStatus };
    
    if (newStatus === 'Completed') {
      updates.completionDate = new Date().toISOString();
    } else {
      updates.completionDate = undefined;
    }
    
    onTaskUpdated(taskId, updates);
  };

 

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Project Run Rate</Text>
        <TouchableOpacity 
          style={styles.addTaskButton}
          onPress={() => taskFormRef.current?.open()}
        >
          <Icon name="plus-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.addTaskButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      
      {/* Metrics Display */}
      <MetricsDisplay metrics={metrics} />
      
      {/* Status Indicator */}
      <StatusIndicator status={metrics.status} />
      
      {/* Progress Bar */}
      <ProgressBar 
        completedPoints={metrics.completedPoints} 
        totalPoints={metrics.totalPoints} 
      />
      
      {/* Task List */}
      <TaskList 
        tasks={tasks} 
        onUpdateTaskStatus={handleUpdateTaskStatus} 
      />
      
      {/* Task Form Bottom Sheet */}
      <RBSheetTaskForm
        ref={taskFormRef}
        projectId={projectId}
        userId={3} // TODO: Get from auth context
        onClose={() => taskFormRef.current?.close()}
        onSubmit={() => {
          // Refresh tasks after successful creation
          const task = {
            type: newTask.type,
            status: newTask.status,
            points: getPointsForTaskType(newTask.type),
            completionDate: newTask.status === 'Completed' ? new Date().toISOString() : undefined,
          };
          onTaskAdded(task);
          taskFormRef.current?.close();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  addTaskButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
});