import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { Milestone } from '@models/Milestone';

type MilestoneSelectorProps = {
  selectedMilestoneId?: number | null;
  onSelectMilestone: (milestone: Milestone | null) => void;
  milestones: Milestone[];
  isLoading: boolean;
  projectId: number | null;
  disabled: boolean;
};

export const MilestoneSelector: React.FC<MilestoneSelectorProps> = ({
  selectedMilestoneId,
  onSelectMilestone,
  milestones,
  isLoading,
  projectId,
  disabled,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Find the selected milestone in the milestones list
  useEffect(() => {
    if (selectedMilestoneId) {
      const milestone = milestones.find(m => m.id === selectedMilestoneId);
      if (milestone) {
        setSelectedMilestone(milestone);
      }
    } else {
      setSelectedMilestone(null);
    }
  }, [selectedMilestoneId, milestones]);

  // Reset selection when project changes
  useEffect(() => {
    if (!projectId) {
      setSelectedMilestone(null);
      onSelectMilestone(null);
    }
  }, [projectId]);

  // Handle milestone selection
  const handleSelectMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    onSelectMilestone(milestone);
    setShowDropdown(false);
    setSearchQuery('');
  };

  // Handle clearing the selected milestone
  const handleClearMilestone = () => {
    setSelectedMilestone(null);
    onSelectMilestone(null);
    setSearchQuery('');
  };

  // Render milestone item
  const renderMilestoneItem = ({ item }: { item: Milestone }) => (
    <TouchableOpacity
      style={styles.milestoneItem}
      onPress={() => handleSelectMilestone(item)}
    >
      <View style={styles.milestoneItemContent}>
        <Icon name="flag-outline" size={20} color={colors.primary} />
        <Text style={styles.milestoneName} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <Text style={styles.milestoneStatus}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  // Filter milestones based on search query
  const filteredMilestones = milestones.filter(milestone => 
    milestone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (disabled) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Milestone (Optional)</Text>
        <View style={[styles.searchContainer, styles.disabled]}>
          <Text style={styles.disabledText}>Select a project first</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Milestone (Optional)</Text>
      
      {selectedMilestone ? (
        <View style={styles.selectedMilestoneContainer}>
          <View style={styles.selectedMilestoneInfo}>
            <Icon name="flag" size={20} color={colors.primary} />
            <Text style={styles.selectedMilestoneName} numberOfLines={1}>
              {selectedMilestone.name}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearMilestone}
          >
            <Icon name="close" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for a milestone..."
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

      {showDropdown && !selectedMilestone && (
        <View style={styles.dropdownContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Loading milestones...</Text>
            </View>
          ) : filteredMilestones.length > 0 ? (
            <FlatList
              data={filteredMilestones}
              renderItem={renderMilestoneItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.milestoneList}
            />
          ) : (
            <Text style={styles.emptyText}>
              {searchQuery ? "No milestones found" : "Start typing to search milestones"}
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
    fontWeight: typography.fontWeights.medium as any,
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
  disabled: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    opacity: 0.6,
  },
  disabledText: {
    padding: spacing.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  milestoneList: {
    maxHeight: 200,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  milestoneItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  milestoneName: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  milestoneStatus: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  selectedMilestoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  selectedMilestoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedMilestoneName: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  clearButton: {
    padding: spacing.xs,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
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