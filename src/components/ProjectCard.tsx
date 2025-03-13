// src/components/ProjectCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ProgressBarAndroid, Platform } from 'react-native';
import { Project } from '@models/Project';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';

type ProjectCardProps = {
  project: Project;
  onViewDetails: (project: Project) => void;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onViewDetails 
}) => {
  // Get priority color
  const getPriorityColor = () => {
    switch(project.priority) {
      case 'High':
        return colors.error;
      case 'Medium':
        return colors.warning;
      case 'Low':
        return colors.info;
      default:
        return colors.info;
    }
  };

  // Parse assigned members if available
  const getAssignedMembersText = () => {
    if (!project.assignedMembers) return 'None';
    try {
      const members = JSON.parse(project.assignedMembers);
      return members.length > 0 ? `${members.length} members` : 'None';
    } catch (e) {
      return 'None';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate progress percentage (placeholder for now)
  const getProgressPercentage = () => {
    // In a real implementation, this would come from the project data
    return 0.6; // 60% complete
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onViewDetails(project)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Left side - Project info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{project.name}</Text>
          
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>Deadline: {formatDate(project.deadline)}</Text>
          </View>
          
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>Team: {getAssignedMembersText()}</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              {Platform.OS === 'android' ? (
                <ProgressBarAndroid 
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={getProgressPercentage()}
                  color={colors.primary}
                />
              ) : (
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${getProgressPercentage() * 100}%` }]} />
                </View>
              )}
            </View>
            <Text style={styles.progressText}>{Math.round(getProgressPercentage() * 100)}%</Text>
          </View>
        </View>
        
        {/* Right side - Priority */}
        <View style={styles.priorityContainer}>
          <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{project.priority}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.sm,
    ...elevation.medium,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailsRow: {
    marginTop: spacing.xs,
  },
  detailsText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  progressBarContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  priorityContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingLeft: spacing.md,
  },
  priorityIndicator: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  priorityText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  }
});