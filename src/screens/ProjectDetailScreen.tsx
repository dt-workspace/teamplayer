// src/screens/ProjectDetailScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProjectsStackParamList } from './ProjectsScreen';
import { Project } from '@models/Project';
import { TeamMember } from '@models/TeamMember';
import { RBSheetProjectForm, RBSheetProjectFormRef } from '@components/RBSheetProjectForm';
import { colors, spacing, typography } from '@constants/theme';
import { projectController, teamController } from '@controllers/index';
import { TaskController } from '@controllers/TaskController';

// Import the new components
import { ProjectHeader } from '@components/ProjectHeader';
import { ProjectDetails } from '@components/ProjectDetails';
import { TeamAssignmentSection } from '@components/TeamAssignmentSection';
import { ProjectRunRateSection } from '@components/ProjectRunRateSection';
import  MilestoneSection  from '@components/MilestoneSection';

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
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [assignedMembers, setAssignedMembers] = useState<AssignedMember[]>([]);
  const [availableMembers, setAvailableMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [userId, setUserId] = useState<number>(1); // Default user ID, should be replaced with actual logged-in user ID
  
  // Create an instance of TaskController
  const taskController = new TaskController();
  
  const projectFormRef = useRef<RBSheetProjectFormRef>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchProjectDetails();
    fetchTeamMembers();
    fetchProjectTasks();
  }, [route.params.projectId]);
  
  // Fetch tasks for the project
  const fetchProjectTasks = async () => {
    try {
      const response = await taskController.getTasksByProject(route.params.projectId);
      
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        console.error('Failed to fetch project tasks:', response.error);
      }
    } catch (error) {
      console.error('Error fetching project tasks:', error);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const response = await projectController.getProjectById(route.params.projectId);
      
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

  // Effect to populate memberData and availableMembers when teamMembers or assignedMembers change
  useEffect(() => {
    if (teamMembers.length > 0) {
      // Match assigned member IDs with full team member data
      if (assignedMembers.length > 0) {
        const updatedAssignedMembers = assignedMembers.map(assigned => {
          // Only update memberData if it's not already set
          if (!assigned.memberData) {
            return {
              ...assigned,
              memberData: teamMembers.find(member => member.id === assigned.id)
            };
          }
          return assigned;
        });
        
        // Only update state if there are changes
        const needsUpdate = updatedAssignedMembers.some(
          (member, index) => member.memberData !== assignedMembers[index].memberData
        );
        
        if (needsUpdate) {
          setAssignedMembers(updatedAssignedMembers);
        }
      }
      
      // Filter out already assigned members for the available members list
      const assignedIds = assignedMembers.map(member => member.id);
      setAvailableMembers(teamMembers.filter(member => !assignedIds.includes(member.id)));
    }
  }, [teamMembers, assignedMembers]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const handleEditProject = () => {
    if (project) {
      projectFormRef.current?.open();
    }
  };

  const handleUpdateProject = async (updatedProject: Omit<Project, 'id' | 'userId'>) => {
    try {
      setIsLoading(true);
      const response = await projectController.updateProject(route.params.projectId, updatedProject);
      
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
              const response = await projectController.deleteProject(route.params.projectId);
              
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
      const response = await projectController.updateProject(route.params.projectId, {
        ...project,
        assignedMembers: JSON.stringify(updatedAssignments.map(({ id, role }) => ({ id, role })))
      });
      
      if (response.success) {
        setAssignedMembers(updatedAssignments);
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

  // Add a team member to the project
  const addTeamMember = (member: TeamMember, role: string = 'Member') => {
    const newAssignment: AssignedMember = {
      id: member.id,
      role,
      memberData: member
    };
    
    const updatedAssignments = [...assignedMembers, newAssignment];
    setAssignedMembers(updatedAssignments);
    
    // Use the same debounced approach as drag-and-drop
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      handleAssignmentChange(updatedAssignments);
    }, 300);
  };

  // Remove a team member from the project
  const removeTeamMember = (memberId: number) => {
    const updatedAssignments = assignedMembers.filter(member => member.id !== memberId);
    setAssignedMembers(updatedAssignments);
    
    // Use the same debounced approach
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      handleAssignmentChange(updatedAssignments);
    }, 300);
  };

  // Update a team member's role in the project
  const updateMemberRole = (memberId: number, newRole: string) => {
    // Create a deep copy to avoid modifying objects passed to Reanimated worklets
    const updatedAssignments = assignedMembers.map(member => 
      member.id === memberId ? {
        id: member.id,
        role: newRole,
        memberData: member.memberData ? { ...member.memberData } : undefined
      } : { ...member }
    );
    
    setAssignedMembers(updatedAssignments);
    
    // Use the same debounced approach
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      handleAssignmentChange(updatedAssignments);
    }, 300);
  };

  // Handle updating project progress
  const handleUpdateProgress = async (newProgress: number) => {
    if (!project) return;
    
    try {
      setIsLoading(true);
      
      // Update the project with new progress
      const response = await projectController.updateProject(route.params.projectId, {
        ...project,
        progress: newProgress
      });
      
      if (response.success) {
        setProject(prev => prev ? { ...prev, progress: newProgress } : null);
      } else {
        Alert.alert('Error', response.error || 'Failed to update project progress');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a task to the project
  const handleAddTask = async (task: any) => {
    try {
      // Create a new task with the project ID
      const newTask = {
        name: `${task.type} Task`,
        dueDate: new Date().toISOString(),
        priority: 'Medium',
        status: task.status,
        taskType: task.type,
        points: task.points,
        notes: '',
        projectId: route.params.projectId
      };
      
      // Save the task to the database
      const response = await taskController.createPersonalTask(1, newTask); // Using a default user ID of 1
      
      if (response.success && response.data) {
        // Add the new task to the local state
        setTasks(prev => [...prev, response.data]);
      } else {
        console.error('Failed to create task:', response.error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  // Handle adding a personal task to the project's run rate calculations
  const handleAddPersonalTaskToRunRate = async (personalTask: any) => {
    if (personalTask.projectId === route.params.projectId && personalTask.runRateValues) {
      // Create a run rate task from the personal task
      const runRateTask = {
        id: Date.now(),
        type: personalTask.runRateValues.type,
        status: personalTask.runRateValues.status,
        points: personalTask.runRateValues.points,
        completionDate: personalTask.runRateValues.status === 'Completed' ? new Date().toISOString() : undefined,
        personalTaskId: personalTask.id // Reference to the personal task
      };
      
      setTasks(prev => [...prev, runRateTask]);
      // In a real app, you would save this to the database
    }
  };

  // Handle updating a task
  const handleUpdateTask = async (taskId: number, updates: any) => {
    try {
      // Find the task in the current state
      const taskToUpdate = tasks.find(task => task.id === taskId);
      
      if (!taskToUpdate) {
        console.error('Task not found:', taskId);
        return;
      }
      
      // Update the task in the database
      const response = await taskController.updatePersonalTask(taskId, updates);
      
      if (response.success) {
        // Update the task in the local state
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        ));
      } else {
        console.error('Failed to update task:', response.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
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
      <ProjectHeader 
        title={project.name}
        onBack={() => navigation.goBack()}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <ProjectDetails project={project} tags={tags} />
        
        <ProjectRunRateSection 
          projectId={project.id}
          startDate={project.startDate}
          deadline={project.deadline}
          developerCount={assignedMembers.length}
          tasks={tasks}
          onTaskAdded={handleAddTask}
          onTaskUpdated={handleUpdateTask}
        />
        
        <MilestoneSection 
          projectId={project.id}
          userId={userId}
        />
        
        <TeamAssignmentSection 
          assignedMembers={assignedMembers}
          availableMembers={availableMembers}
          showAssignmentModal={showAssignmentModal}
          onToggleAssignmentModal={() => setShowAssignmentModal(!showAssignmentModal)}
          onMembersReordered={(newMembers) => {
            setAssignedMembers(newMembers);
            
            // Debounce the API update
            if (updateTimeoutRef.current) {
              clearTimeout(updateTimeoutRef.current);
            }
            
            updateTimeoutRef.current = setTimeout(() => {
              if (project) {
                projectController.updateProject(route.params.projectId, {
                  assignedMembers: JSON.stringify(newMembers.map(({ id, role }) => ({ id, role })))
                }).catch(error => {
                  console.error('Failed to update member order:', error);
                });
              }
            }, 500);
          }}
          onRemoveMember={removeTeamMember}
          onUpdateRole={updateMemberRole}
          onAddMember={addTeamMember}
        />
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
  content: {
    flex: 1,
  },
  contentContainer: {
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
  backButton: {
    padding: spacing.xs,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});
            