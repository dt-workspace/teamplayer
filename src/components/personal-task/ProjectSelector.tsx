// src/components/personal-task/ProjectSelector.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { Project } from '@models/Project';

type ProjectSelectorProps = {
  selectedProjectId?: number | null;
  onSelectProject: (project: Project | null) => void;
  projects: Project[];
  isLoading: boolean;
  onSearchProjects: (query: string) => void;
};

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProjectId,
  onSelectProject,
  projects,
  isLoading,
  onSearchProjects,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Find the selected project in the projects list
  useEffect(() => {
    if (selectedProjectId) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        setSelectedProject(project);
      }
    } else {
      setSelectedProject(null);
    }
  }, [selectedProjectId, projects]);

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearchProjects(text);
  };

  // Handle project selection
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    onSelectProject(project);
    setShowDropdown(false);
    setSearchQuery('');
  };

  // Handle clearing the selected project
  const handleClearProject = () => {
    setSelectedProject(null);
    onSelectProject(null);
    setSearchQuery('');
  };

  // Render project item
  const renderProjectItem = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => handleSelectProject(item)}
    >
      <View style={styles.projectItemContent}>
        <Icon name="folder-outline" size={20} color={colors.primary} />
        <Text style={styles.projectName} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <Text style={styles.projectPriority}>
        {item.priority}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Project (Optional)</Text>
      
      {selectedProject ? (
        <View style={styles.selectedProjectContainer}>
          <View style={styles.selectedProjectInfo}>
            <Icon name="folder" size={20} color={colors.primary} />
            <Text style={styles.selectedProjectName} numberOfLines={1}>
              {selectedProject.name}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearProject}
          >
            <Icon name="close" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search for a project..."
            placeholderTextColor={colors.placeholder}
            onFocus={() => setShowDropdown(true)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Icon
              name={showDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}

      {showDropdown && !selectedProject && (
        <View style={styles.dropdownContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Loading projects...</Text>
            </View>
          ) : projects.length > 0 ? (
            <FlatList
              data={projects}
              renderItem={renderProjectItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.projectList}
              maxHeight={200}
            />
          ) : (
            <Text style={styles.emptyText}>
              {searchQuery ? "No projects found" : "Start typing to search projects"}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  searchButton: {
    padding: spacing.md,
  },
  dropdownContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    maxHeight: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  projectList: {
    maxHeight: 200,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  projectItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectName: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  projectPriority: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  selectedProjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  selectedProjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedProjectName: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  clearButton: {
    padding: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.md,
  },
});