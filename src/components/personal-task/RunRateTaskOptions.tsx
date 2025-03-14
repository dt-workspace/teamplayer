// src/components/personal-task/RunRateTaskOptions.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { TaskType, TaskStatus } from '@components/project-run-rate/types';

type RunRateTaskOptionsProps = {
  taskType: TaskType;
  taskStatus: TaskStatus;
  onTaskTypeChange: (type: TaskType) => void;
  onTaskStatusChange: (status: TaskStatus) => void;
  getPointsForTaskType: (type: TaskType) => number;
};

export const RunRateTaskOptions: React.FC<RunRateTaskOptionsProps> = ({
  taskType,
  taskStatus,
  onTaskTypeChange,
  onTaskStatusChange,
  getPointsForTaskType,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Run Rate Values</Text>
      
      {/* Task Type Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Task Type</Text>
        <View style={styles.taskTypeSelector}>
          {(['Small', 'Medium', 'Large'] as TaskType[]).map(type => (
            <TouchableOpacity 
              key={type}
              style={[
                styles.taskTypeOption, 
                taskType === type && styles.taskTypeOptionSelected
              ]}
              onPress={() => onTaskTypeChange(type)}
            >
              <Text 
                style={[
                  styles.taskTypeOptionText, 
                  taskType === type && styles.taskTypeOptionTextSelected
                ]}
              >
                {type} ({getPointsForTaskType(type)} pts)
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Task Status Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Status</Text>
        <View style={styles.statusSelector}>
          {(['To Do', 'In Progress', 'Completed'] as TaskStatus[]).map(status => (
            <TouchableOpacity 
              key={status}
              style={[
                styles.statusOption, 
                taskStatus === status && styles.statusOptionSelected,
                taskStatus === status && {
                  backgroundColor: 
                    status === 'Completed' ? colors.success : 
                    status === 'In Progress' ? colors.primary : 
                    colors.secondary
                }
              ]}
              onPress={() => onTaskStatusChange(status)}
            >
              <Text 
                style={[
                  styles.statusOptionText, 
                  taskStatus === status && styles.statusOptionTextSelected
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Icon name="information-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>
          These values will be used to calculate the project's run rate metrics.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: typography.fontSizes.sm,
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
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskTypeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusOptionSelected: {
    borderColor: 'transparent',
  },
  statusOptionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  statusOptionTextSelected: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  infoText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
});