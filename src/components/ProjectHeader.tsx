// src/components/ProjectHeader.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation } from '@constants/theme';

type ProjectHeaderProps = {
  title: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  onBack,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Icon name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={onEdit}
        >
          <Icon name="pencil" size={20} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Icon name="delete" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.card,
    ...elevation.small,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginHorizontal: spacing.md,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});