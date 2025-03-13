// src/screens/ProjectDetailScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProjectsStackParamList } from './ProjectsScreen';
import { Project } from '@models/Project';
import { TeamMember } from '@models/TeamMember';
import { ProjectController } from '@controllers/ProjectController';
import { TeamController } from '@controllers/TeamController';
import { RBSheetProjectForm, RBSheetProjectFormRef } from '@components/RBSheetProjectForm';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { projectController, teamController } from '@controllers/index';

type ProjectDetailScreenProps = {
  route: RouteProp<ProjectsStackParamList, 'ProjectDetail'>;
  navigation: StackNavigationProp<ProjectsStackParamList, 'ProjectDetail'>;
};

type AssignedMember = {
  id: number;
  role: string;
  memberData?: TeamMember;
};

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [assignedMembers, setAssignedMembers] = useState<AssignedMember[]>([]);
  const [availableMembers, setAvailableMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  
  const projectFormRef = useRef<RBSheetProjectFormRef>(null);

  useEffect(() => {
    fetchProjectDetails();
    fetchTeamMembers();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const response = await projectController.getProjectById(projectId);
      
      if (response.success && response.data) {
        setProject(response.data);
        
        // Parse assigned members
        if (response.data.assignedMembers) {
          try {
            const members = JSON.parse(response.data.assignedMembers);
            setAssignedMembers(members);
          } catch (e) {
            setAssignedMembers([]);
          }
        }
        
        // Parse tags
        if (response.data.tags) {
          try {
            setTags(JSON.parse(response.data.tags));
          } catch (e) {
            setTags([]);
          }
        }
      } else {
        Alert.alert('Error', response.error || 'Failed to fetch project details');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await teamController.getAllTeamMembers();
      
      if (response.success && response.data) {
        setTeamMembers(response.data);
      } else {
        console.error('Failed to fetch team members:', response.error);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  useEffect(() => {
    // Match assigned member IDs with full team member data
    if (teamMembers.length > 0 && assignedMembers.length > 0) {
      const updatedAssignedMembers = assignedMembers.map(assigned => ({
        ...assigned,
        memberData: teamMembers.find(member => member.id === assigned.id)
      }));
      setAssignedMembers(updatedAssignedMembers);
      
      // Filter out already assigned members for the available members list
      const assignedIds = assignedMembers.map(member => member.id);
      setAvailableMembers(teamMembers.filter(member => !assignedIds.includes(member.id)));
    } else if (teamMembers.length > 0) {
      setAvailableMembers(teamMembers);
    }
  }, [teamMembers, assignedMembers]);

  const handleEditProject = () => {
    if (project) {
      projectFormRef.current?.open();
    }
  };

  const handleUpdateProject = async (updatedProject: Omit<Project, 'id' | 'userId'>) => {
    try {
      setIsLoading(true);
      const response = await projectController.updateProject(projectId, updatedProject);
      
      if (response.success) {
        Alert.alert('Success', 'Project updated successfully');
        fetchProjectDetails();
      } else {
        Alert.alert('Error', response.error || 'Failed to update project');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await projectController.deleteProject(projectId);
              
              if (response.success) {
                Alert.alert('Success', 'Project deleted successfully');
                navigation.goBack();
              } else {
                Alert.alert('Error', response.error || 'Failed to delete project');
                setIsLoading(false);
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'An unexpected error occurred');
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle team member assignment changes
  const handleAssignmentChange = async (updatedAssignments: AssignedMember[]) => {
    if (!project) return;
    
    try {
      setIsLoading(true);
      
      // Update the project with new assignments
      const response = await projectController.updateProject(projectId, {
        ...project,
        assignedMembers: JSON.stringify(updatedAssignments.map(({ id, role }) => ({ id, role })))
      });
      
      if (response.success) {
        setAssignedMembers(updatedAssignments);
        Alert.alert('Success', 'Team assignments updated successfully');
        fetchProjectDetails();
      } else {
        Alert.alert('Error', response.error || 'Failed to update team assignments');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag-and-drop reordering of team members
  const onDragEnd = ({ data }: { data: AssignedMember[] }) => {
    setAssignedMembers(data);
    handleAssignmentChange(data);
  };

  // Add a team member to the project
  const addTeamMember = (member: TeamMember, role: string = 'Member') => {
    const newAssignment: AssignedMember = {
      id: member.id,
      role,
      memberData: member
    };
    
    const updatedAssignments = [...assignedMembers, newAssignment];
    setAssignedMembers(updatedAssignments);
    handleAssignmentChange(updatedAssignments);
  };

  // Remove a team member from the project
  const removeTeamMember = (memberId: number) => {
    const updatedAssignments = assignedMembers.filter(member => member.id !== memberId);
    setAssignedMembers(updatedAssignments);
    handleAssignmentChange(updatedAssignments);
  };

  // Update a team member's role in the project
  const updateMemberRole = (memberId: number, newRole: string) => {
    const updatedAssignments = assignedMembers.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    );
    setAssignedMembers(updatedAssignments);
    handleAssignmentChange(updatedAssignments);
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
                  [{ text: 'Cancel' }, { text: 'Update', onPress: (role) => updateMemberRole(member.id, role || 'Member') }],
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
          onPress={() => removeTeamMember(member.id)}
        >
          <Icon name="close" size={20} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get priority color
  const getPriorityColor = () => {
    if (!project) return colors.info;
    
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading project details...</Text>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Project not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={1}>{project.name}</Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProject}
          >
            <Icon name="pencil" size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteProject}
          >
            <Icon name="delete" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Project Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Details</Text>
          
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[styles.detailValue, { color: project.status === 'Completed' ? colors.success : colors.primary }]}>
                {project.status || 'Active'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Progress:</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${project.progress || 0}%` }]} 
                  />
                </View>
                <Text style={styles.progressText}>{project.progress || 0}%</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{project.description}</Text>
          </View>
          
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Team Assignment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Assignments</Text>
            <TouchableOpacity 
              style={styles.addMemberButton}
              onPress={() => setShowAssignmentModal(!showAssignmentModal)}
            >
              <Icon name={showAssignmentModal ? "chevron-up" : "account-plus"} size={20} color={colors.primary} />
              <Text style={styles.addMemberButtonText}>
                {showAssignmentModal ? "Hide" : "Add Member"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Drag and drop team member list */}
          {assignedMembers.length > 0 ? (
            <View style={styles.teamContainer}>
              <Text style={styles.dragInstructions}>Long press and drag to reorder team members</Text>
              <DraggableFlatList
                data={assignedMembers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderAssignedMember}
                onDragEnd={onDragEnd}
                contentContainerStyle={styles.membersList}
              />
            </View>
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
              {availableMembers.length > 0 ? (
                availableMembers.map(member => (
                  <View key={member.id} style={styles.availableMemberRow}>
                    <View style={styles.availableMemberInfo}>
                      <Text style={styles.availableMemberName}>{member.name}</Text>
                      <Text style={styles.availableMemberRole}>{member.role}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.assignButton}
                      onPress={() => addTeamMember(member)}
                    >
                      <Text style={styles.assignButtonText}>Assign</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noAvailableMembersText}>No available team members</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      <RBSheetProjectForm
        ref={projectFormRef}
        initialValues={project}
        onSubmit={handleUpdateProject}
        onClose={() => {}}
        teamMembers={teamMembers}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.card,
    ...elevation.small,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginHorizontal: spacing.md,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
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
    marginBottom: spacing.sm,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...elevation.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  detailValue: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  priorityText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginRight: spacing.sm,
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
  descriptionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    ...elevation.small,
  },
  descriptionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    margin: spacing.xs,
  },
  tagText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
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
  },
  availableMembersTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});
              <Text style={styles.detailLabel}>Priority:</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                <Text style={styles.priorityText}>{project.priority}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[styles.detailValue, { color: project.status === 'Completed' ? colors.success : colors.primary }]}>
                {project.status || 'Active'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Progress:</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${project.progress || 0}%` }]} 
                  />
                </View>
                <Text style={styles.progressText}>{project.progress || 0}%</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{project.description}</Text>
          </View>
          
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Team Assignment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Assignments</Text>
            <TouchableOpacity 
              style={styles.addMemberButton}
              onPress={() => setShowAssignmentModal(!showAssignmentModal)}
            >
              <Icon name={showAssignmentModal ? "chevron-up" : "account-plus"} size={20} color={colors.primary} />
              <Text style={styles.addMemberButtonText}>
                {showAssignmentModal ? "Hide" : "Add Member"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Drag and drop team member list */}
          {assignedMembers.length > 0 ? (
            <View style={styles.teamContainer}>
              <Text style={styles.dragInstructions}>Long press and drag to reorder team members</Text>
              <DraggableFlatList
                data={assignedMembers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderAssignedMember}
                onDragEnd={onDragEnd}
                contentContainerStyle={styles.membersList}
              />
            </View>
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
              {availableMembers.length > 0 ? (
                availableMembers.map(member => (
                  <View key={member.id} style={styles.availableMemberRow}>
                    <View style={styles.availableMemberInfo}>
                      <Text style={styles.availableMemberName}>{member.name}</Text>
                      <Text style={styles.availableMemberRole}>{member.role}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.assignButton}
                      onPress={() => addTeamMember(member)}
                    >
                      <Text style={styles.assignButtonText}>Assign</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noAvailableMembersText}>No available team members</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      <RBSheetProjectForm
        ref={projectFormRef}
        initialValues={project}
        onSubmit={handleUpdateProject}
        onClose={() => {}}
        teamMembers={teamMembers}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.card,
    ...elevation.small,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginHorizontal: spacing.md,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
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
    marginBottom: spacing.sm,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...elevation.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  detailValue: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  priorityText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginRight: spacing.sm,
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
  descriptionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    ...elevation.small,
  },
  descriptionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    margin: spacing.xs,
  },
  tagText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
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
  },
  availableMembersTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});
              <Text style={styles.detailLabel}>Start Date:</Text>
              <Text style={styles.detailValue}>{formatDate(project.startDate)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[styles.detailValue, { color: project.status === 'Completed' ? colors.success : colors.primary }]}>
                {project.status || 'Active'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Progress:</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${project.progress || 0}%` }]} 
                  />
                </View>
                <Text style={styles.progressText}>{project.progress || 0}%</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{project.description}</Text>
          </View>
          
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Team Assignment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Assignments</Text>
            <TouchableOpacity 
              style={styles.addMemberButton}
              onPress={() => setShowAssignmentModal(!showAssignmentModal)}
            >
              <Icon name={showAssignmentModal ? "chevron-up" : "account-plus"} size={20} color={colors.primary} />
              <Text style={styles.addMemberButtonText}>
                {showAssignmentModal ? "Hide" : "Add Member"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Drag and drop team member list */}
          {assignedMembers.length > 0 ? (
            <View style={styles.teamContainer}>
              <Text style={styles.dragInstructions}>Long press and drag to reorder team members</Text>
              <DraggableFlatList
                data={assignedMembers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderAssignedMember}
                onDragEnd={onDragEnd}
                contentContainerStyle={styles.membersList}
              />
            </View>
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
              {availableMembers.length > 0 ? (
                availableMembers.map(member => (
                  <View key={member.id} style={styles.availableMemberRow}>
                    <View style={styles.availableMemberInfo}>
                      <Text style={styles.availableMemberName}>{member.name}</Text>
                      <Text style={styles.availableMemberRole}>{member.role}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.assignButton}
                      onPress={() => addTeamMember(member)}
                    >
                      <Text style={styles.assignButtonText}>Assign</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noAvailableMembersText}>No available team members</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      <RBSheetProjectForm
        ref={projectFormRef}
        initialValues={project}
        onSubmit={handleUpdateProject}
        onClose={() => {}}
        teamMembers={teamMembers}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.card,
    ...elevation.small,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginHorizontal: spacing.md,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
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
    marginBottom: spacing.sm,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...elevation.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  detailValue: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  priorityText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginRight: spacing.sm,
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
  descriptionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    ...elevation.small,
  },
  descriptionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    margin: spacing.xs,
  },
  tagText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
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
  },
  availableMembersTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});
              <Text style={styles.detailLabel}>Deadline:</Text>
              <Text style={styles.detailValue}>{formatDate(project.deadline)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[styles.detailValue, { color: project.status === 'Completed' ? colors.success : colors.primary }]}>
                {project.status || 'Active'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Progress:</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${project.progress || 0}%` }]} 
                  />
                </View>
                <Text style={styles.progressText}>{project.progress || 0}%</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{project.description}</Text>
          </View>
          
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Team Assignment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Assignments</Text>
            <TouchableOpacity 
              style={styles.addMemberButton}
              onPress={() => setShowAssignmentModal(!showAssignmentModal)}
            >
              <Icon name={showAssignmentModal ? "chevron-up" : "account-plus"} size={20} color={colors.primary} />
              <Text style={styles.addMemberButtonText}>
                {showAssignmentModal ? "Hide" : "Add Member"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Drag and drop team member list */}
          {assignedMembers.length > 0 ? (
            <View style={styles.teamContainer}>
              <Text style={styles.dragInstructions}>Long press and drag to reorder team members</Text>
              <DraggableFlatList
                data={assignedMembers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderAssignedMember}
                onDragEnd={onDragEnd}
                contentContainerStyle={styles.membersList}
              />
            </View>
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
              {availableMembers.length > 0 ? (
                availableMembers.map(member => (
                  <View key={member.id} style={styles.availableMemberRow}>
                    <View style={styles.availableMemberInfo}>
                      <Text style={styles.availableMemberName}>{member.name}</Text>
                      <Text style={styles.availableMemberRole}>{member.role}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.assignButton}
                      onPress={() => addTeamMember(member)}
                    >
                      <Text style={styles.assignButtonText}>Assign</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noAvailableMembersText}>No available team members</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      <RBSheetProjectForm
        ref={projectFormRef}
        initialValues={project}
        onSubmit={handleUpdateProject}
        onClose={() => {}}
        teamMembers={teamMembers}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.card,
    ...elevation.small,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginHorizontal: spacing.md,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
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
    marginBottom: spacing.sm,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...elevation.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  detailValue: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  priorityText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginRight: spacing.sm,
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
  descriptionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    ...elevation.small,
  },
  descriptionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    margin: spacing.xs,
  },
  tagText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
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
  },
  availableMembersTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});