import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { PersonalTask } from '@models/PersonalTask';
import dayjs from 'dayjs';

interface TaskTimeRemainingProps {
  task: PersonalTask;
}

export const TaskTimeRemaining: React.FC<TaskTimeRemainingProps> = ({ task }) => {
  const getRemainingTime = () => {
    const now = dayjs();
    const dueDate = dayjs(task.dueDate);
    const isPast = dueDate.isBefore(now);
    
    if (isPast) {
      return <Text style={styles.overdue}>Overdue</Text>;
    }
    
    const days = dueDate.diff(now, 'day');
    const hours = dueDate.diff(now, 'hour') % 24;
    
    return days > 0 
      ? `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`
      : hours > 0 
        ? `${hours} hour${hours !== 1 ? 's' : ''}`
        : 'Due today';
  };

  return (
    <View style={styles.timeCard}>
      <View style={styles.timeIcon}>
        <Icon name="timer-outline" size={22} color={colors.white} />
      </View>
      <View style={styles.timeContent}>
        <Text style={styles.timeLabel}>Time Remaining</Text>
        <Text style={styles.timeValue}>
          {getRemainingTime()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...elevation.small,
  },
  timeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  timeContent: {
    flex: 1,
  },
  timeLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  overdue: {
    color: colors.error,
    fontWeight: typography.fontWeights.bold,
  },
});
