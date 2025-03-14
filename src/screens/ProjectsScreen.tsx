// src/screens/ProjectsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProjectCard } from '@components/ProjectCard';
import { RBSheetProjectForm, RBSheetProjectFormRef } from '@components/RBSheetProjectForm';
import { Project } from '@models/Project';
import { TeamMember } from '@models/TeamMember';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { projectController, teamController } from '@controllers/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the params for the Projects stack navigator
export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: { projectId: number };
};

type SortOption = 'deadline' | 'name' | 'priority';

export const ProjectsScreen: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('deadline');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  const navigation = useNavigation<StackNavigationProp<ProjectsStackParamList, 'ProjectsList'>>();
  const projectFormRef = useRef<RBSheetProjectFormRef>(null);

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectController.getAllProjects();
      
      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await teamController.getAllTeamMembers();
      
      if (response.success && response.data) {
        setTeamMembers(response.data);
      } 
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'userId'>) => {
    try {
      setIsLoading(true);
      const userString = await AsyncStorage.getItem('currentUser');
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id || 1; // Fallback to ID 1 if user not found
      const response = await projectController.createProject(userId, projectData);
      
      if (response.success) {
        projectFormRef.current?.close()
        Alert.alert('Success', 'Project created successfully');

        fetchProjects();
      } else {
        Alert.alert('Error', response.error || 'Failed to create project');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProject = (project: Project) => {
    navigation.navigate('ProjectDetailScreen', { projectId: project.id });
  };

  const sortProjects = (projects: Project[]): Project[] => {
    switch (sortBy) {
      case 'deadline':
        return [...projects].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      case 'name':
        return [...projects].sort((a, b) => a.name.localeCompare(b.name));
      case 'priority': {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return [...projects].sort((a, b) => {
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        });
      }
      default:
        return projects;
    }
  };

  const renderSortOption = (option: SortOption, label: string) => (
    <TouchableOpacity
      style={[styles.sortOption, sortBy === option && styles.sortOptionActive]}
      onPress={() => {
        setSortBy(option);
        setShowSortOptions(false);
      }}
    >
      <Text style={[styles.sortOptionText, sortBy === option && styles.sortOptionTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <Icon name="sort" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => projectFormRef.current?.open()}
          >
            <Icon name="plus" size={24} color={colors.card} />
          </TouchableOpacity>
        </View>
      </View>
      
      {showSortOptions && (
        <View style={styles.sortOptionsContainer}>
          <Text style={styles.sortByText}>Sort by:</Text>
          <View style={styles.sortOptions}>
            {renderSortOption('deadline', 'Deadline')}
            {renderSortOption('name', 'Name')}
            {renderSortOption('priority', 'Priority')}
          </View>
        </View>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      ) : projects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="clipboard-text-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No projects yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create your first project</Text>
        </View>
      ) : (
        <FlatList
          data={sortProjects(projects)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProjectCard 
              project={item} 
              onViewDetails={handleViewProject} 
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <RBSheetProjectForm
        ref={projectFormRef}
        onSubmit={handleCreateProject}
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
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.small,
  },
  sortOptionsContainer: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sortByText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sortOptions: {
    flexDirection: 'row',
  },
  sortOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortOptionText: {
    color: colors.text,
    fontSize: typography.fontSizes.sm,
  },
  sortOptionTextActive: {
    color: colors.card,
  },
  listContent: {
    padding: spacing.sm,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});