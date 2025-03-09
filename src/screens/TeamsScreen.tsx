// src/screens/TeamsScreen.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { TeamMember } from '@models/TeamMember';
import { TeamMemberCard } from '@components/TeamMemberCard';
import { RBSheetTeamMemberForm } from '@components/RBSheetTeamMemberForm';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TeamsStackParamList } from './TeamMemberDetailScreen';
import * as TeamJSON from '../utils/teamMember.json';
import Delete from '../assets/icons/delete';
import Import from '../assets/icons/import';
import { teamController } from '@controllers/index';

// Mock data for groups - in a real app, this would come from an API or store
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

type TeamsScreenProps = {
  navigation: StackNavigationProp<TeamsStackParamList, 'TeamsList'>;
  route: any; // Adding route prop for potential route.params usage
};

export const TeamsScreen: React.FC<TeamsScreenProps> = ({ navigation, route }) => {
  // State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'status' | 'group'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedMember, setSelectedMember] = useState<TeamMember | undefined>(undefined);
  const bottomSheetRef = useRef<import('@components/RBSheetTeamMemberForm').RBSheetTeamMemberFormRef>(null);


  // Fetch team members
  const fetchTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      // In a real app, you would get the actual user ID from auth context/store
      const userId = 1;
      const response = await teamController.getTeamMembersByUser(userId);

      if (response.success && response.data) {
        setTeamMembers(response.data);
        setFilteredMembers(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to fetch team members');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and handle edit from detail screen
  useEffect(() => {
    fetchTeamMembers();

    // Check if we're coming back from detail screen with edit request
    if (route.params?.editMemberId) {
      const editId = route.params.editMemberId;
      const memberToEdit = teamMembers.find(m => m.id === editId);
      if (memberToEdit) {
        setSelectedMember(memberToEdit);
        bottomSheetRef.current?.open();
        // Clear the params after handling
        navigation.setParams({ editMemberId: undefined });
      }
    }
  }, [fetchTeamMembers, route.params?.editMemberId]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTeamMembers();
  };

  // Search filter function
  const applySearchFilter = useCallback((members: TeamMember[], query: string) => {
    if (!query) return members;
    const lowercaseQuery = query.toLowerCase();
    return members.filter(member => {
      // Check the current sort field first
      switch (sortBy) {
        case 'name':
          if (member.name.toLowerCase().includes(lowercaseQuery)) return true;
          break;
        case 'role':
          if (member.role.toLowerCase().includes(lowercaseQuery)) return true;
          break;
        case 'status':
          if (member.status.toLowerCase().includes(lowercaseQuery)) return true;
          break;
        case 'group':
          try {
            const groups = member.groupIds ? JSON.parse(member.groupIds) : [];
            return groups.some(group => group.toLowerCase().includes(lowercaseQuery));
          } catch (e) {
            return false;
          }
      }
      
      // If no match in the sorted field, check other fields
      return (
        member.name.toLowerCase().includes(lowercaseQuery) ||
        member.role.toLowerCase().includes(lowercaseQuery) ||
        member.status.toLowerCase().includes(lowercaseQuery)
      );
    });
  }, [sortBy]);

  // Field-based filter function
  const applyFieldFilter = useCallback((members: TeamMember[], field: typeof sortBy) => {
    if (!field) return members;

    switch (field) {
      case 'role':
        return members.filter(member => member.role && member.role.trim() !== '');
      case 'status':
        return members.filter(member => member.status && member.status.trim() !== '');
      case 'group':
        return members.filter(member => {
          try {
            const groups = member.groupIds ? JSON.parse(member.groupIds) : [];
            return groups.length > 0;
          } catch (e) {
            return false;
          }
        });
      default:
        return members;
    }
  }, []);

  // Sort function
  const applySorting = useCallback((members: TeamMember[], field: typeof sortBy, order: typeof sortOrder) => {
    const getValue = (member: TeamMember, field: typeof sortBy): string => {
      switch (field) {
        case 'name':
          return member.name.toLowerCase();
        case 'role':
          return member.role.toLowerCase();
        case 'status':
          return member.status.toLowerCase();
        case 'group':
          try {
            const groups = member.groupIds ? JSON.parse(member.groupIds) : [];
            return groups.length > 0 ? groups[0].toLowerCase() : '';
          } catch (e) {
            return '';
          }
        default:
          return member.name.toLowerCase();
      }
    };

    return [...members].sort((a, b) => {
      const valueA = getValue(a, field);
      const valueB = getValue(b, field);
      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  }, []);

  // Filter and sort team members
  useEffect(() => {
    let result = [...teamMembers];
    result = applySearchFilter(result, searchQuery);
    result = applyFieldFilter(result, sortBy);
    result = applySorting(result, sortBy, sortOrder);
    setFilteredMembers(result);
  }, [teamMembers, searchQuery, sortBy, sortOrder, applySearchFilter, applyFieldFilter, applySorting]);

  // Toggle sort order
  const toggleSort = (field: 'name' | 'role' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle add/edit team member
  const handleAddEditMember = async (member: Omit<TeamMember, 'id' | 'userId'>) => {
    try {
      setIsLoading(true);
      const userId = 1; // In a real app, get from auth context

      let response;
      if (selectedMember) {
        // Edit existing member
        response = await teamController.updateTeamMember(selectedMember.id, member);
      } else {
        // Add new member
        response = await teamController.createTeamMember(userId, member);
      }

      if (response.success) {
        fetchTeamMembers();
        bottomSheetRef.current?.close();
        setSelectedMember(undefined);
        Alert.alert(
          'Success',
          selectedMember
            ? 'Team member updated successfully'
            : 'Team member added successfully'
        );
      } else {
        Alert.alert('Error', response.error || 'Operation failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete team member
  const handleDeleteMember = async (member: TeamMember) => {
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
                fetchTeamMembers();
                Alert.alert('Success', 'Team member deleted successfully');
              } else {
                Alert.alert('Error', response.error || 'Failed to delete team member');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Render swipeable actions
  const renderRightActions = (member: TeamMember) => {
    return (
      <View style={styles.swipeActionsContainer}>
        <TouchableOpacity
          style={[styles.swipeAction, styles.editAction]}
          onPress={() => {
            setSelectedMember(member);
            bottomSheetRef.current?.open();
          }}
        >
          <Text style={styles.swipeActionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.swipeAction, styles.deleteAction]}
          onPress={() => handleDeleteMember(member)}
        >
          <Text style={styles.swipeActionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Handle view team member details
  const handleViewMemberDetails = (member: TeamMember) => {
    // Navigate to the detail screen with the member ID
    navigation.navigate('TeamMemberDetail', { memberId: member.id });
  };

  // Render team member item
  const renderItem = ({ item }: { item: TeamMember }) => {
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <TeamMemberCard
          member={item}
          onEdit={(member) => {
            setSelectedMember(member);
            bottomSheetRef.current?.open();
          }}
          onDelete={handleDeleteMember}
          onViewDetails={handleViewMemberDetails}
        />
      </Swipeable>
    );
  };

  // Handle CSV import
  const handleImportCSV = async () => {
    try {
      const userId = 1; // In a real app, get from auth context
      const members = TeamJSON.data

      let successCount = 0;
      let errorCount = 0;
      console.log(members)

      for (const member of members) {
        

        const response = await teamController.createTeamMember(userId, member);
        if (response.success) {
          successCount++;
        } else {
          errorCount++;
          console.error(`Failed to import ${member.name}:`, response.error);
        }
      }

      fetchTeamMembers();
      Alert.alert(
        'Import Complete',
        `Successfully imported ${successCount} members.\n${errorCount} members failed to import.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to import CSV file');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flexDirection:"row",justifyContent:'space-between'}}>
            <Text style={styles.title}>Team Dashboard</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => {
                  Alert.alert(
                    'Confirm Delete All',
                    'Are you sure you want to delete all team members? This action cannot be undone.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete All',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            setIsLoading(true);
                            const userId = 1; // In a real app, get from auth context
                            const response = await teamController.deleteAllTeamMembers(userId);

                            if (response.success) {
                              fetchTeamMembers();
                              Alert.alert('Success', 'All team members deleted successfully');
                            } else {
                              Alert.alert('Error', response.error || 'Failed to delete all team members');
                            }
                          } catch (error) {
                            Alert.alert('Error', 'An unexpected error occurred');
                            console.error(error);
                          } finally {
                            setIsLoading(false);
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <Delete width={"18px"} height={"18px"}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button]}
                onPress={handleImportCSV}
              >
                <Import width={"18px"} height={"18px"}/>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or role"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>

            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
              onPress={() => toggleSort('name')}
            >
              <Text style={styles.sortButtonText}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'role' && styles.activeSortButton]}
              onPress={() => toggleSort('role')}
            >
              <Text style={styles.sortButtonText}>
                Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'status' && styles.activeSortButton]}
              onPress={() => toggleSort('status')}
            >
              <Text style={styles.sortButtonText}>
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'group' && styles.activeSortButton]}
              onPress={() => toggleSort('group')}
            >
              <Text style={styles.sortButtonText}>
                Group {sortBy === 'group' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading team members...</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={filteredMembers}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchQuery
                      ? 'No team members match your search'
                      : 'No team members found'}
                  </Text>
                </View>
              }
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setSelectedMember(undefined);
                bottomSheetRef.current?.open();
              }}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </>
        )}

        <RBSheetTeamMemberForm
          ref={bottomSheetRef}
          initialValues={selectedMember}
          onSubmit={handleAddEditMember}
          onClose={() => {
            setSelectedMember(undefined);
          }}
          groups={MOCK_GROUPS}
        />
      </View>

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    padding: spacing.md,
    ...elevation.small,

  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sortLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  sortButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  activeSortButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortButtonText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
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
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.medium,
  },
  addButtonText: {
    fontSize: typography.fontSizes.xxl,
    color: colors.card,
    fontWeight: typography.fontWeights.bold,
  },

  swipeActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  editAction: {
    backgroundColor: colors.info,
  },
  deleteAction: {
    backgroundColor: colors.error,
  },
  swipeActionText: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  button: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginLeft: spacing.xs,
  },
  importButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: typography.fontSizes.xs,
    fontWeight: 'bold',
  },
  deleteAllButton:{
    backgroundColor: colors.error,
  }
})
