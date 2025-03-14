// src/screens/TeamMemberDetailScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TeamMember } from '@models/TeamMember';
import { TeamController } from '@controllers/TeamController';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { RBSheetTeamMemberForm } from '@components/RBSheetTeamMemberForm';

// Define the params for the Teams stack navigator
export type TeamsStackParamList = {
  TeamsList: { editMemberId?: number };
  TeamMemberDetail: { memberId: number };
  ProjectDetailScreen: { projectId: number };
};

type TeamMemberDetailScreenProps = {
  route: RouteProp<TeamsStackParamList, 'TeamMemberDetail'>;
  navigation: StackNavigationProp<TeamsStackParamList, 'TeamMemberDetail'>;
};

export const TeamMemberDetailScreen: React.FC<TeamMemberDetailScreenProps> = ({ route, navigation }) => {
  const { memberId } = route.params;
  const [member, setMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  
  const teamController = new TeamController();
  const bottomSheetRef = useRef<import('@components/RBSheetTeamMemberForm').RBSheetTeamMemberFormRef>(null);

  useEffect(() => {
    fetchTeamMember();
  }, [memberId]);

  const fetchTeamMember = async () => {
    try {
      setIsLoading(true);
      const response = await teamController.getTeamMemberById(memberId);
      
      if (response.success && response.data) {
        setMember(response.data);
        
        // Parse group IDs if available
        if (response.data.groupIds) {
          try {
            setGroups(JSON.parse(response.data.groupIds));
          } catch (e) {
            setGroups([]);
          }
        }
      } else {
        Alert.alert('Error', response.error || 'Failed to fetch team member details');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = async () => {
    if (!member?.phone) {
      Alert.alert('No Phone Number', 'This team member does not have a phone number.');
      return;
    }
    
    try {
      await Linking.openURL(`tel:${member.phone}`);
    } catch (error) {
      Alert.alert('Error', 'Could not open phone app.');
    }
  };

  const handleEmail = async () => {
    if (!member?.email) {
      Alert.alert('No Email', 'This team member does not have an email address.');
      return;
    }
    
    try {
      await Linking.openURL(`mailto:${member.email}`);
    } catch (error) {
      Alert.alert('Error', 'Could not open email app.');
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = () => {
    return member?.status === 'Free' ? colors.free : colors.occupied;
  };

  const handleEdit = () => {
    // Open the bottom sheet for editing
    if (member) {
      bottomSheetRef.current?.open();
    }
  };

  const handleUpdateMember = async (updatedMember: Omit<TeamMember, 'id' | 'userId'>) => {
    try {
      setIsLoading(true);
      const response = await teamController.updateTeamMember(memberId, updatedMember);
      
      if (response.success) {
        Alert.alert('Success', 'Team member updated successfully');
        fetchTeamMember(); // Refresh the member data
        bottomSheetRef.current?.close();
      } else {
        Alert.alert('Error', response.error || 'Failed to update team member');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!member) return;
    
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await teamController.deleteTeamMember(member.id);

              if (response.success) {
                Alert.alert('Success', 'Team member deleted successfully');
                navigation.goBack();
              } else {
                Alert.alert('Error', response.error || 'Failed to delete team member');
                setIsLoading(false);
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error(error);
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading team member details...</Text>
      </SafeAreaView>
    );
  }

  if (!member) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Team member not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Mock groups data - in a real app, you would fetch this from an API
  const MOCK_GROUPS = [
    { id: 'dev', name: 'Development' },
    { id: 'design', name: 'Design' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'management', name: 'Management' },
    { id:'finance', name: 'Finance'},
    { id:'intern', name: 'Intern'},
    { id:'hr', name: 'HR'},
    { id:'groupA', name: 'A level Developer'},
    { id:'groupB', name: 'B level Developer'},
  
  ];

  const getGroupName = (groupId: string) => {
    const group = MOCK_GROUPS.find(g => g.id === groupId);
    return group ? group.name : groupId;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Team Member Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View>
              <Text style={styles.name}>{member.name}</Text>
              <Text style={styles.role}>{member.role}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{member.status}</Text>
            </View>
          </View>
        </View>

        {/* Contact section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone:</Text>
              <Text style={styles.contactValue}>{member.phone || 'Not provided'}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.contactValue}>{member.email || 'Not provided'}</Text>
            </View>
          </View>
          <View style={styles.contactActions}>
            <TouchableOpacity 
              style={[styles.contactButton, !member.phone && styles.disabledButton]} 
              onPress={handleCall}
              disabled={!member.phone}
            >
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.contactButton, !member.email && styles.disabledButton]} 
              onPress={handleEmail}
              disabled={!member.email}
            >
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Groups section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Assignments</Text>
          {groups.length > 0 ? (
            <View style={styles.groupsList}>
              {groups.map((groupId, index) => (
                <View key={index} style={styles.groupItem}>
                  <Text style={styles.groupName}>{getGroupName(groupId)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Not assigned to any groups</Text>
          )}
        </View>

        {/* Timestamps section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timestamps</Text>
          <View style={styles.timestampItem}>
            <Text style={styles.timestampLabel}>Created:</Text>
            <Text style={styles.timestampValue}>{formatDate(member.createdAt)}</Text>
          </View>
          <View style={styles.timestampItem}>
            <Text style={styles.timestampLabel}>Last Updated:</Text>
            <Text style={styles.timestampValue}>{formatDate(member.updatedAt)}</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom sheet for editing team member */}
      <RBSheetTeamMemberForm
        ref={bottomSheetRef}
        initialValues={member || undefined}
        onSubmit={handleUpdateMember}
        onClose={() => {}}
        groups={MOCK_GROUPS}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  headerTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  placeholder: {
    width: 50, // To balance the back button on the left
  },
  profileSection: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  role: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  statusText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.small,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  contactInfo: {
    marginBottom: spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  contactLabel: {
    width: 80,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
  },
  contactValue: {
    flex: 1,
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.sm,
  },
  contactButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  contactButtonText: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  groupsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  groupItem: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  groupName: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  emptyText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  timestampItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  timestampLabel: {
    width: 120,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
  },
  timestampValue: {
    flex: 1,
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  editButton: {
    backgroundColor: colors.info,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    flex: 1,
    marginRight: spacing.md,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.md,
  },
  deleteButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    flex: 1,
    marginLeft: spacing.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSizes.lg,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  }
  },
);