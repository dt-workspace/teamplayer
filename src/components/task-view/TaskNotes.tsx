import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';

interface TaskNotesProps {
  notes?: string;
}

export const TaskNotes: React.FC<TaskNotesProps> = ({ notes }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="text" size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Notes</Text>
      </View>
      <Text style={styles.notesText}>
        {notes || 'No notes available for this task'}
      </Text>
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
  notesText: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    lineHeight: 22,
  },
});
