// src/components/personal-task/components/SearchSection.tsx
import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { SearchSectionProps } from './types';

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters
}) => {
  return (
    <View style={styles.searchFilterContainer}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={onToggleFilters}
      >
        <Icon 
          name={showFilters ? 'filter' : 'filter-outline'} 
          size={20} 
          color={colors.primary} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs
  },
  searchInput: {
    ...typography.body1,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.xs,
    marginLeft: spacing.xs,
    fontSize: 14
  },
  filterButton: {
    padding: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md
  }
});

export default memo(SearchSection);