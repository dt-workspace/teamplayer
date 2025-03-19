import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
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
        <Icon name="magnify" size={22} color={colors.primary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      <Pressable 
        style={({ pressed }) => [
          styles.filterButton,
          pressed && styles.filterButtonPressed
        ]}
        onPress={onToggleFilters}
      >
        <Icon 
          name={showFilters ? 'filter' : 'filter-outline'} 
          size={22} 
          color={colors.primary} 
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    minHeight: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: spacing.xs
  },
  searchInput: {
    ...typography.body1,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.sm,
    fontSize: 15,
    letterSpacing: 0.1
  },
  filterButton: {
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    height: 46,
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterButtonPressed: {
    opacity: 0.8,
    backgroundColor: colors.cardPressed || '#f0f0f0',
  }
});

export default memo(SearchSection);