import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';

interface Subtask {
  name: string;
  completed: boolean;
}

interface TaskSubtasksProps {
  subtasks: Subtask[];
  toggleSubtaskCompletion: (index: number) => void;
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({ 
  subtasks, 
  toggleSubtaskCompletion 
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="format-list-checks" size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Subtasks ({subtasks.length})</Text>
      </View>
      {subtasks.map((subtask, index) => (
        <TouchableOpacity
          key={index}
          style={styles.subtaskItem}
          onPress={() => toggleSubtaskCompletion(index)}
          activeOpacity={0.7}
        >
          <View style={styles.subtaskCheckbox}>
            <Icon
              name={subtask.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={22}
              color={subtask.completed ? colors.success : colors.textSecondary}
            />
          </View>
          <Text style={[
            styles.subtaskText,
            subtask.completed && styles.subtaskCompleted
          ]}>
            {subtask.name}
          </Text>
        </TouchableOpacity>
      ))}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#e9ecef',
  },
  subtaskCheckbox: {
    marginRight: spacing.sm,
  },
  subtaskText: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    flex: 1,
  },
  subtaskCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
});
