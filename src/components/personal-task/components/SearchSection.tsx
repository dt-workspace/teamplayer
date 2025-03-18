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
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm
  },
  searchInput: {
    ...typography.body1,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm
  },
  filterButton: {
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md
  }
});

export default memo(SearchSection);