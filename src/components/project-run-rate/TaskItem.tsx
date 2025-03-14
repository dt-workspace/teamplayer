// src/components/project-run-rate/TaskItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius, elevation } from '@constants/theme';
import { Task, TaskStatus } from './types';
import { PersonalTask } from '@models/PersonalTask';

type TaskItemProps = {
  task: PersonalTask;
  isExpanded: boolean;
  statusColor: string;
  onToggleExpansion: (taskId: number) => void;
  onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus) => void;
  onEditTask?: (task: PersonalTask) => void;
  onDeleteTask?: (taskId: number) => void;
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isExpanded,
  statusColor,
  onToggleExpansion,
  onUpdateTaskStatus,
  onEditTask,
  onDeleteTask,
}) => {
  // Get task type icon
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'Small': return 'checkbox-blank-circle-outline';
      case 'Medium': return 'checkbox-intermediate';
      case 'Large': return 'checkbox-marked-circle-outline';
      default: return 'checkbox-blank-circle-outline';
    }
  };

  // Handle edit task
  const handleEditTask = () => {
    if (onEditTask) {
      onEditTask(task);
    }
  };

  // Handle delete task
  const handleDeleteTask = () => {
    if (onDeleteTask) {
      onDeleteTask(task.id);
    }
  };

  return (
    <View style={styles.taskCard}>
      {/* Task Header - Always visible */}
      <TouchableOpacity 
        style={styles.taskHeader} 
        onPress={() => onToggleExpansion(task.id)}
        activeOpacity={0.7}
      >
        <View style={styles.taskHeaderLeft}>
          
          <View style={styles.taskHeaderInfo}>
            <View style={styles.taskTypeContainer}>
              <Text style={styles.taskType}>{task.name}</Text>
              <View style={[styles.pointsBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.pointsBadgeText}>{task.points} pts</Text>
              </View>
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
              <Text style={styles.taskStatus}>{task.status}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.taskHeaderRight}>
          <Icon 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={colors.textSecondary} 
          />
        </View>
      </TouchableOpacity>
      
      {/* Task Details - Only visible when expanded */}
      {isExpanded && (
        <View style={styles.taskDetails}>
          
          
          {/* Due Date */}
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={colors.primary} />
            <Text style={styles.detailText}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          </View>

          {/* Priority */}
          <View style={styles.detailRow}>
            <Icon name="flag" size={16} color={colors.secondary} />
            <Text style={styles.detailText}>
              Priority: {task.priority}
            </Text>
          </View>

          {/* Category */}
          <View style={styles.detailRow}>
            <Icon name="tag" size={16} color={colors.info} />
            <Text style={styles.detailText}>
              Category: {task.category ?? 'Uncategorized'}
            </Text>
          </View>

          {/* Notes */}
          <View style={styles.notesContainer}>
            <View style={styles.detailRow}>
              <Icon name="text" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>Notes:</Text>
            </View>
            <Text style={styles.notesText}>
              {task.notes || 'No notes available for this task.'}
            </Text>
          </View>
          
          {/* Task Actions */}
          <View style={styles.taskActions}>
            {/* Edit Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleEditTask}
            >
              <Icon name="pencil-outline" size={20} color={colors.info} />
              <Text style={[styles.actionButtonText, { color: colors.info }]}>Edit</Text>
            </TouchableOpacity>
            
            {/* Delete Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDeleteTask}
            >
              <Icon name="delete-outline" size={20} color={colors.error} />
              <Text style={[styles.actionButtonText, { color: colors.error }]}>Delete</Text>
            </TouchableOpacity>
            
            {/* Status Change Buttons */}
            {task.status !== 'Completed' ? (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onUpdateTaskStatus(task.id, 'Completed')}
              >
                <Icon name="check-circle-outline" size={20} color={colors.success} />
                <Text style={[styles.actionButtonText, { color: colors.success }]}>Complete</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onUpdateTaskStatus(task.id, 'In Progress')}
              >
                <Icon name="refresh" size={20} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>Reopen</Text>
              </TouchableOpacity>
            )}
            
            {task.status === 'To Do' && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onUpdateTaskStatus(task.id, 'In Progress')}
              >
                <Icon name="play-circle-outline" size={20} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>Start</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    padding: spacing.xs,
  },
  taskTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskType: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    flex: 1,
  },
  pointsBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
    marginLeft: spacing.xs,
  },
  pointsBadgeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.card,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
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
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  notesContainer: {
    marginTop: spacing.xs,
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
    flexWrap: 'wrap',
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
    marginBottom: spacing.xs,
  },
  actionButtonText: {
    fontSize: typography.fontSizes.sm,
    marginLeft: spacing.xs,
  },
});