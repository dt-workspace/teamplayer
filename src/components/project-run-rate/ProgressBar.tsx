// src/components/project-run-rate/ProgressBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@constants/theme';

type ProgressBarProps = {
  completedPoints: number;
  totalPoints: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ completedPoints, totalPoints }) => {
  const percentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Task Progress</Text>
        <Text style={styles.progressStats}>
          {completedPoints} of {totalPoints} points completed
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${percentage}%` }]} 
          />
        </View>
        <Text style={styles.progressPercentage}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  progressStats: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.round,
  },
  progressPercentage: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginLeft: spacing.sm,
    width: 40,
    textAlign: 'right',
  },
});