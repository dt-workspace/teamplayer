import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { TaskStatus } from './types';

type TaskFiltersProps = {
  filterStatus: TaskStatus | 'All';
  setFilterStatus: (status: TaskStatus | 'All') => void;
  taskCount: number;
};

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filterStatus,
  setFilterStatus,
  taskCount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.tasksTitle}>Tasks</Text>
        <View style={styles.taskCountContainer}>
          <Text style={styles.taskCount}>{taskCount}</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {(['All', 'To Do', 'In Progress', 'Completed'] as Array<TaskStatus | 'All'>).map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filterStatus === status && styles.filterButtonActive]}
            onPress={() => setFilterStatus(status)}
          >
            <Text 
              style={[styles.filterButtonText, filterStatus === status && styles.filterButtonTextActive]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tasksTitle: {
    ...typography.h2,
    color: colors.text,
  },
  taskCountContainer: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  taskCount: {
    color: colors.white,
    ...typography.caption,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    marginRight: spacing.xs,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textSecondary,
    ...typography.body2,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
});