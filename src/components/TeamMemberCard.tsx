// src/components/TeamMemberCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { TeamMember } from '@models/TeamMember';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';

type TeamMemberCardProps = {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  onViewDetails: (member: TeamMember) => void;
};

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  onEdit, 
  onDelete,
  onViewDetails 
}) => {
  const getStatusColor = () => {
    return member.status === 'Free' ? colors.free : colors.occupied;
  };

  // Parse group IDs if available
  const getGroupsText = () => {
    if (!member.groupIds) return 'None';
    try {
      const groups = JSON.parse(member.groupIds);
      return groups.length > 0 ? `${groups.length} groups` : 'None';
    } catch (e) {
      return 'None';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onViewDetails(member)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Left side - Member info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{member.name}</Text>
          <Text style={styles.role}>{member.role}</Text>
          
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>Groups: {getGroupsText()}</Text>
          </View>
        </View>
        
        {/* Right side - Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{member.status}</Text>
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
  },
  role: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  detailsRow: {
    marginTop: spacing.sm,
  },
  detailsText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: spacing.md,
  },
  statusIndicator: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginBottom: spacing.md,
  },
  statusText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  viewButtonText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  }
}
);