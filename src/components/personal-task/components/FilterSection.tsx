// src/components/personal-task/components/FilterSection.tsx
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { FilterSectionProps, SortOption } from './types';

const ScrollableFilterOptions = memo(({ 
  options, 
  selectedOption, 
  onSelect 
}: { 
  options: string[], 
  selectedOption: string, 
  onSelect: (option: string) => void 
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.optionsScrollView}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.filterOption,
            selectedOption === option && styles.filterOptionSelected
          ]}
          onPress={() => onSelect(option)}
        >
          <Text 
            style={[
              styles.filterOptionText,
              selectedOption === option && styles.filterOptionTextSelected
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

const FilterSection: React.FC<FilterSectionProps> = ({
  show,
  filterOptions,
  onFilterChange,
  sortBy,
  sortAscending,
  onSortChange,
  onSortDirectionChange,
  onReset
}) => {
  if (!show) return null;

  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Status</Text>
        <ScrollableFilterOptions
          options={['All', 'To Do', 'In Progress', 'On Hold', 'Completed']}
          selectedOption={filterOptions.status}
          onSelect={(status) => onFilterChange({ ...filterOptions, status: status as any })}
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Priority</Text>
        <ScrollableFilterOptions
          options={['All', 'High', 'Medium', 'Low']}
          selectedOption={filterOptions.priority}
          onSelect={(priority) => onFilterChange({ ...filterOptions, priority: priority as any })}
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollableFilterOptions
          options={['All', 'Admin', 'Meetings', 'Development', 'Design', 'Research', 'Other']}
          selectedOption={filterOptions.category}
          onSelect={(category) => onFilterChange({ ...filterOptions, category: category as any })}
        />
      </View>

      <View style={styles.sortSection}>
        <Text style={styles.filterLabel}>Sort by</Text>
        <View style={styles.sortOptions}>
          {(['dueDate', 'priority', 'status', 'name'] as SortOption[]).map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.sortOption, sortBy === option && styles.sortOptionSelected]}
              onPress={() => onSortChange(option)}
            >
              <Text style={[styles.sortOptionText, sortBy === option && styles.sortOptionTextSelected]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.sortDirectionButton}
            onPress={onSortDirectionChange}
          >
            <Icon
              name={sortAscending ? 'sort-ascending' : 'sort-descending'}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.resetFiltersButton}
        onPress={onReset}
      >
        <Icon name="refresh" size={16} color={colors.primary} />
        <Text style={styles.resetFiltersText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md
  },
  filterSection: {
    marginBottom: spacing.md
  },
  filterLabel: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginBottom: spacing.sm
  },
  optionsScrollView: {
    flexGrow: 0
  },
  filterOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm
  },
  filterOptionSelected: {
    backgroundColor: colors.primary
  },
  filterOptionText: {
    ...typography.body2,
    color: colors.text
  },
  filterOptionTextSelected: {
    color: colors.card
  },
  sortSection: {
    marginBottom: spacing.md
  },
  sortOptions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sortOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm
  },
  sortOptionSelected: {
    backgroundColor: colors.primary
  },
  sortOptionText: {
    ...typography.body2,
    color: colors.text
  },
  sortOptionTextSelected: {
    color: colors.card
  },
  sortDirectionButton: {
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md
  },
  resetFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md
  },
  resetFiltersText: {
    ...typography.body2,
    color: colors.primary,
    marginLeft: spacing.sm
  }
});

export default memo(FilterSection);