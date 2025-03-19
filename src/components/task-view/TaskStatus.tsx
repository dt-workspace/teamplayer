import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { PersonalTask } from '@models/PersonalTask';

interface TaskStatusProps {
  task: PersonalTask;
  hasSubtasks: boolean;
  progressAnim: Animated.Value;
  getStatusColor: (status: string) => string;
}

export const TaskStatus: React.FC<TaskStatusProps> = ({ 
  task, 
  hasSubtasks, 
  progressAnim,
  getStatusColor 
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Status</Text>
      <View style={styles.statusContainer}>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}
        >
          <Icon name={
            task.status.toLowerCase() === 'completed' ? 'check-circle' :
              task.status.toLowerCase() === 'in progress' ? 'progress-clock' : 'clock-outline'
          } size={16} color={colors.white} style={styles.statusIcon} />
          <Text style={styles.statusText}>{task.status}</Text>
        </View>
      </View>

      {/* Only show progress section if there are subtasks */}
      {hasSubtasks && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercent}>{task.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...elevation.small,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full || 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  progressSection: {
    marginTop: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  progressPercent: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.border || '#e9ecef',
    borderRadius: borderRadius.full || 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full || 20,
  },
});
