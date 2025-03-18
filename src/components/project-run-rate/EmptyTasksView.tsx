import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography } from '@constants/theme';
import { TaskStatus } from './types';

type EmptyTasksViewProps = {
  searchQuery: string;
  filterStatus: TaskStatus | 'All';
};

export const EmptyTasksView: React.FC<EmptyTasksViewProps> = ({
  searchQuery,
  filterStatus,
}) => {
  const getEmptyStateMessage = () => {
    if (searchQuery) {
      return `No results for "${searchQuery}"`;
    }
    return filterStatus === 'All'
      ? 'Add tasks to track project run rate'
      : `No ${filterStatus} tasks available`;
  };

  return (
    <View style={styles.container}>
      <Icon name="clipboard-text-outline" size={48} color={colors.textSecondary} />
      <Text style={styles.title}>No tasks found</Text>
      <Text style={styles.subtitle}>{getEmptyStateMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});