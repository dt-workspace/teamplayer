// src/components/TeamAssignmentSection.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { TeamMember } from '@models/TeamMember';
import { TeamMemberList } from './TeamMemberList';

type AssignedMember = {
  id: number;
  role: string;
  memberData?: TeamMember;
};

type TeamAssignmentSectionProps = {
  assignedMembers: AssignedMember[];
  availableMembers: TeamMember[];
  showAssignmentModal: boolean;
  onToggleAssignmentModal: () => void;
  onMembersReordered: (members: AssignedMember[]) => void;
  onRemoveMember: (memberId: number) => void;
  onUpdateRole: (memberId: number, newRole: string) => void;
  onAddMember: (member: TeamMember) => void;
};

export const TeamAssignmentSection: React.FC<TeamAssignmentSectionProps> = ({
  assignedMembers,
  availableMembers,
  showAssignmentModal,
  onToggleAssignmentModal,
  onMembersReordered,
  onRemoveMember,
  onUpdateRole,
  onAddMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter available members based on search query
  const filteredMembers = availableMembers.filter(member => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    return (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  });
  
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Team Assignments</Text>
        <TouchableOpacity 
          style={styles.addMemberButton}
          onPress={onToggleAssignmentModal}
        >
          <Icon name={showAssignmentModal ? "chevron-up" : "account-plus"} size={20} color={colors.primary} />
          <Text style={styles.addMemberButtonText}>
            {showAssignmentModal ? "Hide" : "Add Member"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Drag and drop team member list */}
      {assignedMembers.length > 0 ? (
        <TeamMemberList
          members={assignedMembers}
          onMembersReordered={onMembersReordered}
          onRemoveMember={onRemoveMember}
          onUpdateRole={onUpdateRole}
        />
      ) : (
        <View style={styles.emptyTeamContainer}>
          <Icon name="account-group-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyTeamText}>No team members assigned</Text>
          <Text style={styles.emptyTeamSubtext}>Add team members to this project</Text>
        </View>
      )}
      
      {/* Available members to add */}
      {showAssignmentModal && (
        <View style={styles.availableMembersContainer}>
          <Text style={styles.availableMembersTitle}>Available Team Members</Text>
          
          {/* Search input */}
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          <ScrollView style={styles.availableMembersScrollView} showsVerticalScrollIndicator={false}>
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <View key={member.id} style={styles.availableMemberRow}>
                  <View style={styles.availableMemberInfo}>
                    <Text style={styles.availableMemberName}>{member.name}</Text>
                    <Text style={styles.availableMemberRole}>{member.role}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.assignButton}
                    onPress={() => onAddMember(member)}
                  >
                    <Text style={styles.assignButtonText}>Assign</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noAvailableMembersText}>
                {searchQuery.length > 0 
                  ? `No members matching "${searchQuery}"` 
                  : "No available team members"}
              </Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  addMemberButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  emptyTeamContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    ...elevation.small,
  },
  emptyTeamText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyTeamSubtext: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  availableMembersContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    ...elevation.small,
    maxHeight: 300, // Set a maximum height for the container
  },
  availableMembersScrollView: {
    flexGrow: 0,
  },
  availableMembersTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: typography.fontSizes.md,
    color: colors.text,
    marginLeft: spacing.xs,
    paddingVertical: spacing.xs,
  },
  availableMemberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  availableMemberInfo: {
    flex: 1,
  },
  availableMemberName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  availableMemberRole: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  assignButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  assignButtonText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  noAvailableMembersText: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.md,
  },
});