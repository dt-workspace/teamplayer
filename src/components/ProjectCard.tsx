// src/components/ProjectCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ProgressBarAndroid, Platform } from 'react-native';
import { Project } from '@models/Project';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

  // Calculate progress percentage
  const getProgressPercentage = () => {
    return project.progress ? project.progress / 100 : 0;
  };

  // Calculate Project Run Rate (PRR) and Required Project Run Rate (RPRR)
  const calculateRunRates = () => {
    const startDate = new Date(project.startDate);
    const deadlineDate = new Date(project.deadline);
    const currentDate = new Date();
    
    const totalDays = Math.ceil((deadlineDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, Math.ceil((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    const progressPercentage = project.progress || 0;
    
    // Calculate Project Run Rate (PRR) - current pace
    const prr = daysElapsed > 0 ? (progressPercentage / daysElapsed) * totalDays : 0;
    
    // Calculate Required Project Run Rate (RPRR) - required pace to complete on time
    const rprr = daysRemaining > 0 ? ((100 - progressPercentage) / daysRemaining) * daysRemaining : 100;
    
    return { prr, rprr, daysRemaining };
  };

  // Determine project status based on PRR vs RPRR
  const getProjectStatus = () => {
    const { prr, rprr, daysRemaining } = calculateRunRates();
    const progressPercentage = project.progress || 0;
    
    if (progressPercentage >= 100) return 'completed';
    if (daysRemaining <= 0) return 'overdue';
    if (prr >= rprr * 1.1) return 'ahead';
    if (prr >= rprr * 0.9) return 'onTrack';
    return 'behind';
  };

  // Get status icon and color
  const getStatusInfo = () => {
    const status = getProjectStatus();
    
    switch (status) {
      case 'ahead':
        return { icon: 'rocket', color: colors.success, text: 'Ahead' };
      case 'onTrack':
        return { icon: 'check-circle', color: colors.primary, text: 'On Track' };
      case 'behind':
        return { icon: 'alert', color: colors.warning, text: 'Behind' };
      case 'overdue':
        return { icon: 'alert-circle', color: colors.error, text: 'Overdue' };
      case 'completed':
        return { icon: 'check-circle', color: colors.success, text: 'Completed' };
      default:
        return { icon: 'help-circle', color: colors.textSecondary, text: 'Unknown' };
    }
  };

  const statusInfo = getStatusInfo();

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

          {/* Run Rate Status */}
          <View style={styles.runRateContainer}>
            <Icon name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.runRateText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
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
    marginBottom: spacing.md,
    ...elevation.small,
  },
  cardContent: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  infoContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  name: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  detailsText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  progressBarContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    width: 40,
    textAlign: 'right',
  },
  priorityContainer: {
    justifyContent: 'flex-start',
  },
  priorityIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.card,
  },
  runRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  runRateText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
});