import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography } from '@constants/theme';

interface TaskHeaderProps {
  navigation: any;
  handleEdit: () => void;
  handleDelete: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ 
  navigation, 
  handleEdit, 
  handleDelete 
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color={colors.white} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Task Details</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEdit}
          testID="editButton"
        >
          <Icon name="pencil" size={22} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
        >
          <Icon name="delete" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    padding: spacing.xs,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
