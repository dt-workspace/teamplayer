// src/components/project-run-rate/TaskModal.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { TaskType, TaskStatus } from './types';

type TaskModalProps = {
  visible: boolean;
  onClose: () => void;
  newTask: {
    type: TaskType;
    status: TaskStatus;
  };
  onTaskTypeChange: (type: TaskType) => void;
  onTaskStatusChange: (status: TaskStatus) => void;
  onAddTask: () => void;
  getPointsForTaskType: (type: TaskType) => number;
};

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  newTask,
  onTaskTypeChange,
  onTaskStatusChange,
  onAddTask,
  getPointsForTaskType,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Task Type</Text>
            <View style={styles.taskTypeSelector}>
              {(['Small', 'Medium', 'Large'] as TaskType[]).map(type => (
                <TouchableOpacity 
                  key={type}
                  style={[styles.taskTypeOption, newTask.type === type && styles.taskTypeOptionSelected]}
                  onPress={() => onTaskTypeChange(type)}
                >
                  <Text style={[styles.taskTypeOptionText, newTask.type === type && styles.taskTypeOptionTextSelected]}>
                    {type} ({getPointsForTaskType(type)} pts)
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Status</Text>
            <View style={styles.statusSelector}>
              {(['To Do', 'In Progress', 'Completed'] as TaskStatus[]).map(status => (
                <TouchableOpacity 
                  key={status}
                  style={[styles.statusOption, newTask.status === status && styles.statusOptionSelected]}
                  onPress={() => onTaskStatusChange(status)}
                >
                  <Text style={[styles.statusOptionText, newTask.status === status && styles.statusOptionTextSelected]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAddTask}
          >
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  taskTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTypeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
  },
  taskTypeOptionSelected: {
    backgroundColor: colors.primary,
  },
  taskTypeOptionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  taskTypeOptionTextSelected: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  statusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
  },
  statusOptionSelected: {
    backgroundColor: colors.primary,
  },
  statusOptionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  statusOptionTextSelected: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  addButtonText: {
    color: colors.card,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});