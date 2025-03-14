// src/components/TeamMemberList.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { TeamMember } from '@models/TeamMember';

type AssignedMember = {
  id: number;
  role: string;
  memberData?: TeamMember;
};

type TeamMemberListProps = {
  members: AssignedMember[];
  onMembersReordered: (members: AssignedMember[]) => void;
  onRemoveMember: (memberId: number) => void;
  onUpdateRole: (memberId: number, newRole: string) => void;
};

export const TeamMemberList: React.FC<TeamMemberListProps> = ({
  members,
  onMembersReordered,
  onRemoveMember,
  onUpdateRole,
}) => {
  // Reference to track if we should update after drag
  const isDragging = useRef(false);
  
  // Handle drag-and-drop reordering of team members
  const onDragEnd = ({ data }: { data: AssignedMember[] }) => {
    // Create a deep copy of the data to avoid modifying objects passed to Reanimated worklets
    const newData = data.map(item => ({
      id: item.id,
      role: item.role,
      memberData: item.memberData ? { ...item.memberData } : undefined
    }));
    
    isDragging.current = true;
    onMembersReordered(newData);
  };
  
  // Render an assigned team member item
  const renderAssignedMember = ({ item, drag, isActive }: RenderItemParams<AssignedMember>) => {
    const member = item.memberData;
    if (!member) return null;
    
    return (
      <TouchableOpacity
        style={[styles.memberCard, isActive && styles.memberCardActive]}
        onLongPress={drag}
        activeOpacity={0.7}
      >
        <View style={styles.memberDragHandle}>
          <Icon name="drag" size={20} color={colors.textSecondary} />
        </View>
        
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <View style={styles.memberRoleContainer}>
            <TouchableOpacity 
              style={styles.memberRoleButton}
              onPress={() => {
                // Show role selection modal or prompt
                Alert.prompt(
                  'Update Role',
                  'Enter new role for this team member',
                  [{ text: 'Cancel' }, { text: 'Update', onPress: (role) => onUpdateRole(member.id, role || 'Member') }],
                  'plain-text',
                  item.role
                );
              }}
            >
              <Text style={styles.memberRoleText}>{item.role}</Text>
              <Icon name="pencil-outline" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.memberRemoveButton}
          onPress={() => onRemoveMember(member.id)}
        >
          <Icon name="close" size={20} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.teamContainer}>
      <Text style={styles.dragInstructions}>Long press and drag to reorder team members</Text>
      <DraggableFlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAssignedMember}
        onDragEnd={onDragEnd}
        contentContainerStyle={styles.membersList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  teamContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...elevation.small,
  },
  dragInstructions: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  membersList: {
    paddingBottom: spacing.sm,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    ...elevation.small,
  },
  memberCardActive: {
    backgroundColor: colors.primaryLight,
    opacity: 0.8,
  },
  memberDragHandle: {
    paddingHorizontal: spacing.xs,
  },
  memberInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  memberName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  memberRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  memberRoleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberRoleText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  memberRemoveButton: {
    padding: spacing.xs,
  },
});